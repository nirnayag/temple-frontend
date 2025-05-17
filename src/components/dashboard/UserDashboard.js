import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Alert } from 'react-bootstrap';
import { eventService } from '../../services/api';
import authService from '../../services/auth';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Get user profile
        const userData = await authService.getProfile();
        setUser(userData);
        
        // Get upcoming events
        const eventsResponse = await eventService.getAll();
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
    return <div className="text-center py-5">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-3">
        {error}
      </Alert>
    );
  }

  return (
    <Container>
      <h2 className="mb-4">Welcome, {user?.username || 'Devotee'}</h2>
      
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header className="bg-temple">
              <h3 className="mb-0">Upcoming Events</h3>
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
                        <small>{new Date(event.date).toLocaleDateString()}</small>
                      </div>
                      <p className="mb-1">{event.description}</p>
                      <small>
                        <strong>Time:</strong> {event.startTime} - {event.endTime} | 
                        <strong> Location:</strong> {event.location}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header className="bg-temple">
              <h3 className="mb-0">Your Information</h3>
            </Card.Header>
            <Card.Body>
              <p><strong>Username:</strong> {user?.username}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {user?.role}</p>
              <hr />
              <p className="text-muted">
                To update your profile information or make donations, please visit the appropriate sections from the main menu.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard; 