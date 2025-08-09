// Example Backend Implementation for Razorpay Integration
// This is a reference implementation using Express.js and Razorpay Node.js SDK

const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Initialize Razorpay with updated keys
const razorpay = new Razorpay({
  key_id: 'rzp_test_dZohG3RPiLcurf',
  key_secret: 'ngHtEFjcnJZTKcFWt8T72Y3d'
});

// 1. Create Payment Order
app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;
    
    const options = {
      amount: amount, // Amount in paise
      currency: currency || 'INR',
      receipt: receipt,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// 2. Verify Payment
app.post('/api/payments/verify', async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;
    
    // Verify signature
    const text = orderId + '|' + paymentId;
    const generated_signature = crypto
      .createHmac('sha256', 'ngHtEFjcnJZTKcFWt8T72Y3d')
      .update(text)
      .digest('hex');
    
    if (generated_signature === signature) {
      res.json({
        verified: true,
        paymentId: paymentId
      });
    } else {
      res.status(400).json({
        verified: false,
        error: 'Invalid signature'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// 3. Create Payment Record (Called first from frontend)
app.post('/api/payments', async (req, res) => {
  try {
    const { eventId, amount, paymentType, status, description } = req.body;
    
    // Create payment record in database
    const payment = {
      eventId,
      amount,
      paymentType,
      status,
      description,
      createdAt: new Date()
    };
    
    // Example database save (pseudo-code):
    // const newPayment = await Payment.create(payment);
    
    res.json({
      success: true,
      _id: 'payment_' + Date.now(), // Replace with actual DB ID
      ...payment
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// 4. Update Payment Status
app.patch('/api/payments/:paymentId/status', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status, eventId } = req.body;
    
    // Here you would typically:
    // 1. Update payment status in your database
    // 2. Link payment to event registration
    // 3. Send confirmation email
    // 4. Update event registration status
    
    // Example database update (pseudo-code):
    // await Payment.findByIdAndUpdate(paymentId, { status, eventId });
    // await EventRegistration.create({ eventId, paymentId, status: 'registered' });
    
    res.json({
      success: true,
      paymentId: paymentId,
      status: status
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// 5. Get Payment Details
app.get('/api/payments/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await razorpay.payments.fetch(paymentId);
    
    res.json({
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      created_at: payment.created_at
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Failed to fetch payment details' });
  }
});

// 6. Webhook for Payment Notifications - UPDATED FOR AUTOMATIC STATUS UPDATE
app.post('/api/payments/webhook', (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const text = JSON.stringify(req.body);
    
    const generated_signature = crypto
      .createHmac('sha256', 'ngHtEFjcnJZTKcFWt8T72Y3d')
      .update(text)
      .digest('hex');
    
    if (generated_signature === signature) {
      // Payment is verified, process the webhook
      const event = req.body;
      
      console.log('Webhook received:', event.event);
      
      if (event.event === 'payment.captured') {
        // Payment was successful - UPDATE STATUS TO COMPLETED
        const paymentEntity = event.payload.payment.entity;
        
        console.log('Payment captured:', paymentEntity.id);
        
        // Update payment status to completed in database
        // This is where you automatically update the status
        updatePaymentStatusInDB(paymentEntity.id, 'completed');
        
        // Send confirmation email to user
        // sendPaymentConfirmationEmail(paymentEntity);
        
        // Update event registration if needed
        // updateEventRegistration(paymentEntity);
        
      } else if (event.event === 'payment.failed') {
        // Payment failed
        const paymentEntity = event.payload.payment.entity;
        console.log('Payment failed:', paymentEntity.id);
        
        // Update payment status to failed
        updatePaymentStatusInDB(paymentEntity.id, 'failed');
      }
      
      res.json({ received: true });
    } else {
      res.status(400).json({ error: 'Invalid webhook signature' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Helper function to update payment status in database
async function updatePaymentStatusInDB(paymentId, status) {
  try {
    // Example database update (replace with your actual database logic):
    // await Payment.findOneAndUpdate(
    //   { razorpayPaymentId: paymentId },
    //   { status: status, updatedAt: new Date() }
    // );
    
    console.log(`Payment ${paymentId} status updated to: ${status}`);
    
    // If payment is completed, you can also:
    if (status === 'completed') {
      // 1. Mark event registration as confirmed
      // 2. Send confirmation SMS/Email
      // 3. Generate receipt
      // 4. Update inventory if needed
      console.log(`Payment ${paymentId} completed - triggering post-payment actions`);
    }
    
  } catch (error) {
    console.error('Error updating payment status in DB:', error);
  }
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Razorpay webhook endpoint: /api/payments/webhook');
});

// Required npm packages:
// npm install express razorpay crypto 