import axios from "axios";

// Razorpay configuration
const RAZORPAY_KEY_ID = "rzp_test_E9LEIWSCMKLygJ";
const RAZORPAY_KEY_SECRET = "xfTNEoWz8EKEKoijNYjjkhFH";

// API base path for payment endpoints
const API_URL = "http://localhost:4000/api";
// "https://api.shreekalambadevi.org/api";

// Create an axios instance for payment API
const paymentApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
paymentApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
  createOrder: async (
    amount: number,
    eventId: string,
    description?: string
  ) => {
    try {
      const response = await paymentApi.post("/razorpay/create-order", {
        amount: amount,
        eventId: eventId,
        description: description,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating payment order:", error);
      throw error;
    }
  },

  // Verify payment signature
  verifyPayment: async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    paymentId: string
  ) => {
    try {
      const response = await paymentApi.post("/razorpay/verify-payment", {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        paymentId,
      });
      return response.data;
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  },

  // Get payment status
  getPaymentStatus: async (paymentId: string) => {
    try {
      const response = await paymentApi.get(
        `/razorpay/payment-status/${paymentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting payment status:", error);
      throw error;
    }
  },

  // Get user's payment history
  getMyPayments: async () => {
    try {
      const response = await paymentApi.get("/razorpay/my-payments");
      return response.data;
    } catch (error) {
      console.error("Error getting payment history:", error);
      throw error;
    }
  },
};

// Razorpay configuration for frontend
export const razorpayConfig = {
  key: RAZORPAY_KEY_ID,
  currency: "INR",
  name: "Temple Management System",
  description: "Event Registration Payment",
  image: "/logo192.png", // You can update this to your temple logo
  prefill: {
    name: "",
    email: "",
    contact: "",
  },
  notes: {
    address: "Temple Address",
  },
  theme: {
    color: "#d35400", // Orange color matching your theme
  },
};

export default razorpayService;
