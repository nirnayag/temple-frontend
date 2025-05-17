import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { eventService, devoteeService } from '../../services/api';
import authService from '../../services/auth';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [devotee, setDevotee] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Get user profile
        const profileData = await authService.getProfile();
        setUser(profileData.user);
        setDevotee(profileData.devotee);
        
        // Get upcoming events
        const eventsResponse = await eventService.getUpcoming();
        setEvents(eventsResponse.data);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Dashboard</Alert.Heading>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline-danger">Try Again</Button>
        </Alert>
      </Container>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-0">Welcome, {devotee?.name || user?.username || 'Devotee'}</h2>
          <p className="text-muted">Dashboard | {user?.role === 'admin' ? 'Administrator' : 'Temple Member'}</p>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/profile/edit" variant="outline-primary">
            Edit Profile
          </Button>
        </Col>
      </Row>
      
      <Row>
        <Col lg={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-temple text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Upcoming Events</h3>
              <Button as={Link} to="/events" variant="light" size="sm">View All</Button>
            </Card.Header>
            <Card.Body>
              {events.length === 0 ? (
                <Alert variant="info">No upcoming events found.</Alert>
              ) : (
                <div className="list-group">
                  {events.slice(0, 5).map(event => (
                    <div key={event._id} className="list-group-item list-group-item-action">
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">{event.title}</h5>
                        <Badge bg={
                          new Date(event.date) < new Date(new Date().setDate(new Date().getDate() + 3)) 
                          ? 'danger' 
                          : 'primary'
                        }>
                          {formatDate(event.date)}
                        </Badge>
                      </div>
                      <p className="mb-1">{event.description}</p>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <small>
                          <strong>Time:</strong> {event.startTime} - {event.endTime} | 
                          <strong> Location:</strong> {event.location}
                        </small>
                        <Button as={Link} to={`/events/${event._id}`} size="sm" variant="outline-primary">
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-temple text-white">
              <h3 className="mb-0">Your Profile</h3>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col xs={12}>
                  <h5>Account Information</h5>
                  <hr/>
                </Col>
                <Col xs={4} className="text-muted">Username:</Col>
                <Col xs={8}>{user?.username}</Col>
              </Row>
              <Row className="mb-3">
                <Col xs={4} className="text-muted">Email:</Col>
                <Col xs={8}>{user?.email}</Col>
              </Row>
              <Row className="mb-3">
                <Col xs={4} className="text-muted">Role:</Col>
                <Col xs={8}>
                  <Badge bg={user?.role === 'admin' ? 'danger' : 'success'}>
                    {user?.role === 'admin' ? 'Administrator' : 'Member'}
                  </Badge>
                </Col>
              </Row>
              
              {devotee && (
                <>
                  <Row className="mt-4 mb-3">
                    <Col xs={12}>
                      <h5>Personal Information</h5>
                      <hr/>
                    </Col>
                    <Col xs={4} className="text-muted">Name:</Col>
                    <Col xs={8}>{devotee.name}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={4} className="text-muted">Phone:</Col>
                    <Col xs={8}>{devotee.phone || 'Not provided'}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={4} className="text-muted">Address:</Col>
                    <Col xs={8}>
                      {devotee.address ? (
                        <>
                          {devotee.address}
                          {devotee.city && <><br/>{devotee.city}</>}
                          {devotee.state && <>, {devotee.state}</>}
                          {devotee.country && <> {devotee.country}</>}
                        </>
                      ) : (
                        'Not provided'
                      )}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={4} className="text-muted">Member Since:</Col>
                    <Col xs={8}>{formatDate(devotee.memberSince)}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={4} className="text-muted">Membership:</Col>
                    <Col xs={8}>
                      <Badge bg="primary">
                        {devotee.membershipType?.charAt(0).toUpperCase() + devotee.membershipType?.slice(1) || 'Regular'}
                      </Badge>
                    </Col>
                  </Row>
                </>
              )}
              
              <div className="d-grid gap-2 mt-3">
                <Button as={Link} to="/profile/edit" variant="primary">
                  Edit Profile
                </Button>
                {user?.role === 'admin' && (
                  <Button as={Link} to="/admin/dashboard" variant="outline-danger">
                    Admin Dashboard
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;