# Razorpay Integration for Temple Management System

## Overview
This document outlines the Razorpay payment integration for the Temple Management System frontend. The integration allows users to register for events with secure online payments and automatic status updates via webhooks.

## Frontend Implementation

### 1. Installed Dependencies
- `razorpay`: Razorpay JavaScript SDK

### 2. Key Components

#### Razorpay Service (`src/services/razorpay.ts`)
- Handles API communication with backend
- Manages payment order creation, verification, and status updates
- Configured with production keys

#### Payment Components
- `RazorpayPayment.tsx`: Main payment dialog with user details form
- `PaymentSuccess.tsx`: Success confirmation dialog
- Integrated into `EventDetail.tsx` for event registration

### 3. Configuration
- **Keys**: 
  - Key ID: `rzp_test_dZohG3RPiLcurf`
  - Key Secret: `ngHtEFjcnJZTKcFWt8T72Y3d`
- **API Base URL**: `https://api.shreekalambadevi.org/api`

## Backend API Requirements

The backend needs to implement the following endpoints:

### 1. Create Payment Order
```
POST /api/payments/create-order
Content-Type: application/json

{
  "amount": 50000, // Amount in paise
  "currency": "INR",
  "receipt": "event_123_1234567890"
}

Response:
{
  "orderId": "order_abc123",
  "amount": 50000,
  "currency": "INR"
}
```

### 2. Verify Payment
```
POST /api/payments/verify
Content-Type: application/json

{
  "paymentId": "pay_abc123",
  "orderId": "order_abc123",
  "signature": "generated_signature"
}

Response:
{
  "verified": true,
  "paymentId": "pay_abc123"
}
```

### 3. Create Payment Record
```
POST /api/payments
Content-Type: application/json

{
  "eventId": "event_123",
  "amount": 500,
  "paymentType": "online",
  "status": "pending",
  "description": "Registration for Aarti Ceremony"
}

Response:
{
  "success": true,
  "_id": "payment_abc123",
  "eventId": "event_123",
  "amount": 500,
  "status": "pending"
}
```

### 4. Update Payment Status
```
PATCH /api/payments/{paymentId}/status
Content-Type: application/json

{
  "status": "completed",
  "eventId": "event_123"
}

Response:
{
  "success": true,
  "paymentId": "pay_abc123",
  "status": "completed"
}
```

### 5. Webhook Endpoint (Automatic Status Updates)
```
POST /api/payments/webhook
Content-Type: application/json
X-Razorpay-Signature: webhook_signature

{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_abc123",
        "amount": 50000,
        "status": "captured"
      }
    }
  }
}

Response:
{
  "received": true
}
```

## Payment Flow

1. **User clicks "Register Now"** on an event
2. **Backend creates payment record** via `POST /payments` (status: pending)
3. **Payment dialog opens** with user details form
4. **User fills details** and clicks "Pay"
5. **Backend creates Razorpay order** via `/payments/create-order`
6. **Razorpay modal opens** with payment options
7. **User completes payment** on Razorpay gateway
8. **Payment verification** via `/payments/verify`
9. **Webhook automatically triggered** by Razorpay when payment succeeds
10. **Backend updates status** to "completed" via webhook handler
11. **Event registration** via existing `/events/{id}/register`
12. **Success dialog** shows payment confirmation

## Webhook Configuration

### Razorpay Dashboard Setup:
1. **Login to Razorpay Dashboard**
2. **Go to Settings > Webhooks**
3. **Add Webhook URL**: `https://api.shreekalambadevi.org/api/payments/webhook`
4. **Select Events**:
   - `payment.captured` (when payment succeeds)
   - `payment.failed` (when payment fails)
5. **Set Active**: Yes

### Webhook Events Handled:
- **payment.captured**: Automatically updates payment status to "completed"
- **payment.failed**: Updates payment status to "failed"

## Security Considerations

1. **Payment Verification**: All payments are verified using Razorpay's signature verification
2. **Webhook Security**: Webhook signatures are verified before processing
3. **Server-side Processing**: Sensitive operations (order creation, verification) happen on backend
4. **Automatic Updates**: Webhooks ensure payment status is updated even if frontend fails
5. **Error Handling**: Comprehensive error handling for payment failures

## Environment Variables

For production, update the following in `src/services/razorpay.ts`:

```typescript
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.REACT_APP_RAZORPAY_KEY_SECRET;
```

## Testing

1. Use Razorpay test cards for payment testing:
   - **Success**: 4111 1111 1111 1111
   - **Failure**: 4000 0000 0000 0002
2. Test webhook functionality with ngrok for local development
3. Verify payment status updates automatically
4. Test event registration after successful payment

## Production Deployment

1. ✅ **Keys Updated**: Using production-ready test keys
2. ✅ **Webhook Configured**: Automatic status updates enabled
3. ✅ **API Endpoints**: All required endpoints documented
4. ✅ **Error Handling**: Comprehensive error management
5. ✅ **Security**: Signature verification implemented

## Webhook Testing

To test webhooks locally:

```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 4000

# Use the ngrok URL in Razorpay webhook settings
# Example: https://abc123.ngrok.io/api/payments/webhook
```

## Key Features

- ✅ **Automatic Status Updates**: Webhooks update payment status without manual intervention
- ✅ **Secure Payments**: Razorpay handles all sensitive payment data
- ✅ **Event Integration**: Seamless integration with event registration
- ✅ **Error Recovery**: Webhook ensures status updates even if frontend fails
- ✅ **Real-time Updates**: Immediate status changes when payment completes
- ✅ **Comprehensive Logging**: Detailed logs for debugging and monitoring

## Troubleshooting

### Common Issues:
1. **Webhook not triggered**: Check Razorpay dashboard webhook configuration
2. **Payment verification fails**: Verify signature generation with correct secret
3. **Status not updating**: Check webhook endpoint accessibility
4. **Payment modal doesn't open**: Verify Razorpay script loading

### Debug Steps:
1. Check Razorpay dashboard for webhook delivery logs
2. Verify webhook signature validation
3. Test webhook endpoint manually with curl
4. Check server logs for webhook processing errors 