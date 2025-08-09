import axios from "axios";

// Razorpay configuration
const RAZORPAY_KEY_ID = "rzp_test_dZohG3RPiLcurf";
const RAZORPAY_KEY_SECRET = "ngHtEFjcnJZTKcFWt8T72Y3d";

// API base path for payment endpoints
const API_URL = "https://api.shreekalambadevi.org/api";

// Create an axios instance for payment API
const paymentApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a response interceptor
paymentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Payment API Error:", error);
    if (error.response) {
      console.error("Payment API Response Error:", error.response.data);
      console.error("Status:", error.response.status);
    } else if (error.request) {
      console.error("Payment API Request Error:", error.request);
    } else {
      console.error("Payment API Setup Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Payment service
export const razorpayService = {
  // Create payment order
  createOrder: async (amount: number, currency: string = "INR", receipt: string) => {
    try {
      const response = await paymentApi.post("/payments/create-order", {
        amount: amount * 100, // Convert to paise
        currency,
        receipt,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating payment order:", error);
      throw error;
    }
  },

  // Verify payment signature
  verifyPayment: async (paymentId: string, orderId: string, signature: string) => {
    try {
      const response = await paymentApi.post("/payments/verify", {
        paymentId,
        orderId,
        signature,
      });
      return response.data;
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  },

  // Update payment status
  updatePaymentStatus: async (paymentId: string, status: string, eventId?: string) => {
    try {
      const response = await paymentApi.patch(`/payments/${paymentId}/status`, {
        status,
        eventId,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  },

  // Get payment details
  getPaymentDetails: async (paymentId: string) => {
    try {
      const response = await paymentApi.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting payment details:", error);
      throw error;
    }
  },

  // Webhook handler for payment status updates
  handleWebhook: async (webhookData: any) => {
    try {
      const response = await paymentApi.post("/payments/webhook", webhookData);
      return response.data;
    } catch (error) {
      console.error("Error handling webhook:", error);
      throw error;
    }
  },
};

// Razorpay configuration for frontend
export const razorpayConfig = {
  key: RAZORPAY_KEY_ID,
  currency: "INR",
  name: "Shree Kalamba Devi Temple",
  description: "Event Registration Payment",
  image: "/logo192.png", // You can update this to your temple logo
  prefill: {
    name: "",
    email: "",
    contact: "",
  },
  notes: {
    address: "Shree Kalamba Devi Temple Address",
  },
  theme: {
    color: "#d35400", // Orange color matching your theme
  },
};

export default razorpayService;
