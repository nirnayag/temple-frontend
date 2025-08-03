import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Divider,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { eventService, paymentService } from '../../services/api';
import RazorpayPayment from '../payments/RazorpayPayment';
import PaymentTest from '../payments/PaymentTest';
import RazorpayTest from '../payments/RazorpayTest';
import SimpleRazorpay from '../payments/SimpleRazorpay';
import IntegratedPayment from '../payments/IntegratedPayment';
import { toast } from 'react-toastify';

interface EventDetailProps {
  _id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  eventType?: string;
  registrationRequired?: boolean;
  description: string;
  bannerImage?: string;
}

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [event, setEvent] = useState<EventDetailProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [registrationAmount, setRegistrationAmount] = useState(500); // Default amount, can be made dynamic

  useEffect(() => {
    const fetchEventDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await eventService.getById(id);
        setEvent(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getEventTypeColor = (type?: string) => {
    switch (type) {
      case 'festival':
        return 'success';
      case 'spiritual':
        return 'primary';
      case 'discourse':
        return 'info';
      case 'community':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleRegisterNow = async () => {
    // Simply open the payment dialog - RazorpayPayment component will handle the entire flow
    setPaymentDialogOpen(true);
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      // Register for the event after successful payment
      await eventService.register(id!);
      toast.success('Successfully registered for the event!');
      // Optionally refresh event data or update UI
    } catch (error) {
      console.error('Error completing registration:', error);
      toast.error('Payment successful but registration failed. Please contact support.');
    }
  };

  const handlePaymentFailure = (error: string) => {
    console.error('Payment failed:', error);
    // Payment failure is already handled in the RazorpayPayment component
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, minHeight: '100vh', bgcolor: '#E2DFD2' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress sx={{ color: '#d35400' }} />
        </Box>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container sx={{ py: 4, minHeight: '100vh', bgcolor: '#E2DFD2' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Event not found'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/events')}
          sx={{ bgcolor: '#d35400', '&:hover': { bgcolor: '#b34700' } }}
        >
          Back to Events
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4, minHeight: '100vh', bgcolor: '#E2DFD2' }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/events')}
        sx={{ mb: 3, color: '#d35400', borderColor: '#d35400', '&:hover': { borderColor: '#b34700', color: '#b34700' } }}
      >
        Back to Events
      </Button>

      <Card sx={{ maxWidth: 800, mx: 'auto' }}>
        {event.bannerImage && (
          <Box
            sx={{
              height: 300,
              backgroundImage: `url(${event.bannerImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '4px 4px 0 0',
            }}
          />
        )}
        
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Chip
              label={event.eventType || 'Event'}
              color={getEventTypeColor(event.eventType)}
              size="small"
              sx={{ textTransform: 'capitalize' }}
            />
            {event.registrationRequired && (
              <Chip
                label="Registration Required"
                color="warning"
                size="small"
              />
            )}
          </Box>

          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#7f1d1d', fontWeight: 'bold' }}>
            {event.title}
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CalendarIcon sx={{ color: '#d35400' }} />
                <Typography variant="body1">
                  {formatDate(event.date)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TimeIcon sx={{ color: '#d35400' }} />
                <Typography variant="body1">
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon sx={{ color: '#d35400' }} />
                <Typography variant="body1">
                  {event.location}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom sx={{ color: '#7f1d1d', fontWeight: 'bold' }}>
            Event Description
          </Typography>
          
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#4a4a4a' }}>
            {event.description}
          </Typography>

          {event.registrationRequired && (
            <Box sx={{ mt: 4, p: 3, bgcolor: '#fff7ed', borderRadius: 2, border: '1px solid #fed7aa' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#d35400', fontWeight: 'bold' }}>
                Registration Required
              </Typography>
              <Typography variant="body2" sx={{ color: '#7f1d1d' }}>
                This event requires registration. Please contact the temple office or use the registration form to secure your spot.
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={event.registrationRequired ? handleRegisterNow : undefined}
              sx={{
                bgcolor: '#d35400',
                '&:hover': { bgcolor: '#b34700' },
                px: 4,
              }}
            >
              {event.registrationRequired ? 'Register Now' : 'Learn More'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/events')}
              sx={{
                color: '#d35400',
                borderColor: '#d35400',
                '&:hover': { borderColor: '#b34700', color: '#b34700' },
                px: 4,
              }}
            >
              View All Events
            </Button>
            
            {/* Test Payment Flow Button (for development) */}
            <PaymentTest
              eventId={id!}
              eventTitle={event.title}
              amount={registrationAmount}
            />
            
            {/* Razorpay Diagnostic Tool */}
            <RazorpayTest
              eventId={id!}
              eventTitle={event.title}
              amount={registrationAmount}
            />
            
            {/* Simple Razorpay Button */}
            <SimpleRazorpay />
            
            {/* Integrated Payment with /payments endpoint */}
            <IntegratedPayment
              eventId={id!}
              eventTitle={event.title}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentFailure={handlePaymentFailure}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Razorpay Payment Dialog */}
      <RazorpayPayment
        open={paymentDialogOpen}
        onClose={() => {
          setPaymentDialogOpen(false);
        }}
        eventId={id!}
        eventTitle={event.title}
        amount={registrationAmount}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />
    </Container>
  );
};

export default EventDetail; 