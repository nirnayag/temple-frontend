// Example Backend Implementation for Razorpay Integration
// This is a reference implementation using Express.js and Razorpay Node.js SDK

const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'rzp_test_E9LEIWSCMKLygJ',
  key_secret: 'xfTNEoWz8EKEKoijNYjjkhFH'
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
      .createHmac('sha256', 'xfTNEoWz8EKEKoijNYjjkhFH')
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

// 4. Get Payment Details
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

// 5. Webhook for Payment Notifications (Optional)
app.post('/api/payments/webhook', (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const text = JSON.stringify(req.body);
    
    const generated_signature = crypto
      .createHmac('sha256', 'xfTNEoWz8EKEKoijNYjjkhFH')
      .update(text)
      .digest('hex');
    
    if (generated_signature === signature) {
      // Payment is verified, process the webhook
      const event = req.body;
      
      if (event.event === 'payment.captured') {
        // Payment was successful
        console.log('Payment captured:', event.payload.payment.entity.id);
        // Update your database, send emails, etc.
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Required npm packages:
// npm install express razorpay crypto 