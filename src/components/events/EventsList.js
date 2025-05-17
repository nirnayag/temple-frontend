import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Form, Row, Col } from 'react-bootstrap';
import { eventService } from '../../services/api';
import authService from '../../services/auth';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const isLoggedIn = authService.isLoggedIn();
  const isAdmin = authService.isAdmin();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAll();
      setEvents(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const getFilteredEvents = () => {
    if (filter === 'all') return events;
    
    const now = new Date();
    
    if (filter === 'upcoming') {
      return events.filter(event => new Date(event.date) >= now);
    } else if (filter === 'past') {
      return events.filter(event => new Date(event.date) < now);
    }
    
    return events.filter(event => event.eventType === filter);
  };

  // Sort events by date (upcoming first)
  const sortedEvents = getFilteredEvents().sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  if (loading) {
    return <div className="text-center py-5">Loading events...</div>;
  }

  return (
    <Card>
      <Card.Header className="bg-temple">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Temple Events</h3>
          {isLoggedIn && isAdmin && (
            <Button variant="light">Add New Event</Button>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger">
            {error}
            <Button 
              variant="outline-danger" 
              size="sm" 
              className="ms-3"
              onClick={fetchEvents}
            >
              Try Again
            </Button>
          </Alert>
        )}
        
        <Form.Group className="mb-4">
          <Form.Label>Filter Events</Form.Label>
          <Form.Select 
            value={filter} 
            onChange={handleFilterChange}
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming Events</option>
            <option value="past">Past Events</option>
            <option value="puja">Pujas</option>
            <option value="festival">Festivals</option>
            <option value="discourse">Discourses</option>
            <option value="community">Community Events</option>
          </Form.Select>
        </Form.Group>
        
        {sortedEvents.length === 0 ? (
          <Alert variant="info">
            No events found matching your criteria.
          </Alert>
        ) : (
          <Row>
            {sortedEvents.map(event => {
              const isPast = new Date(event.date) < new Date();
              
              return (
                <Col md={6} lg={4} key={event._id} className="mb-4">
                  <Card className={`event-card ${isPast ? 'border-secondary' : 'border-primary'}`}>
                    <Card.Header className={isPast ? 'bg-secondary text-white' : 'bg-primary text-white'}>
                      <h5 className="mb-0">{event.title}</h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="event-date mb-2">
                        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="event-time mb-2">
                        <strong>Time:</strong> {event.startTime} - {event.endTime}
                      </div>
                      <div className="event-location mb-2">
                        <strong>Location:</strong> {event.location}
                      </div>
                      <div className="event-type mb-2">
                        <strong>Type:</strong> {event.eventType}
                      </div>
                      {event.priest && (
                        <div className="event-priest mb-2">
                          <strong>Priest:</strong> {event.priest}
                        </div>
                      )}
                      <p className="mt-3">{event.description}</p>
                      
                      {!isPast && isLoggedIn && (
                        <Button variant="primary" size="sm" className="mt-2">
                          Register for Event
                        </Button>
                      )}
                      
                      {isPast && (
                        <div className="text-muted mt-2">
                          <small>This event has already taken place</small>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default EventsList; 