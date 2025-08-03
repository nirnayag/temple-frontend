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
import { paymentService } from '../../services/api';
import { razorpayService } from '../../services/razorpay';

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
  const [step, setStep] = useState(1); // 1: Amount Form, 2: Razorpay Payment
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  // Payment details
  const [amount, setAmount] = useState('');
  const [paymentRecord, setPaymentRecord] = useState<any>(null);
  
  // User details from localStorage
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    devoteeId: '',
  });

  useEffect(() => {
    // Load user details from localStorage
    const loadUserDetails = () => {
      try {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        console.log('Loading user details from localStorage:', userData);
        
        if (userData) {
          const user = JSON.parse(userData);
          const devoteeId = user._id || user.id || user.userId || 'default_devotee_id';
          
          setUserDetails({
            name: user.name || 'Anonymous User',
            email: user.email || 'user@example.com',
            phone: user.phone || user.mobileNumber || '9999999999',
            devoteeId: devoteeId,
          });
          
          console.log('User details loaded:', {
            name: user.name,
            email: user.email,
            devoteeId: devoteeId
          });
        } else {
          // Fallback if no user data in localStorage
          console.log('No user data found, using fallback');
          setUserDetails({
            name: 'Anonymous User',
            email: 'user@example.com',
            phone: '9999999999',
            devoteeId: 'temp_devotee_' + Date.now(),
          });
        }
      } catch (error) {
        console.error('Error loading user details:', error);
        // Set fallback values instead of showing error
        setUserDetails({
          name: 'Anonymous User',
          email: 'user@example.com',
          phone: '9999999999',
          devoteeId: 'temp_devotee_' + Date.now(),
        });
      }
    };

    loadUserDetails();

    // Load Razorpay script
    const loadRazorpayScript = () => {
      // Check if Razorpay is already available
      if (window.Razorpay) {
        console.log('Razorpay already available');
        setScriptLoaded(true);
        return;
      }

      // Check if script is already loading
      const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
      if (existingScript) {
        console.log('Razorpay script already exists, waiting for load...');
        existingScript.addEventListener('load', () => {
          console.log('Existing Razorpay script loaded');
          setScriptLoaded(true);
        });
        return;
      }

      console.log('Loading Razorpay script...');
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        console.log('Window.Razorpay available:', !!window.Razorpay);
        setScriptLoaded(true);
      };
      
      script.onerror = (error) => {
        console.error('Failed to load Razorpay script:', error);
        toast.error('Failed to load payment gateway. Please check your internet connection.');
        setScriptLoaded(false);
      };
      
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, []);

  const handleCreatePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Remove the devoteeId check since we always provide a fallback

    setLoading(true);
    try {
      // Create payment record using the exact format you specified
      const paymentData = {
        amount: parseInt(amount),
        purpose: "Donation",
        devoteeId: userDetails.devoteeId,
        paymentType: "online",
        eventId: eventId
      };

      console.log('Creating payment record with data:', paymentData);
      console.log('User details being used:', userDetails);
      
      const response = await paymentService.create(paymentData);
      
      console.log('Payment record created successfully:', response.data);
      setPaymentRecord(response.data);
      
      // Move to step 2 - Razorpay payment
      setStep(2);
      toast.success('Payment record created! Opening Razorpay...');
      
      // Auto-open Razorpay after a short delay
      setTimeout(() => {
        openRazorpay(response.data);
      }, 1500);

    } catch (error: any) {
      console.error('Error creating payment:', error);
      console.error('Error details:', error.response?.data);
      
      // Show specific error message
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create payment record';
      toast.error(`Payment creation failed: ${errorMessage}`);
      onPaymentFailure('Failed to create payment record');
    } finally {
      setLoading(false);
    }
  };

  const openRazorpay = async (payment: any) => {
    console.log('Opening Razorpay with payment:', payment);
    console.log('Razorpay script loaded:', scriptLoaded);
    console.log('Window.Razorpay available:', !!window.Razorpay);
    
    if (!window.Razorpay) {
      console.error('Razorpay not available in window object');
      toast.error('Razorpay not loaded. Please refresh the page and try again.');
      return;
    }

    if (!scriptLoaded) {
      console.error('Razorpay script not loaded yet');
      toast.error('Payment gateway is still loading. Please wait and try again.');
      return;
    }

    const razorpayAmount = parseInt(amount) * 100; // Convert to paise
    console.log('Amount in paise:', razorpayAmount);

    // Use simple options like the working SimpleRazorpay button
    const options = {
      key: 'rzp_test_E9LEIWSCMKLygJ',
      amount: razorpayAmount,
      currency: 'INR',
      name: 'Temple Management System',
      description: `Donation for ${eventTitle}`,
      image: '/logo192.png',
      // No order_id - this is what makes SimpleRazorpay work!
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.phone,
      },
      notes: {
        eventId: eventId,
        paymentId: payment._id,
        devoteeId: userDetails.devoteeId,
        purpose: "Donation",
      },
      theme: {
        color: '#d35400',
      },
      handler: async (response: any) => {
        console.log('Razorpay payment successful:', response);
        toast.success('Payment completed successfully!');
        
        // Simple success handling like SimpleRazorpay
        await handlePaymentSuccess(payment._id, response);
      },
      modal: {
        ondismiss: () => {
          console.log('Razorpay payment cancelled by user');
          toast.info('Payment cancelled');
          setStep(1);
        },
      },
    };

    console.log('Razorpay options (simple mode):', options);

    try {
      console.log('Creating Razorpay instance...');
      const rzp = new window.Razorpay(options);
      
      console.log('Razorpay instance created successfully:', rzp);
      console.log('Opening Razorpay modal...');
      
      rzp.open();
      
      console.log('Razorpay modal opened successfully');
      
    } catch (error: any) {
      console.error('Error opening Razorpay:', error);
      const errorMessage = error?.message || 'Unknown error occurred';
      toast.error(`Failed to open payment gateway: ${errorMessage}`);
      onPaymentFailure('Failed to open payment gateway');
    }
  };

  const handlePaymentSuccess = async (paymentId: string, razorpayResponse: any) => {
    try {
      console.log('Payment completed successfully');
      toast.success('Payment completed successfully!');
      
      // Call success callback
      onPaymentSuccess(paymentId);
      
      // Close dialog
      handleClose();
      
      // Show success message with payment details
      toast.success(`Donation successful! Payment ID: ${razorpayResponse.razorpay_payment_id}`);

    } catch (error) {
      console.error('Error handling payment success:', error);
      toast.error('Payment successful but failed to process. Please contact support.');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setStep(1);
    setAmount('');
    setPaymentRecord(null);
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
            {step === 1 ? 'Make a Donation' : 'Complete Payment'}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ color: '#d35400', fontWeight: 'bold' }}>
              Event: {eventTitle}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
              Devotee: {userDetails.name} ({userDetails.email})
            </Typography>
          </Box>

          {step === 1 && (
            <>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Enter the amount you would like to donate for this event.
                </Typography>
              </Alert>

              <TextField
                fullWidth
                label="Donation Amount (₹)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter donation amount"
                margin="normal"
                required
                inputProps={{ min: 1, step: 1 }}
                sx={{ mb: 2 }}
                autoFocus
              />

              <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#666' }}>
                  Payment Details:
                </Typography>
                <Typography variant="body2">Purpose: Donation</Typography>
                <Typography variant="body2">Payment Type: Online</Typography>
                <Typography variant="body2">Event ID: {eventId}</Typography>
                <Typography variant="body2">Devotee ID: {userDetails.devoteeId}</Typography>
              </Box>
            </>
          )}

          {step === 2 && (
            <>
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Payment record created successfully! Razorpay will open shortly.
                </Typography>
              </Alert>

              <Box sx={{ textAlign: 'center', py: 3 }}>
                <CircularProgress sx={{ color: '#d35400', mb: 2 }} />
                <Typography variant="body1">
                  Opening Razorpay for ₹{amount}...
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                  Payment ID: {paymentRecord?._id}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={() => openRazorpay(paymentRecord)}
                disabled={!scriptLoaded}
                sx={{ 
                  mt: 2,
                  bgcolor: '#d35400',
                  '&:hover': { bgcolor: '#b34700' }
                }}
              >
                {scriptLoaded ? '🔄 Click to Open Razorpay' : '⏳ Loading Payment Gateway...'}
              </Button>
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {scriptLoaded ? 
                    'If Razorpay doesn\'t open automatically, click the button above' :
                    'Please wait while we load the payment gateway...'
                  }
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          
          {step === 1 && (
            <Button
              onClick={handleCreatePayment}
              variant="contained"
              disabled={loading || !amount || parseFloat(amount) <= 0}
              sx={{
                bgcolor: '#d35400',
                '&:hover': { bgcolor: '#b34700' },
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Donate ₹' + (amount || '0')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IntegratedPayment; 