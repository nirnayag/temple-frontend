import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Container, Row, Col, Navbar, Nav, NavDropdown } from 'react-bootstrap';
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
import Home from './components/Home';

// Auth service
import authService from './services/auth';

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
