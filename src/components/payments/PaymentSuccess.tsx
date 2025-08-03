import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

interface PaymentSuccessProps {
  open: boolean;
  onClose: () => void;
  paymentId: string;
  eventTitle: string;
  amount: number;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  open,
  onClose,
  paymentId,
  eventTitle,
  amount,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 32 }} />
          <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
            Payment Successful!
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, color: '#4a4a4a' }}>
            Your payment has been processed successfully. Here are the details:
          </Typography>
          
          <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#7f1d1d' }}>
              Event: {eventTitle}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Amount: ₹{amount}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Payment ID: {paymentId}
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ color: '#4a4a4a' }}>
            You will receive a confirmation email shortly. Please keep this payment ID for your records.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: '#d35400',
            '&:hover': { bgcolor: '#b34700' },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentSuccess; 