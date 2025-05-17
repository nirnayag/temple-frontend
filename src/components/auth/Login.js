import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authService.login(credentials);
      
      setSuccess('Login successful! Redirecting...');
      
      // Redirect based on user role after a short delay
      setTimeout(() => {
        if (response.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="mt-5 mb-4 shadow-sm">
            <Card.Header className="bg-temple text-white">
              <h3 className="mb-0">Login to Your Account</h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </Form.Group>
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check
                    type="checkbox"
                    id="rememberMe"
                    label="Remember me"
                  />
                  <Link to="/forgot-password" className="text-primary text-decoration-none">
                    Forgot Password?
                  </Link>
                </div>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading} 
                  className="w-100 py-2"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="text-center">
              <p className="mb-0">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
              <p className="small text-muted mt-2">
                Demo credentials: <br/>
                Admin: username="admin", password="admin123" <br/>
                User: username="user", password="user123"
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login; 