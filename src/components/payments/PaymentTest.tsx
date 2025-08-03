import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { razorpayService } from '../../services/razorpay';
import { toast } from 'react-toastify';

interface PaymentTestProps {
  eventId: string;
  eventTitle: string;
  amount: number;
}

const PaymentTest: React.FC<PaymentTestProps> = ({ eventId, eventTitle, amount }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const testPaymentFlow = async () => {
    setLoading(true);
    try {
      // Step 1: Create Razorpay order
      console.log('Step 1: Creating Razorpay payment order...');
      const orderResponse = await razorpayService.createOrder(
        amount,
        eventId,
        `Test registration for ${eventTitle}`
      );
      
      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      console.log('Razorpay order created successfully:', orderResponse.order.id);
      console.log('Payment ID:', orderResponse.paymentId);
      
      // Step 2: Check payment status
      console.log('Step 2: Checking payment status...');
      const statusResponse = await razorpayService.getPaymentStatus(orderResponse.paymentId);
      
      if (statusResponse.success) {
        console.log('Payment status retrieved:', statusResponse.payment.status);
      }
      
      // Step 3: Get user's payment history
      console.log('Step 3: Getting payment history...');
      const historyResponse = await razorpayService.getMyPayments();
      
      if (historyResponse.success) {
        console.log('Payment history retrieved:', historyResponse.payments.length, 'payments found');
      }
      
      toast.success('Razorpay payment flow test completed successfully!');
      setOpen(false);
    } catch (error) {
      console.error('Razorpay payment test failed:', error);
      toast.error('Razorpay payment test failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{ color: '#d35400', borderColor: '#d35400' }}
      >
        Test Razorpay Flow
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ color: '#7f1d1d', fontWeight: 'bold' }}>
            Test Razorpay Payment Flow
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

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              This will test the Razorpay payment API endpoints:
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              1. Create Razorpay order (pending)
            </Typography>
            <Typography variant="body2">
              2. Check payment status
            </Typography>
            <Typography variant="body2">
              3. Get payment history
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
              Note: This tests API connectivity without opening Razorpay checkout
            </Typography>
          </Alert>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={testPaymentFlow}
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#d35400',
              '&:hover': { bgcolor: '#b34700' },
            }}
          >
            {loading ? 'Testing...' : 'Test Razorpay APIs'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentTest; 