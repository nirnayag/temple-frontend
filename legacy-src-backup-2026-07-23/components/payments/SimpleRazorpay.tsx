import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import { RAZORPAY_KEY_ID } from '../../services/razorpay';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface SimpleRazorpayProps {
  amount?: number;
  description?: string;
}

const SimpleRazorpay: React.FC<SimpleRazorpayProps> = ({
  amount = 500,
  description = 'Donation',
}) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (window.Razorpay) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => toast.error('Failed to load Razorpay');
    document.body.appendChild(script);
  }, []);

  const openRazorpay = () => {
    if (!window.Razorpay) {
      toast.error('Razorpay not loaded');
      return;
    }

    if (!RAZORPAY_KEY_ID) {
      toast.error('Razorpay key not configured');
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: 'INR',
      name: 'Shree Kalamba Devi Temple',
      description,
      image: '/logo192.png',
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      theme: {
        color: '#d35400',
      },
      handler: function (response: any) {
        toast.success('Payment Successful!');
        alert(`Payment ID: ${response.razorpay_payment_id}`);
      },
      modal: {
        ondismiss: function () {
          toast.info('Payment cancelled');
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      toast.error('Failed to open payment gateway');
    }
  };

  return (
    <Button
      variant="contained"
      onClick={openRazorpay}
      disabled={!scriptLoaded}
      sx={{
        bgcolor: '#d35400',
        '&:hover': { bgcolor: '#b34700' },
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: 'bold',
      }}
    >
      {scriptLoaded ? `Pay ₹${amount}` : 'Loading...'}
    </Button>
  );
};

export default SimpleRazorpay;
