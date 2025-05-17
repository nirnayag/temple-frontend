import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const AboutTemple = () => {
  return (
    <Container className="my-5">
      <h1 className="section-heading mb-4">About Our Temple</h1>
      
      {/* Introduction Section */}
      <Row className="mb-5">
        <Col lg={7}>
          <p className="lead">
            Our temple serves as a spiritual center dedicated to preserving and promoting
            Hindu traditions, culture, and values in our community.
          </p>
          <p>
            Founded in 2010, our temple has grown from a small prayer hall to a vibrant community center
            that attracts devotees from across the region. The temple is built in traditional South Indian 
            architectural style and houses several deities.
          </p>
          <p>
            Our mission is to provide a place for worship, spiritual growth, and community gathering.
            We conduct regular pujas, celebrate all major Hindu festivals, and offer various religious
            and cultural services to our devotees.
          </p>
        </Col>
        <Col lg={5}>
          <img 
            src="https://placehold.co/800x600/800020/FFFFFF?text=Temple+Building" 
            alt="Temple Building" 
            className="img-fluid rounded shadow-sm"
          />
        </Col>
      </Row>

      {/* Temple Values Section */}
      <div className="mb-5">
        <h2 className="h3 mb-4">Our Core Values</h2>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="text-temple mb-3">
                  <i className="fas fa-om fa-3x"></i>
                </div>
                <h3 className="h4">Spirituality</h3>
                <p>
                  Promoting spiritual growth through traditional practices, meditation,
                  and religious teachings for inner peace and well-being.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="text-temple mb-3">
                  <i className="fas fa-hands-helping fa-3x"></i>
                </div>
                <h3 className="h4">Community Service</h3>
                <p>
                  Fostering a sense of community through service, support, and 
                  outreach programs that benefit devotees and the wider society.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="text-temple mb-3">
                  <i className="fas fa-book fa-3x"></i>
                </div>
                <h3 className="h4">Education</h3>
                <p>
                  Preserving and transmitting Hindu traditions, philosophy, and culture
                  through classes, workshops, and educational programs.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Temple Facilities Section */}
      <div className="mb-5">
        <h2 className="h3 mb-4">Temple Facilities</h2>
        <Row>
          <Col md={6}>
            <div className="mb-4">
              <h3 className="h5 text-temple">Main Sanctum</h3>
              <p>
                The main sanctum houses the primary deities and is built according to traditional
                temple architecture with detailed carvings and decorations. Daily pujas and
                special ceremonies are conducted here.
              </p>
            </div>
            <div className="mb-4">
              <h3 className="h5 text-temple">Multi-Purpose Hall</h3>
              <p>
                A spacious hall for religious gatherings, cultural events, and community celebrations.
                The hall can accommodate up to 300 people and is equipped with modern audio-visual systems.
              </p>
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-4">
              <h3 className="h5 text-temple">Cultural Center</h3>
              <p>
                Dedicated space for classes in music, dance, yoga, and language. Regular workshops
                and cultural programs are conducted to promote traditional arts.
              </p>
            </div>
            <div className="mb-4">
              <h3 className="h5 text-temple">Dining Area</h3>
              <p>
                Community dining hall where prasadam (blessed food) is served during special
                occasions and festivals. The kitchen prepares traditional vegetarian food.
              </p>
            </div>
          </Col>
        </Row>
      </div>

      {/* Temple History Timeline */}
      <div className="mb-5">
        <h2 className="h3 mb-4">Temple History</h2>
        <div className="position-relative">
          <div className="timeline-line"></div>
          <Row className="timeline-item mb-4">
            <Col md={2} className="text-center">
              <div className="timeline-circle">2010</div>
            </Col>
            <Col md={10}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h3 className="h5">Temple Foundation</h3>
                  <p>
                    The temple was established as a small prayer hall by a group
                    of devoted community members seeking a place for worship.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="timeline-item mb-4">
            <Col md={2} className="text-center">
              <div className="timeline-circle">2012</div>
            </Col>
            <Col md={10}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h3 className="h5">Main Temple Construction</h3>
                  <p>
                    Construction of the main temple structure began with traditional
                    groundbreaking ceremony and rituals.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="timeline-item mb-4">
            <Col md={2} className="text-center">
              <div className="timeline-circle">2015</div>
            </Col>
            <Col md={10}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h3 className="h5">Temple Inauguration</h3>
                  <p>
                    The temple was officially inaugurated with grand Kumbhabhishekam
                    ceremony attended by priests from India and local dignitaries.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="timeline-item">
            <Col md={2} className="text-center">
              <div className="timeline-circle">2020</div>
            </Col>
            <Col md={10}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h3 className="h5">Expansion & Growth</h3>
                  <p>
                    Expansion of temple facilities including cultural center,
                    dining hall, and classroom spaces to serve growing community needs.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Temple Administration */}
      <div className="mb-5">
        <h2 className="h3 mb-4">Temple Administration</h2>
        <p>
          The temple is managed by a dedicated board of trustees and volunteers
          who oversee the daily operations, financial management, and long-term planning.
        </p>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <h3 className="h5 text-temple">Board of Trustees</h3>
                <p>
                  Elected members who provide strategic direction and governance
                  for the temple activities and development.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <h3 className="h5 text-temple">Temple Management</h3>
                <p>
                  Day-to-day operations team including temple manager, administrative
                  staff, and maintenance personnel.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <h3 className="h5 text-temple">Volunteer Groups</h3>
                <p>
                  Dedicated volunteers who assist with festivals, events, classes,
                  and various temple services.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Visit Information */}
      <div className="p-4 bg-light rounded">
        <h2 className="h3 mb-4">Visit the Temple</h2>
        <Row>
          <Col md={6}>
            <h4>Temple Hours</h4>
            <ul className="list-unstyled">
              <li><strong>Weekdays:</strong> 9:00 AM - 12:00 PM, 5:00 PM - 8:00 PM</li>
              <li><strong>Weekends:</strong> 8:00 AM - 8:00 PM</li>
              <li><strong>Festival Days:</strong> Special Hours (Check Calendar)</li>
            </ul>
            <h4>Dress Code</h4>
            <p>
              Modest attire is requested. Traditional clothing is encouraged but not required.
            </p>
          </Col>
          <Col md={6}>
            <h4>Contact Information</h4>
            <p>
              <i className="fas fa-map-marker-alt me-2"></i>
              123 Temple Street, City, State 12345
            </p>
            <p>
              <i className="fas fa-phone me-2"></i>
              (123) 456-7890
            </p>
            <p>
              <i className="fas fa-envelope me-2"></i>
              info@temple.org
            </p>
            <p>
              For general inquiries, facility rentals, or to schedule a guided tour,
              please contact our temple office.
            </p>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default AboutTemple; 