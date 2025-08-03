import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const SimpleRazorpay: React.FC = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => toast.error('Failed to load Razorpay');
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  const openRazorpay = () => {
    if (!window.Razorpay) {
      toast.error('Razorpay not loaded');
      return;
    }

    const options = {
      key: 'rzp_test_E9LEIWSCMKLygJ',
      amount: 50000, // ₹500 in paise
      currency: 'INR',
      name: 'Temple Management System',
      description: 'Test Payment',
      image: '/logo192.png',
      prefill: {
        name: 'Test User',
        email: 'test@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#d35400'
      },
      handler: function(response: any) {
        console.log('Payment Success:', response);
        toast.success('Payment Successful!');
        alert(`Payment ID: ${response.razorpay_payment_id}`);
      },
      modal: {
        ondismiss: function() {
          console.log('Payment cancelled');
          toast.info('Payment cancelled');
        }
      }
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
        fontWeight: 'bold'
      }}
    >
      {scriptLoaded ? 'Open Razorpay' : 'Loading...'}
    </Button>
  );
};

export default SimpleRazorpay; 