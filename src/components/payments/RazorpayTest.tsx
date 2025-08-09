import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { razorpayService, razorpayConfig } from '../../services/razorpay';
import { toast } from 'react-toastify';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayTestProps {
  eventId: string;
  eventTitle: string;
  amount: number;
}

const RazorpayTest: React.FC<RazorpayTestProps> = ({ eventId, eventTitle, amount }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState({
    scriptLoaded: false,
    razorpayAvailable: false,
    backendConnectivity: false,
    orderCreation: false,
    razorpayOpen: false,
  });

  const updateTest = (testName: string, status: boolean) => {
    setTests(prev => ({ ...prev, [testName]: status }));
  };

  const runTests = async () => {
    setLoading(true);
    setTests({
      scriptLoaded: false,
      razorpayAvailable: false,
      backendConnectivity: false,
      orderCreation: false,
      razorpayOpen: false,
    });

    try {
      // Test 1: Check if Razorpay script is loaded
      console.log('Test 1: Checking Razorpay script...');
      await new Promise((resolve) => {
        if (window.Razorpay) {
          updateTest('scriptLoaded', true);
          updateTest('razorpayAvailable', true);
          resolve(true);
        } else {
          // Try to load script
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
            updateTest('scriptLoaded', true);
            if (window.Razorpay) {
              updateTest('razorpayAvailable', true);
            }
            resolve(true);
          };
          script.onerror = () => {
            updateTest('scriptLoaded', false);
            resolve(false);
          };
          document.body.appendChild(script);
        }
      });

      // Test 2: Test backend connectivity
      console.log('Test 2: Testing backend connectivity...');
      try {
        const orderResponse = await razorpayService.createOrder(
          amount,
          eventId,
          `Test order for ${eventTitle}`
        );
        updateTest('backendConnectivity', true);
        
        if (orderResponse.success) {
          updateTest('orderCreation', true);
          
          // Test 3: Test Razorpay opening
          console.log('Test 3: Testing Razorpay opening...');
          if (window.Razorpay) {
            const options = {
              ...razorpayConfig,
              amount: orderResponse.order.amount,
              order_id: orderResponse.order.id,
              description: `Test payment for ${eventTitle}`,
              prefill: {
                name: 'Test User',
                email: 'test@example.com',
                contact: '9999999999',
              },
              handler: (response: any) => {
                console.log('Test payment successful:', response);
                updateTest('razorpayOpen', true);
                toast.success('Razorpay test completed successfully!');
              },
              modal: {
                ondismiss: () => {
                  console.log('Test payment modal dismissed');
                },
              },
            };

            try {
              const razorpay = new window.Razorpay(options);
              razorpay.open();
              updateTest('razorpayOpen', true);
            } catch (error) {
              console.error('Error opening Razorpay:', error);
              updateTest('razorpayOpen', false);
            }
          }
        }
      } catch (error) {
        console.error('Backend connectivity test failed:', error);
        updateTest('backendConnectivity', false);
      }

    } catch (error) {
      console.error('Test failed:', error);
      toast.error('Test failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const testItems = [
    { key: 'scriptLoaded', label: 'Razorpay Script Loaded', status: tests.scriptLoaded },
    { key: 'razorpayAvailable', label: 'Razorpay SDK Available', status: tests.razorpayAvailable },
    { key: 'backendConnectivity', label: 'Backend API Connectivity', status: tests.backendConnectivity },
    { key: 'orderCreation', label: 'Order Creation Success', status: tests.orderCreation },
    { key: 'razorpayOpen', label: 'Razorpay Checkout Opens', status: tests.razorpayOpen },
  ];

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ 
          bgcolor: '#2196f3', 
          '&:hover': { bgcolor: '#1976d2' },
          ml: 1
        }}
      >
        Diagnose Razorpay
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ color: '#7f1d1d', fontWeight: 'bold' }}>
            Razorpay Integration Diagnostics
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ color: '#d35400', fontWeight: 'bold' }}>
              Event: {eventTitle}
            </Typography>
            <Typography variant="h6" sx={{ color: '#7f1d1d', fontWeight: 'bold', mt: 1 }}>
              Amount: ₹{amount}
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              This diagnostic tool will test the complete Razorpay integration:
            </Typography>
          </Alert>

          <List>
            {testItems.map((item, index) => (
              <ListItem key={item.key}>
                <ListItemIcon>
                  {loading && index === testItems.findIndex(t => !t.status) ? (
                    <CircularProgress size={20} />
                  ) : item.status ? (
                    <CheckCircleIcon sx={{ color: 'green' }} />
                  ) : (
                    <ErrorIcon sx={{ color: 'red' }} />
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  secondary={
                    item.status ? 'Passed' : 
                    loading && index === testItems.findIndex(t => !t.status) ? 'Testing...' : 
                    'Failed'
                  }
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              <strong>Razorpay Configuration:</strong><br />
              Key ID: {razorpayConfig.key}<br />
              Currency: {razorpayConfig.currency}<br />
              Name: {razorpayConfig.name}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Close
          </Button>
          <Button
            onClick={runTests}
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#d35400',
              '&:hover': { bgcolor: '#b34700' },
            }}
          >
            {loading ? 'Running Tests...' : 'Run Diagnostics'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RazorpayTest; 