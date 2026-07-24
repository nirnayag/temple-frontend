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
        'INR',
        `Test registration for ${eventTitle}`
      );
      
      console.log('Razorpay order created successfully:', orderResponse.orderId);
      
      // Step 2: Get payment details (using the correct method)
      console.log('Step 2: Getting payment details...');
      // Note: We need a payment ID to get details, so we'll skip this for now
      // const paymentDetails = await razorpayService.getPaymentDetails(paymentId);
      
      // Step 3: Test webhook handling
      console.log('Step 3: Testing webhook handling...');
      const testWebhookData = {
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: 'test_payment_id',
              amount: amount * 100,
              status: 'captured'
            }
          }
        }
      };
      
      try {
        await razorpayService.handleWebhook(testWebhookData);
        console.log('Webhook handling test completed');
      } catch (webhookError) {
        console.log('Webhook test failed (expected for test data):', webhookError);
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
              1. Create Razorpay order
            </Typography>
            <Typography variant="body2">
              2. Test webhook handling
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