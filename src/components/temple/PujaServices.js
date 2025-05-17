import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Accordion } from 'react-bootstrap';

const PujaServices = () => {
  const [selectedPuja, setSelectedPuja] = useState(null);

  // Sample puja services based on temple offerings
  const pujaServices = [
    {
      id: 1,
      category: "Regular Pujas",
      pujas: [
        {
          id: 101,
          name: "Archana",
          description: "Simple offering of flowers with chanting of names",
          duration: "15 minutes",
          cost: "$21"
        },
        {
          id: 102,
          name: "Abhishekam",
          description: "Sacred bathing ritual for deity with milk, honey, etc.",
          duration: "45 minutes",
          cost: "$51"
        },
        {
          id: 103,
          name: "Sahasranamam",
          description: "Chanting of 1008 names of the deity",
          duration: "60 minutes",
          cost: "$31"
        }
      ]
    },
    {
      id: 2,
      category: "Special Pujas",
      pujas: [
        {
          id: 201,
          name: "Ganapati Homam",
          description: "Fire ritual for Lord Ganesha to remove obstacles",
          duration: "90 minutes",
          cost: "$101"
        },
        {
          id: 202,
          name: "Satyanarayana Puja",
          description: "Special worship of Lord Vishnu as Satyanarayana",
          duration: "2 hours",
          cost: "$151"
        },
        {
          id: 203,
          name: "Rudra Homam",
          description: "Fire ritual for Lord Shiva",
          duration: "2 hours",
          cost: "$151"
        }
      ]
    },
    {
      id: 3,
      category: "Life Events",
      pujas: [
        {
          id: 301,
          name: "Namakaranam (Naming Ceremony)",
          description: "Traditional naming ceremony for newborn",
          duration: "60 minutes",
          cost: "$101"
        },
        {
          id: 302,
          name: "Grihapravesham (House Warming)",
          description: "Ritual for new home blessing",
          duration: "3 hours",
          cost: "$301"
        },
        {
          id: 303,
          name: "Shashtiabdapoorthi (60th Birthday)",
          description: "Special ritual for 60th birthday celebration",
          duration: "3 hours",
          cost: "$251"
        }
      ]
    },
    {
      id: 4,
      category: "Festival Pujas",
      pujas: [
        {
          id: 401,
          name: "Diwali Special Puja",
          description: "Special worship for Diwali festival",
          duration: "90 minutes",
          cost: "$101"
        },
        {
          id: 402,
          name: "Navaratri Special Puja",
          description: "Nine nights festival special worship",
          duration: "90 minutes",
          cost: "$101"
        },
        {
          id: 403,
          name: "Ganesh Chaturthi Puja",
          description: "Special worship for Ganesh Chaturthi",
          duration: "90 minutes",
          cost: "$101"
        }
      ]
    }
  ];

  const handlePujaSelect = (puja) => {
    setSelectedPuja(puja);
    window.scrollTo({
      top: document.getElementById('booking-form').offsetTop,
      behavior: 'smooth'
    });
  };

  return (
    <Container className="my-5">
      <h1 className="section-heading mb-4">Puja Services</h1>
      <p className="text-center mb-5">
        Our temple offers a variety of traditional puja services performed by our experienced priests.
        You can book these services for performance at the temple or at your residence.
      </p>

      {/* Puja Categories */}
      <Row className="mb-5">
        {pujaServices.map(category => (
          <Col md={6} lg={3} className="mb-4" key={category.id}>
            <Card className="h-100 text-center">
              <Card.Header className="bg-temple text-white">
                <h3 className="h5 mb-0">{category.category}</h3>
              </Card.Header>
              <Card.Body className="d-flex flex-column">
                <Card.Text>
                  {category.pujas.length} different types of pujas
                </Card.Text>
                <div className="mt-auto">
                  <Button 
                    variant="outline-temple" 
                    href={`#category-${category.id}`}
                    onClick={() => document.getElementById(`category-${category.id}`).scrollIntoView({ behavior: 'smooth' })}
                  >
                    View Details
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Puja Listings by Category */}
      <div className="mb-5">
        <h2 className="h3 mb-4">Available Puja Services</h2>
        <p className="mb-4">
          Click on "Book Now" for any puja to fill out the booking form below. For special requests or questions,
          please contact our temple office directly.
        </p>

        <Accordion defaultActiveKey="1">
          {pujaServices.map(category => (
            <Accordion.Item eventKey={category.id.toString()} key={category.id}>
              <Accordion.Header id={`category-${category.id}`}>
                {category.category}
              </Accordion.Header>
              <Accordion.Body>
                <Table responsive bordered hover>
                  <thead>
                    <tr>
                      <th>Puja Name</th>
                      <th>Description</th>
                      <th>Duration</th>
                      <th>Suggested Donation</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.pujas.map(puja => (
                      <tr key={puja.id}>
                        <td>{puja.name}</td>
                        <td>{puja.description}</td>
                        <td>{puja.duration}</td>
                        <td>{puja.cost}</td>
                        <td>
                          <Button 
                            variant="temple" 
                            size="sm"
                            onClick={() => handlePujaSelect(puja)}
                          >
                            Book Now
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>

      {/* Booking Form */}
      <div className="p-4 bg-light rounded" id="booking-form">
        <h2 className="h3 mb-4">Puja Booking Form</h2>
        
        {selectedPuja ? (
          <p className="mb-4">
            You are booking: <strong>{selectedPuja.name}</strong> - {selectedPuja.description}
          </p>
        ) : (
          <p className="mb-4">
            Please select a puja service from above to proceed with booking.
          </p>
        )}

        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" placeholder="Enter your full name" required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" required />
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="tel" placeholder="Enter your phone number" required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Preferred Date</Form.Label>
                <Form.Control type="date" required />
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Preferred Time</Form.Label>
                <Form.Control type="time" required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Select required>
                  <option value="">Select location</option>
                  <option value="temple">At Temple</option>
                  <option value="residence">At My Residence</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Special Instructions (optional)</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Any additional information or requests" />
          </Form.Group>
          
          <Button variant="temple" type="submit" size="lg" disabled={!selectedPuja}>
            Submit Booking Request
          </Button>
        </Form>
      </div>

      {/* Additional Information */}
      <div className="mt-5">
        <h2 className="h3 mb-4">Additional Information</h2>
        
        <Row>
          <Col md={6}>
            <div className="mb-4">
              <h4>Booking Guidelines</h4>
              <ul>
                <li>Please book at least 7 days in advance</li>
                <li>Confirmation email will be sent within 24 hours</li>
                <li>For urgent bookings, please call the temple office</li>
                <li>Cancellations should be made at least 48 hours before</li>
              </ul>
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-4">
              <h4>What to Bring</h4>
              <ul>
                <li>Fruits and flowers for offering</li>
                <li>Traditional clothing is recommended</li>
                <li>For home pujas, please arrange a clean space</li>
                <li>Additional items specific to puja will be communicated</li>
              </ul>
            </div>
          </Col>
        </Row>
        
        <div className="bg-temple-light p-3 rounded text-center">
          <h4>Contact for Queries</h4>
          <p className="mb-1">For any questions or special requests, please contact our temple office:</p>
          <p className="mb-0">
            <strong>Email:</strong> puja-services@temple.org | <strong>Phone:</strong> (123) 456-7890
          </p>
        </div>
      </div>
    </Container>
  );
};

export default PujaServices; 