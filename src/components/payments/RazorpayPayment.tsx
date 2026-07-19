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
import { razorpayService, getRazorpayConfig, RAZORPAY_KEY_ID } from '../../services/razorpay';
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
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setRazorpayLoaded(true));
      existingScript.addEventListener('error', () => setRazorpayLoaded(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      setRazorpayLoaded(false);
      toast.error('Failed to load payment gateway. Please check your internet connection.');
    };
    document.body.appendChild(script);

    return () => {
      if (!existingScript && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
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

    if (!RAZORPAY_KEY_ID) {
      toast.error('Razorpay key not configured. Please contact support.');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create order on backend
      const orderResponse = await razorpayService.createOrder(
        amount,
        eventId,
        `Registration for ${eventTitle}`
      );

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      // Step 2: Open Razorpay checkout modal with order_id
      const options = getRazorpayConfig({
        amount: orderResponse.order.amount,
        orderId: orderResponse.order.id,
        description: `Registration for ${eventTitle}`,
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
      });

      const razorpayOptions = {
        ...options,
        handler: async (response: any) => {
          try {
            // Step 3: Verify payment on backend
            const verificationResponse = await razorpayService.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              orderResponse.paymentId
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
            setLoading(false);
            toast.info('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to initiate payment';
      toast.error(msg);
      onPaymentFailure(msg);
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
