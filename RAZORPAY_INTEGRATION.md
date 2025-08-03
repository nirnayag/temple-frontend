# Razorpay Integration for Temple Management System

## Overview
This document outlines the Razorpay payment integration for the Temple Management System frontend. The integration allows users to register for events with secure online payments.

## Frontend Implementation

### 1. Installed Dependencies
- `razorpay`: Razorpay JavaScript SDK

### 2. Key Components

#### Razorpay Service (`src/services/razorpay.ts`)
- Handles API communication with backend
- Manages payment order creation, verification, and status updates
- Configured with test keys for development

#### Payment Components
- `RazorpayPayment.tsx`: Main payment dialog with user details form
- `PaymentSuccess.tsx`: Success confirmation dialog
- Integrated into `EventDetail.tsx` for event registration

### 3. Configuration
- **Test Keys**: 
  - Key ID: `rzp_test_E9LEIWSCMKLygJ`
  - Key Secret: `xfTNEoWz8EKEKoijNYjjkhFH`
- **API Base URL**: `http://localhost:4000/api`

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

### 3. Update Payment Status
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

## Payment Flow

1. **User clicks "Register Now"** on an event
2. **Backend creates payment record** via `POST /payments` (status: pending)
3. **Payment dialog opens** with user details form
4. **User fills details** and clicks "Pay"
5. **Backend creates Razorpay order** via `/payments/create-order`
6. **Razorpay modal opens** with payment options
7. **User completes payment** on Razorpay gateway
8. **Payment verification** via `/payments/verify`
9. **Payment status updated** to "completed" via `/payments/{id}/status`
10. **Event registration** via existing `/events/{id}/register`
11. **Success dialog** shows payment confirmation

## Security Considerations

1. **Payment Verification**: All payments are verified using Razorpay's signature verification
2. **Server-side Processing**: Sensitive operations (order creation, verification) happen on backend
3. **Test Environment**: Currently using test keys for development
4. **Error Handling**: Comprehensive error handling for payment failures

## Environment Variables

For production, update the following in `src/services/razorpay.ts`:

```typescript
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.REACT_APP_RAZORPAY_KEY_SECRET;
```

## Testing

1. Use Razorpay test cards for payment testing
2. Test payment failure scenarios
3. Verify payment status updates
4. Test event registration after successful payment

## Production Deployment

1. Replace test keys with production keys
2. Update API base URL to production endpoint
3. Configure proper error handling and logging
4. Implement webhook handling for payment notifications
5. Add payment analytics and reporting

## Troubleshooting

### Common Issues:
1. **Payment verification fails**: Check signature generation on backend
2. **Order creation fails**: Verify Razorpay credentials
3. **Modal doesn't open**: Check Razorpay script loading
4. **TypeScript errors**: Ensure types are properly declared

### Debug Steps:
1. Check browser console for JavaScript errors
2. Verify API endpoints are accessible
3. Confirm Razorpay script is loaded
4. Test with Razorpay's test mode first 