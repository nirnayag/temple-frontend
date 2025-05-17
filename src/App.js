import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Navbar, Nav, NavDropdown, Accordion, Form, Table, Alert, Badge, Tab, Tabs } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import components
import DevoteesList from './components/devotees/DevoteesList';
import EventsList from './components/events/EventsList';
import DonationsList from './components/donations/DonationsList';
import PriestsList from './components/temple/PriestsList';
import PujaServices from './components/temple/PujaServices';
import AboutTemple from './components/temple/AboutTemple';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserDashboard from './components/dashboard/UserDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { ProtectedRoute, AdminRoute, PublicRoute } from './components/auth/ProtectedRoute';

// Auth service
import authService from './services/auth';

// Home component
const Home = () => {
  const announcements = [
    {
      id: 1,
      title: "Sri Siva Gnana Deepika Mahotsavam",
      dateRange: "April 17, 2025 - August 3, 2025",
      description: "Join us for the annual Sri Siva Gnana Deepika Mahotsavam with special pujas and cultural programs"
    },
    {
      id: 2,
      title: "2025 Annual Calendar",
      dateRange: "November 29, 2024 - February 26, 2025",
      description: "Annual calendar of temple events and festivals is now available"
    }
  ];
  
  const upcomingEvents = [
    {
      id: 1,
      title: "Papanasam Sivan Festival – Main Concert",
      date: "May 17, 2025",
      time: "09:00 - 12:00",
      location: "Main Temple"
    },
    {
      id: 2,
      title: "Weekly Bhajan",
      date: "May 24, 2025",
      time: "19:00 - 20:30",
      location: "Bhajan Hall"
    },
    {
      id: 3,
      title: "Spiritual Discourse",
      date: "June 5, 2025",
      time: "17:00 - 19:00",
      location: "Lecture Hall"
    }
  ];

  const tempFeatures = [
    {
      id: 1,
      title: "Religious",
      description: "Daily PujasTemple Opening & Suprabhaatam, Evening Aarathi, Abhishekam",
      icon: "fas fa-om",
      link: "/services/puja"
    },
    {
      id: 2,
      title: "Cultural",
      description: "The Temple hosts a number of cultural events by local talent and well-known artists from India.",
      icon: "fas fa-music",
      link: "/events"
    },
    {
      id: 3,
      title: "Donation",
      description: "Click here to donate or to sponsor for pujas.",
      icon: "fas fa-donate",
      link: "/donations"
    },
    {
      id: 4,
      title: "Upcoming Events",
      description: "Click here to view details about Upcoming Events.",
      icon: "fas fa-calendar-alt",
      link: "/events"
    }
  ];

  return (
    <>
      {/* Hero Banner */}
      <div className="home-banner">
        <img
          className="d-block w-100 h-100"
          src="https://placehold.co/1200x500/800020/FFFFFF?text=Sri+Siva+Gnana+Deepika+Mahotsavam"
          alt="Temple Banner"
          style={{ objectFit: 'cover' }}
        />
        <div className="banner-content">
          <h1 className="display-4 mb-4">Welcome to Temple Management System</h1>
          <p className="lead mb-4">Experience peace, spirituality and cultural richness</p>
          <div className="d-flex gap-3">
            <Button variant="light" className="btn-lg">Recurring Donations</Button>
            <Button variant="outline-light" className="btn-lg">Puja Sponsorships</Button>
          </div>
        </div>
      </div>

      {/* Feature Icons Section */}
      <section className="py-5">
        <Container>
          <Row>
            {tempFeatures.map(feature => (
              <Col md={3} key={feature.id}>
                <Link to={feature.link} className="text-decoration-none">
                  <div className="feature-box">
                    <div className="feature-icon">
                      <i className={feature.icon}></i>
                    </div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Announcements Section */}
      <section className="announcement-section">
        <Container>
          <h2 className="section-heading">Announcements</h2>
          <Row>
            {announcements.map(announcement => (
              <Col md={6} key={announcement.id}>
                <div className="announcement-card">
                  <div className="d-flex align-items-center mb-2">
                    <span className="badge rounded-pill bg-temple px-3 py-2 me-2">{announcement.id}Nov</span>
                    <h3 className="announcement-title m-0">{announcement.title}</h3>
                  </div>
                  <p className="announcement-date">{announcement.dateRange}</p>
                  <p>{announcement.description}</p>
                  <Button variant="outline-primary" size="sm">Info</Button>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Upcoming Events */}
      <section className="home-section-alt">
        <Container>
          <h2 className="section-heading">Upcoming Events</h2>
          <Row>
            {upcomingEvents.map(event => (
              <Col md={4} key={event.id} className="mb-4">
                <Card className="event-card h-100">
                  <Card.Header>
                    <div className="d-flex align-items-center">
                      <span className="badge rounded-pill bg-temple-secondary px-3 py-2 me-2">{event.date.substring(0, 2)}</span>
                      <h5 className="mb-0">{event.title}</h5>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <p className="event-date">{event.date}</p>
                    <p><strong>Time:</strong> {event.time}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                    <Button variant="outline-primary" as={Link} to="/events">Info</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Button variant="temple" as={Link} to="/events">More Events</Button>
          </div>
        </Container>
      </section>

      {/* Temple Information */}
      <section className="home-section">
        <Container>
          <h2 className="section-heading">Sri Siva Vishnu Temple</h2>
          <Row className="mb-5">
            <Col md={6} className="mb-4">
              <h3 className="h5 mb-3">Our Way Of Life</h3>
              <p>
                Hinduism is the way of life that deeply influences our thinking, behavior and attitude toward oneself and others. 
                Our Dharma or Godly duties becomes interwoven in our lifestyle. Seeking higher knowledge or enlightenment, 
                living peacefully, expressing gratitude, devotion and exercising moral principles are core practices.
              </p>
            </Col>
            <Col md={6} className="mb-4">
              <h3 className="h5 mb-3">Yoga & Meditation</h3>
              <p>
                Harikatha, literally "Story of Lord", is a form of Hindu traditional discourse in which the storyteller 
                explores a traditional theme, usually the life of a saint or a story from an Indian epic.
              </p>
            </Col>
            <Col md={6} className="mb-4">
              <h3 className="h5 mb-3">Education</h3>
              <p>
                We started a focused experiment with the Seminar Series called "Learning the Tradition of Hinduism" 
                starting from September 14, 2002. This has evolved in 2003 into separate adult and children's program.
              </p>
            </Col>
            <Col md={6} className="mb-4">
              <h3 className="h5 mb-3">Community Programs</h3>
              <p>
                Carnatic & Hindustani music evolved with Sanskrit language scripts in itself and through Vedic traditions. 
                Vocal music is performed by one or more singers. Instrumental music is compositions without lyrics.
              </p>
            </Col>
          </Row>
          <div className="text-center">
            <Button variant="temple" as={Link} to="/about">View All</Button>
          </div>
        </Container>
      </section>

      {/* Prasadam Info */}
      <section className="home-section-alt">
        <Container>
          <h2 className="section-heading">Prasadam</h2>
          <p className="text-center mb-4">
            The temple makes prasadam available to devotees on weekends and special holidays for a nominal donation. 
            The prasadam counter is open 9:00 AM to 1:00 PM & 5:00 PM to 9:00 PM on Monday, Tuesday, Thursday & Friday; 
            9:00 AM to 9:00 PM on Weekends, and special days. <strong>Prasadam counter is closed on Wednesdays.</strong>
          </p>
          <Row>
            <Col md={6} className="mb-3">
              <Card className="h-100">
                <Card.Header className="bg-temple text-white">
                  <h4 className="mb-0">Saturday</h4>
                </Card.Header>
                <Card.Body>
                  <p>Special prasadam offerings on Saturday:</p>
                  <ul>
                    <li>Vada</li>
                    <li>Sweet Pongal</li>
                    <li>Puliyogare</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-3">
              <Card className="h-100">
                <Card.Header className="bg-temple text-white">
                  <h4 className="mb-0">Sunday</h4>
                </Card.Header>
                <Card.Body>
                  <p>Special prasadam offerings on Sunday:</p>
                  <ul>
                    <li>Vada</li>
                    <li>Sweet Pongal</li>
                    <li>Puliyogare</li>
                    <li>Curd Rice</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

function App() {
  const isLoggedIn = authService.isLoggedIn();
  const isAdmin = authService.isAdmin();
  const currentUser = authService.getCurrentUser();
  
  const handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="App">
        {/* Top Contact Bar */}
        <div className="top-contact-bar">
          <Container>
            <Row>
              <Col md={6} className="text-md-start text-center mb-2 mb-md-0">
                <span className="me-4"><i className="fas fa-phone me-2"></i>(123) 456-7890</span>
                <span><i className="fas fa-envelope me-2"></i>info@temple.org</span>
              </Col>
              <Col md={6} className="text-md-end text-center">
                <a href="/donations" className="me-3">Recurring Donations</a>
                <a href="/services/puja">Puja Sponsorships</a>
              </Col>
            </Row>
          </Container>
        </div>

        {/* Main Navbar */}
        <Navbar className="ssvt-navbar" expand="lg" sticky="top">
          <Container>
            <Navbar.Brand as={Link} to="/">
              Sri Siva Temple
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                
                <NavDropdown title="Deities" id="deities-dropdown">
                  <NavDropdown.Item as={Link} to="/deities/vishnu">Lord Vishnu</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/deities/shiva">Lord Shiva</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/deities/ganesha">Lord Ganesha</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/deities/murugan">Lord Murugan</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/deities/all">All Deities</NavDropdown.Item>
                </NavDropdown>
                
                <NavDropdown title="Religious" id="religious-dropdown">
                  <NavDropdown.Item as={Link} to="/services/schedule">Puja Schedule</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/services/puja">Puja Services</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/prayer-books">Prayer Books</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/festivals">Festivals</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/priests">Priests</NavDropdown.Item>
                </NavDropdown>
                
                <NavDropdown title="Cultural" id="cultural-dropdown">
                  <NavDropdown.Item as={Link} to="/media">Media</NavDropdown.Item>
                </NavDropdown>
                
                <NavDropdown title="Education" id="education-dropdown">
                  <NavDropdown.Item as={Link} to="/classes">Classes</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/events">Events</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/resources">Resources</NavDropdown.Item>
                </NavDropdown>
                
                <NavDropdown title="Calendar" id="calendar-dropdown">
                  <NavDropdown.Item as={Link} to="/events">Current Events</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/newsletter">Newsletter</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/annual-calendar">Annual Calendar</NavDropdown.Item>
                </NavDropdown>
                
                <NavDropdown title="Forms" id="forms-dropdown">
                  <NavDropdown.Item as={Link} to="/services/puja">Puja Sponsorships</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/facility-request">Request Facility</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/donations/statement">Donation Statement</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/address-change">Change of Address</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/email-subscription">Email Subscription</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/forms">All Other Forms</NavDropdown.Item>
                </NavDropdown>
                
                <Nav.Link as={Link} to="/donations">Recurring-Donation</Nav.Link>
                <Nav.Link as={Link} to="/services/puja">Online-Puja</Nav.Link>
                
                <NavDropdown title="About" id="about-dropdown">
                  <NavDropdown.Item as={Link} to="/contact">Contact</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/location">Location</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/volunteer">Volunteer</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/virtual-visit">Virtual Visit</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/feedback">Feedback</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/faq">FAQ</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/about">About</NavDropdown.Item>
                </NavDropdown>
                
                {isLoggedIn ? (
                  <NavDropdown title={currentUser?.username || 'Account'} id="account-dropdown">
                    <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                    {isAdmin && (
                      <NavDropdown.Item as={Link} to="/admin/dashboard">Admin Panel</NavDropdown.Item>
                    )}
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <main>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            
            {/* Routes accessible to everyone */}
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<EventsList />} />
            <Route path="/about" element={<AboutTemple />} />
            <Route path="/priests" element={<PriestsList />} />
            <Route path="/services/puja" element={<PujaServices />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/devotees" element={<DevoteesList />} />
              <Route path="/donations" element={<DonationsList />} />
            </Route>
            
            {/* Admin-only Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
            
            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="footer">
          <Container>
            <Row className="mb-4">
              <Col lg={3} md={6} className="mb-4">
                <h5>Temple Links</h5>
                <ul className="list-unstyled">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/deities">Deities</Link></li>
                  <li><Link to="/religious">Religious</Link></li>
                  <li><Link to="/cultural">Cultural</Link></li>
                  <li><Link to="/education">Education</Link></li>
                </ul>
              </Col>
              <Col lg={3} md={6} className="mb-4">
                <h5>Services</h5>
                <ul className="list-unstyled">
                  <li><Link to="/calendar">Calendar</Link></li>
                  <li><Link to="/forms">Forms</Link></li>
                  <li><Link to="/about">About</Link></li>
                </ul>
              </Col>
              <Col lg={3} md={6} className="mb-4">
                <h5>Online Services</h5>
                <ul className="list-unstyled">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/deities">Deities</Link></li>
                  <li><Link to="/religious">Religious</Link></li>
                  <li><Link to="/cultural">Cultural</Link></li>
                  <li><Link to="/education">Education</Link></li>
                </ul>
              </Col>
              <Col lg={3} md={6} className="mb-4">
                <h5>Contact</h5>
                <address>
                  <p><i className="fas fa-map-marker-alt me-2"></i>123 Temple Street, City, State 12345</p>
                  <p><i className="fas fa-phone me-2"></i>(123) 456-7890</p>
                  <p><i className="fas fa-envelope me-2"></i>info@temple.org</p>
                </address>
              </Col>
            </Row>
          </Container>
          <div className="footer-copyright">
            <Container>
              <p className="text-center mb-0">&copy; {new Date().getFullYear()} Sri Siva Temple. All Rights Reserved.</p>
            </Container>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
