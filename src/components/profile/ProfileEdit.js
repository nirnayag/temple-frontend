import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth';
import { devoteeService } from '../../services/api';
import { Box, CircularProgress, Typography, CardContent } from '@mui/material';

const ProfileEdit = () => {
  const [user, setUser] = useState(null);
  const [devotee, setDevotee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'USA',
    preferredDeity: '',
    preferredLanguage: ''
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profileData = await authService.getProfile();
        
        if (profileData) {
          setUser(profileData.user);
          setDevotee(profileData.devotee);
          
          if (profileData.devotee) {
            // Populate form with existing data
            setFormData({
              name: profileData.devotee.name || '',
              email: profileData.user.email || '',
              phone: profileData.devotee.phone || '',
              address: profileData.devotee.address || '',
              city: profileData.devotee.city || '',
              state: profileData.devotee.state || '',
              country: profileData.devotee.country || 'USA',
              preferredDeity: profileData.devotee.preferredDeity || '',
              preferredLanguage: profileData.devotee.preferredLanguage || ''
            });
          }
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.name || !formData.email) {
      setError('Name and email are required fields');
      return;
    }
    
    setSaving(true);
    
    try {
      if (devotee) {
        // Update devotee information
        await devoteeService.update(devotee._id, {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          preferredDeity: formData.preferredDeity,
          preferredLanguage: formData.preferredLanguage
        });
        
        setSuccess('Profile updated successfully');
        
        // Wait a moment then redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError('No profile data found to update');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <Container sx={{ py: 4, minHeight: "100vh", bgcolor: "#E2DFD2" }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <CircularProgress sx={{ color: "#d35400" }} />
          <span className="visually-hidden">Loading...</span>
        </Box>
        <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
          Loading your profile...
        </Typography>
        <Card sx={{ maxWidth: 600, mx: "auto" }}>
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ height: 24, backgroundColor: "#f0f0f0", mb: 2, borderRadius: 1, animation: "pulse 1.5s ease-in-out infinite" }} />
              <Box sx={{ height: 56, backgroundColor: "#f0f0f0", mb: 2, borderRadius: 1, animation: "pulse 1.5s ease-in-out infinite" }} />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ height: 24, backgroundColor: "#f0f0f0", mb: 2, borderRadius: 1, animation: "pulse 1.5s ease-in-out infinite" }} />
              <Box sx={{ height: 56, backgroundColor: "#f0f0f0", mb: 2, borderRadius: 1, animation: "pulse 1.5s ease-in-out infinite" }} />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ height: 24, backgroundColor: "#f0f0f0", mb: 2, borderRadius: 1, animation: "pulse 1.5s ease-in-out infinite" }} />
              <Box sx={{ height: 56, backgroundColor: "#f0f0f0", mb: 2, borderRadius: 1, animation: "pulse 1.5s ease-in-out infinite" }} />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ height: 24, backgroundColor: "#f0f0f0", mb: 2, borderRadius: 1, animation: "pulse 1.5s ease-in-out infinite" }} />
              <Box sx={{ height: 56, backgroundColor: "#f0f0f0", mb: 2, borderRadius: 1, animation: "pulse 1.5s ease-in-out infinite" }} />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1, height: 48, backgroundColor: "#f0f0f0", borderRadius: 1, animation: "pulse 1.5s ease-in-out infinite" }} />
              <Box sx={{ flex: 1, height: 48, backgroundColor: "#f0f0f0", borderRadius: 1, animation: "pulse 1.5s ease-in-out infinite" }} />
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-temple text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Edit Profile</h3>
              <Button as={Link} to="/dashboard" variant="light" size="sm">
                Back to Dashboard
              </Button>
            </Card.Header>
            
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row className="mb-4">
                  <Col xs={12}>
                    <h5>Personal Information</h5>
                    <hr/>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
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
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        disabled
                        required
                      />
                      <Form.Text className="text-muted">
                        Email cannot be changed. Contact administrator for assistance.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-4">
                  <Col xs={12}>
                    <h5>Contact Information</h5>
                    <hr/>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="phone">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
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
                        value={formData.address}
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
                        value={formData.city}
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
                        value={formData.state}
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
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Enter your country"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-4">
                  <Col xs={12}>
                    <h5>Preferences</h5>
                    <hr/>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="preferredDeity">
                      <Form.Label>Preferred Deity</Form.Label>
                      <Form.Control
                        type="text"
                        name="preferredDeity"
                        value={formData.preferredDeity}
                        onChange={handleChange}
                        placeholder="Enter your preferred deity"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="preferredLanguage">
                      <Form.Label>Preferred Language</Form.Label>
                      <Form.Control
                        type="text"
                        name="preferredLanguage"
                        value={formData.preferredLanguage}
                        onChange={handleChange}
                        placeholder="Enter your preferred language"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mt-4">
                  <Col xs={12} className="d-flex justify-content-between">
                    <Button as={Link} to="/dashboard" variant="secondary">
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={saving}
                    >
                      {saving ? 'Saving Changes...' : 'Save Changes'}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileEdit; 