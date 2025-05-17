import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth';

const Register = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'USA'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    // Basic validation
    if (!userData.username || !userData.email || !userData.password || !userData.name) {
      setError('Please fill all required fields');
      return false;
    }
    
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (userData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = userData;
      
      await authService.register(registrationData);
      setSuccess('Registration successful! Redirecting to dashboard...');
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="mt-4 mb-4 shadow-sm">
            <Card.Header className="bg-temple text-white">
              <h3 className="mb-0">Create an Account</h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12}>
                    <h5 className="mb-3">Account Information</h5>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="username">
                      <Form.Label>Username <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        placeholder="Choose a username"
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        placeholder="Choose a password"
                        required
                      />
                      <Form.Text className="text-muted">
                        Password must be at least 6 characters long
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Label>Confirm Password <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={userData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mt-3">
                  <Col md={12}>
                    <h5 className="mb-3">Personal Information</h5>
                  </Col>
                  
                  <Col md={12}>
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="phone">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={userData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="address">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={userData.address}
                        onChange={handleChange}
                        placeholder="Enter your address"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="city">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={userData.city}
                        onChange={handleChange}
                        placeholder="Enter your city"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="state">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={userData.state}
                        onChange={handleChange}
                        placeholder="Enter your state"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="country">
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        type="text"
                        name="country"
                        value={userData.country}
                        onChange={handleChange}
                        placeholder="Enter your country"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mt-4">
                  <Col md={12}>
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={loading} 
                      className="w-100 py-2"
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
            <Card.Footer className="text-center">
              <p className="mb-0">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register; 