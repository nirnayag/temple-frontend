import React, { useState, useEffect } from 'react';
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

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface IntegratedPaymentProps {
  eventId: string;
  eventTitle: string;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentFailure: (error: string) => void;
}

const IntegratedPayment: React.FC<IntegratedPaymentProps> = ({
  eventId,
  eventTitle,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    // Load user details from localStorage
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserDetails({
          name: user.name || user.username || '',
          email: user.email || '',
          phone: user.phone || user.mobileNumber || '',
        });
      }
    } catch (error) {
      console.error('Error loading user details:', error);
    }

    // Load Razorpay script
    if (window.Razorpay) {
      setScriptLoaded(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setScriptLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      toast.error('Failed to load payment gateway');
    };
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum < 1) {
      toast.error('Please enter a valid amount (minimum ₹1)');
      return;
    }

    if (!RAZORPAY_KEY_ID) {
      toast.error('Razorpay key not configured');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create order on backend
      const orderResponse = await razorpayService.createOrder(
        amountNum,
        eventId,
        description || `Donation for ${eventTitle}`
      );

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      // Step 2: Open Razorpay checkout
      const options = getRazorpayConfig({
        amount: orderResponse.order.amount,
        orderId: orderResponse.order.id,
        description: description || `Donation for ${eventTitle}`,
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
            // Step 3: Verify payment
            const verificationResponse = await razorpayService.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              orderResponse.paymentId
            );

            if (verificationResponse.success) {
              toast.success('Payment successful!');
              onPaymentSuccess(orderResponse.paymentId);
              handleClose();
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
      console.error('Payment error:', error);
      const msg = error.response?.data?.message || error.message || 'Payment failed';
      toast.error(msg);
      onPaymentFailure(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setAmount('');
    setDescription('');
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: '#d35400',
          '&:hover': { bgcolor: '#b34700' },
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          ml: 1,
        }}
      >
        Donate Now
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ color: '#7f1d1d', fontWeight: 'bold' }}>
            Make a Donation
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ color: '#d35400', fontWeight: 'bold' }}>
              Event: {eventTitle}
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Enter the amount you would like to donate. You will be redirected to Razorpay's secure payment gateway.
            </Typography>
          </Alert>

          <TextField
            fullWidth
            label="Donation Amount (₹)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            margin="normal"
            required
            inputProps={{ min: 1, step: 1 }}
            sx={{ mb: 2 }}
            autoFocus
          />

          <TextField
            fullWidth
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Monthly donation, Event support"
            margin="normal"
            sx={{ mb: 2 }}
          />

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" sx={{ mb: 1, color: '#4a4a4a' }}>
            Your Details:
          </Typography>

          <TextField
            fullWidth
            label="Full Name"
            value={userDetails.name}
            onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={userDetails.email}
            onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Phone"
            value={userDetails.phone}
            onChange={(e) => setUserDetails(prev => ({ ...prev, phone: e.target.value }))}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            variant="contained"
            disabled={loading || !amount || parseFloat(amount) < 1}
            sx={{
              bgcolor: '#d35400',
              '&:hover': { bgcolor: '#b34700' },
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : (
              `Pay ₹${amount || '0'}`
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IntegratedPayment;
