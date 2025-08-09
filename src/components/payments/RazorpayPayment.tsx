import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { toast } from 'react-toastify';
import { razorpayService, razorpayConfig } from '../../services/razorpay';
import PaymentSuccess from './PaymentSuccess';

interface RazorpayPaymentProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  amount: number;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentFailure: (error: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  open,
  onClose,
  eventId,
  eventTitle,
  amount,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successPaymentId, setSuccessPaymentId] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    // Check if script is already present
    const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existingScript) {
      // Wait for existing script to load
      existingScript.addEventListener('load', () => setRazorpayLoaded(true));
      existingScript.addEventListener('error', () => {
        console.error('Failed to load existing Razorpay script');
        setRazorpayLoaded(false);
      });
      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      setRazorpayLoaded(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      setRazorpayLoaded(false);
      toast.error('Failed to load payment gateway. Please check your internet connection.');
    };
    
    document.body.appendChild(script);

    return () => {
      // Only remove if we added it
      if (!existingScript && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = async () => {
    if (!userDetails.name || !userDetails.email || !userDetails.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!razorpayLoaded || !window.Razorpay) {
      toast.error('Payment gateway not loaded. Please try again.');
      return;
    }

    setLoading(true);
    try {
      // Create order on backend
      console.log('Creating Razorpay order...');
      const orderResponse = await razorpayService.createOrder(
        amount,
        eventId,
        `Registration for ${eventTitle}`
      );

      console.log('Order response:', orderResponse);

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      const options = {
        ...razorpayConfig,
        amount: orderResponse.order.amount, // Backend already converts to paise
        order_id: orderResponse.order.id,
        description: `Registration for ${eventTitle}`,
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        handler: async (response: any) => {
          console.log('Payment successful:', response);
          try {
            // Verify payment on backend
            const verificationResponse = await razorpayService.verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );

            if (verificationResponse.success) {
              setSuccessPaymentId(orderResponse.paymentId);
              setShowSuccessDialog(true);
              onPaymentSuccess(orderResponse.paymentId);
            } else {
              throw new Error(verificationResponse.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
            onPaymentFailure('Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
            setLoading(false);
          },
        },
      };

      console.log('Opening Razorpay with options:', options);
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment. Please try again.');
      onPaymentFailure('Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ color: '#7f1d1d', fontWeight: 'bold' }}>
          Event Registration Payment
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ color: '#d35400', fontWeight: 'bold' }}>
            {eventTitle}
          </Typography>
          <Typography variant="h5" sx={{ color: '#7f1d1d', fontWeight: 'bold', mt: 1 }}>
            ₹{amount}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 2, color: '#4a4a4a' }}>
          Please provide your details for registration:
        </Typography>

        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={userDetails.name}
          onChange={handleInputChange}
          margin="normal"
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={userDetails.email}
          onChange={handleInputChange}
          margin="normal"
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={userDetails.phone}
          onChange={handleInputChange}
          margin="normal"
          required
          sx={{ mb: 2 }}
        />

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            You will be redirected to Razorpay's secure payment gateway to complete your registration.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ color: '#d35400', borderColor: '#d35400' }}>
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          variant="contained"
          disabled={loading || !userDetails.name || !userDetails.email || !userDetails.phone}
          sx={{
            bgcolor: '#d35400',
            '&:hover': { bgcolor: '#b34700' },
            '&:disabled': { bgcolor: '#ccc' },
          }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: 'white' }} />
          ) : (
            `Pay ₹${amount}`
          )}
        </Button>
      </DialogActions>

      {/* Payment Success Dialog */}
      <PaymentSuccess
        open={showSuccessDialog}
        onClose={() => {
          setShowSuccessDialog(false);
          onClose();
        }}
        paymentId={successPaymentId}
        eventTitle={eventTitle}
        amount={amount}
      />
    </Dialog>
  );
};

export default RazorpayPayment; 