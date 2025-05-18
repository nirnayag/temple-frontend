import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth';

// Custom CSS for OTP input
const customStyles = `
  /* Hide number input arrows */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  /* For Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
  
  /* Focus styles */
  #otp-input:focus {
    background-color: #f8f9fa;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

// Enum for authentication steps
const AuthStep = {
  ENTER_MOBILE: 'ENTER_MOBILE',
  VERIFY_OTP: 'VERIFY_OTP',
  REGISTRATION: 'REGISTRATION'
};

const MobileOTPAuth = () => {
  const [currentStep, setCurrentStep] = useState(AuthStep.ENTER_MOBILE);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    username: '',
    address: '',
    city: '',
    state: '',
    country: 'India'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const navigate = useNavigate();
  const otpInputRef = useRef(null);
  
  // Focus OTP input when verification step is active
  useEffect(() => {
    if (currentStep === AuthStep.VERIFY_OTP && otpInputRef.current) {
      setTimeout(() => {
        otpInputRef.current.focus();
      }, 300);
    }
  }, [currentStep]);
  
  // Handle mobile number change
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/[^0-9+]/g, ''); // Only allow numbers and + sign
    setMobileNumber(value);
  };
  
  // Handle OTP input change
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    if (value.length <= 6) { // Only allow 6 digits max
      setOtp(value);
    }
  };
  
  // Handle paste event for OTP
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const numericData = pasteData.replace(/[^0-9]/g, '').substring(0, 6);
    setOtp(numericData);
  };
  
  // Handle user data change for registration
  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Validate mobile number
  const validateMobileNumber = () => {
    // Basic validation to ensure mobile number is not empty and has at least 10 digits
    if (!mobileNumber || mobileNumber.replace(/[^0-9]/g, '').length < 10) {
      setError('Please enter a valid mobile number');
      return false;
    }
    return true;
  };
  
  // Validate OTP
  const validateOtp = () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return false;
    }
    return true;
  };
  
  // Validate registration data
  const validateRegistrationData = () => {
    if (!userData.name) {
      setError('Name is required');
      return false;
    }
    
    // Email validation is optional but if provided, should be valid
    if (userData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
    }
    
    return true;
  };
  
  // Start OTP timer
  const startOtpTimer = () => {
    setTimer(60); // 60 seconds countdown
    const interval = setInterval(() => {
      setTimer(prevTime => {
        if (prevTime <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };
  
  // Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateMobileNumber()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authService.requestOTP(mobileNumber);
      setOtpSent(true);
      setSuccess(`OTP sent to ${mobileNumber}`);
      setCurrentStep(AuthStep.VERIFY_OTP);
      startOtpTimer();
    } catch (err) {
      console.error('Error requesting OTP:', err);
      setError(err.response?.data?.message || err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateOtp()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authService.verifyOTP(mobileNumber, otp);
      
      if (response.isNewUser) {
        setCurrentStep(AuthStep.REGISTRATION);
        setSuccess('OTP verified. Please complete your registration.');
      } else {
        setSuccess('Login successful! Redirecting...');
        
        // Redirect based on user role after a short delay
        setTimeout(() => {
          if (response.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
        }, 1000);
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      
      // Check if more registration data is required
      if (err.response?.data?.requiresRegistration) {
        setCurrentStep(AuthStep.REGISTRATION);
      } else {
        setError(err.response?.data?.message || err.message || 'Invalid OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Complete registration
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateRegistrationData()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authService.verifyOTPAndRegister(mobileNumber, otp, userData);
      
      setSuccess('Registration successful! Redirecting...');
      
      // Redirect based on user role after a short delay
      setTimeout(() => {
        if (response.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Render mobile number form
  const renderMobileForm = () => (
    <Form onSubmit={handleRequestOtp}>
      <Form.Group className="mb-4" controlId="mobileNumber">
        <Form.Label>Mobile Number</Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            value={mobileNumber}
            onChange={handleMobileChange}
            placeholder="Enter your mobile number"
            required
          />
        </InputGroup>
        <Form.Text className="text-muted">
          We'll send a one-time password to this number
        </Form.Text>
      </Form.Group>
      
      <Button 
        variant="primary" 
        type="submit" 
        disabled={loading} 
        className="w-100 py-2"
      >
        {loading ? 'Sending OTP...' : 'Send OTP'}
      </Button>
    </Form>
  );
  
  // Render OTP verification form
  const renderOtpForm = () => {
    return (
      <Form onSubmit={handleVerifyOtp}>
        <Form.Group className="mb-4" controlId="otp">
          <Form.Label>One-Time Password (OTP)</Form.Label>
          
          {/* Single input field for all devices */}
          <Form.Control
            id="otp-input"
            ref={otpInputRef}
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={handleOtpChange}
            onPaste={handleOtpPaste}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className="text-center"
            style={{ 
              fontSize: '1.5rem',
              letterSpacing: '0.5rem',
              fontWeight: 'bold'
            }}
            autoComplete="one-time-code"
          />
          
          <Form.Text className="text-center d-block mb-2">
            Enter the 6-digit code sent to your mobile
          </Form.Text>
          
          <Form.Text className="d-flex justify-content-between mt-2">
            <span>OTP sent to {mobileNumber}</span>
            {timer > 0 ? (
              <span>Resend in {timer}s</span>
            ) : (
              <Button 
                variant="link" 
                size="sm" 
                className="p-0" 
                onClick={handleRequestOtp} 
                disabled={loading}
              >
                Resend OTP
              </Button>
            )}
          </Form.Text>
        </Form.Group>
        
        <Button 
          variant="primary" 
          type="submit" 
          disabled={loading || otp.length !== 6} 
          className="w-100 py-2"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>
        
        <div className="text-center mt-3">
          <Button 
            variant="link" 
            onClick={() => setCurrentStep(AuthStep.ENTER_MOBILE)}
            disabled={loading}
          >
            Change Mobile Number
          </Button>
        </div>
      </Form>
    );
  };
  
  // Render registration form
  const renderRegistrationForm = () => (
    <Form onSubmit={handleCompleteRegistration}>
      <Row>
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
              onChange={handleUserDataChange}
              placeholder="Enter your full name"
              required
            />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={userData.email}
              onChange={handleUserDataChange}
              placeholder="Enter your email (optional)"
            />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Preferred Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={userData.username}
              onChange={handleUserDataChange}
              placeholder="Choose a username (optional)"
            />
            <Form.Text className="text-muted">
              If left blank, a username will be auto-generated
            </Form.Text>
          </Form.Group>
        </Col>
        
        <Col md={12}>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={userData.address}
              onChange={handleUserDataChange}
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
              onChange={handleUserDataChange}
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
              onChange={handleUserDataChange}
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
              onChange={handleUserDataChange}
              placeholder="Enter your country"
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Button 
        variant="primary" 
        type="submit" 
        disabled={loading} 
        className="w-100 py-2 mt-3"
      >
        {loading ? 'Completing Registration...' : 'Complete Registration'}
      </Button>
    </Form>
  );
  
  // Render appropriate form based on current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case AuthStep.ENTER_MOBILE:
        return renderMobileForm();
      case AuthStep.VERIFY_OTP:
        return renderOtpForm();
      case AuthStep.REGISTRATION:
        return renderRegistrationForm();
      default:
        return renderMobileForm();
    }
  };
  
  return (
    <Container>
      <style>{customStyles}</style>
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="mt-5 mb-4 shadow-sm">
            <Card.Header className="bg-temple text-white">
              <h3 className="mb-0">
                {currentStep === AuthStep.REGISTRATION
                  ? 'Complete Your Registration'
                  : 'Login with Mobile OTP'}
              </h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              {renderCurrentStep()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MobileOTPAuth; 