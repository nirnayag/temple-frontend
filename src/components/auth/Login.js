import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../../services/auth';

const Login = () => {
  const { t } = useTranslation();
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
      setError(t('auth.requiredFields'));
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
      
      setSuccess(t('auth.loginSuccessful'));
      
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
      setError(err.response?.data?.message || err.message || t('auth.loginFailed'));
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
              <h3 className="mb-0">{t('auth.login')}</h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="username">
                  <Form.Label>{t('auth.username')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder={t('auth.enterUsername')}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>{t('auth.password')}</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder={t('auth.enterPassword')}
                    required
                  />
                </Form.Group>
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check
                    type="checkbox"
                    id="rememberMe"
                    label={t('auth.rememberMe')}
                  />
                  <Link to="/forgot-password" className="text-primary text-decoration-none">
                    {t('auth.forgotPassword')}
                  </Link>
                </div>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading} 
                  className="w-100 py-2"
                >
                  {loading ? t('auth.loggingIn') : t('auth.login')}
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="text-center">
              <p className="mb-0">
                {t('auth.dontHaveAccount')} <Link to="/register">{t('auth.register')}</Link>
              </p>
              <p className="small text-muted mt-2">
                {t('auth.demoCredentials')} <br/>
                {t('auth.adminCredentials')} <br/>
                {t('auth.userCredentials')}
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login; 