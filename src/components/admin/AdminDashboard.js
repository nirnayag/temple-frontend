import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Alert, Tabs, Tab, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { devoteeService, eventService } from '../../services/api';
import authService from '../../services/auth';

const AdminDashboard = () => {
  const [adminProfile, setAdminProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [devotees, setDevotees] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    devotees: 0,
    events: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get admin profile
      const profileData = await authService.getProfile();
      setAdminProfile(profileData);
      
      // Get events
      const eventsResponse = await eventService.getAll();
      const eventData = eventsResponse.data;
      setEvents(eventData);
      
      // Get devotees
      const devoteesResponse = await devoteeService.getAll();
      const devoteeData = devoteesResponse.data;
      setDevotees(devoteeData);
      
      // Extract donations from all devotees
      const allDonations = [];
      devoteeData.forEach(devotee => {
        if (devotee.donationHistory && devotee.donationHistory.length > 0) {
          devotee.donationHistory.forEach(donation => {
            allDonations.push({
              ...donation,
              devoteeId: devotee._id,
              devoteeName: devotee.name
            });
          });
        }
      });
      
      // Sort donations by date (newest first)
      allDonations.sort((a, b) => new Date(b.date) - new Date(a.date));
      setDonations(allDonations);
      
      // Calculate stats
      const now = new Date();
      const upcomingEventsCount = eventData.filter(
        event => new Date(event.date) >= now
      ).length;
      
      setStats({
        devotees: devoteeData.length,
        events: eventData.length,
        upcomingEvents: upcomingEventsCount
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      setError('Failed to load admin dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading admin dashboard...</div>;
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error}
          <Button variant="outline-danger" size="sm" className="ms-3" onClick={fetchData}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="my-4">
      <Row className="mb-4">
        <Col>
          <h2>Admin Dashboard</h2>
          <p className="text-muted">Welcome, {adminProfile?.devotee?.name || adminProfile?.user?.username}</p>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/admin/events/create" variant="success" className="me-2">
            Create Event
          </Button>
          <Button as={Link} to="/admin/devotees/create" variant="primary">
            Add Devotee
          </Button>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="stats-card bg-primary text-white mb-4">
            <Card.Body>
              <Card.Title>Total Devotees</Card.Title>
              <h1>{stats.devotees}</h1>
              <Button as={Link} to="/admin/devotees" variant="outline-light" size="sm">
                View All Devotees
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stats-card bg-success text-white mb-4">
            <Card.Body>
              <Card.Title>Total Events</Card.Title>
              <h1>{stats.events}</h1>
              <Button as={Link} to="/admin/events" variant="outline-light" size="sm">
                View All Events
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stats-card bg-info text-white mb-4">
            <Card.Body>
              <Card.Title>Upcoming Events</Card.Title>
              <h1>{stats.upcomingEvents}</h1>
              <Button as={Link} to="/admin/events" variant="outline-light" size="sm">
                View All Events
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card>
        <Card.Body>
          <Tabs defaultActiveKey="devotees" className="mb-3">
            <Tab eventKey="devotees" title="Recent Devotees">
              {devotees.length === 0 ? (
                <Alert variant="info">No devotees found.</Alert>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Membership</th>
                        <th>Member Since</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {devotees.slice(0, 5).map(devotee => (
                        <tr key={devotee._id}>
                          <td>{devotee.name}</td>
                          <td>{devotee.email}</td>
                          <td>{devotee.phone || 'N/A'}</td>
                          <td>
                            <Badge bg={
                              devotee.membershipType === 'vip' ? 'danger' :
                              devotee.membershipType === 'lifetime' ? 'success' : 'primary'
                            }>
                              {devotee.membershipType}
                            </Badge>
                          </td>
                          <td>{new Date(devotee.memberSince).toLocaleDateString()}</td>
                          <td>
                            <Button as={Link} to={`/admin/devotees/${devotee._id}`} variant="primary" size="sm" className="me-1">
                              Edit
                            </Button>
                            <Button variant="danger" size="sm">
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {devotees.length > 5 && (
                <div className="text-center mt-3">
                  <Button as={Link} to="/admin/devotees" variant="outline-primary">
                    View All Devotees
                  </Button>
                </div>
              )}
            </Tab>
            
            <Tab eventKey="events" title="Recent Events">
              {events.length === 0 ? (
                <Alert variant="info">No events found.</Alert>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Registered</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.slice(0, 5).map(event => (
                        <tr key={event._id}>
                          <td>{event.title}</td>
                          <td>{new Date(event.date).toLocaleDateString()}</td>
                          <td>{event.startTime} - {event.endTime}</td>
                          <td>{event.location}</td>
                          <td>
                            <Badge bg={
                              event.eventType === 'puja' ? 'primary' :
                              event.eventType === 'festival' ? 'success' :
                              event.eventType === 'discourse' ? 'info' :
                              event.eventType === 'community' ? 'warning' : 'secondary'
                            }>
                              {event.eventType}
                            </Badge>
                          </td>
                          <td>{event.registeredDevotees?.length || 0}</td>
                          <td>
                            <Button as={Link} to={`/admin/events/${event._id}`} variant="primary" size="sm" className="me-1">
                              Edit
                            </Button>
                            <Button variant="danger" size="sm">
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {events.length > 5 && (
                <div className="text-center mt-3">
                  <Button as={Link} to="/admin/events" variant="outline-primary">
                    View All Events
                  </Button>
                </div>
              )}
            </Tab>
            
            <Tab eventKey="donations" title="Recent Donations">
              {donations.length === 0 ? (
                <Alert variant="info">No donations found.</Alert>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Devotee</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.slice(0, 5).map((donation, index) => (
                        <tr key={index}>
                          <td>{donation.devoteeName}</td>
                          <td>{new Date(donation.date).toLocaleDateString()}</td>
                          <td>${donation.amount.toFixed(2)}</td>
                          <td>{donation.purpose || 'General Donation'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {donations.length > 5 && (
                <div className="text-center mt-3">
                  <Button as={Link} to="/admin/donations" variant="outline-primary">
                    View All Donations
                  </Button>
                </div>
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard; 