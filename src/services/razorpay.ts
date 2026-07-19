import axios from "axios";

// Razorpay key ID from environment (never expose KEY_SECRET to frontend)
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

// API base path for payment endpoints
const API_URL = "http://test.api.nirnaysawant.in/api";

// Create an axios instance for payment API
const paymentApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token interceptor
paymentApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("temple_token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
paymentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Payment API Error:", error);
    return Promise.reject(error);
  }
);

// Payment service
export const razorpayService = {
  // Create Razorpay order on backend
  createOrder: async (amount: number, eventId: string, description?: string) => {
    const response = await paymentApi.post("/razorpay/create-order", {
      amount,
      eventId,
      description,
    });
    return response.data;
  },

  // Verify payment signature on backend
  verifyPayment: async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    paymentId: string
  ) => {
    const response = await paymentApi.post("/razorpay/verify-payment", {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentId,
    });
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (paymentId: string) => {
    const response = await paymentApi.get(`/razorpay/payment-status/${paymentId}`);
    return response.data;
  },

  // Get user's Razorpay payment history
  getMyPayments: async () => {
    const response = await paymentApi.get("/razorpay/my-payments");
    return response.data;
  },
};

// Razorpay checkout configuration
export const getRazorpayConfig = (options: {
  amount: number;
  orderId: string;
  description: string;
  prefill?: { name?: string; email?: string; contact?: string };
}) => ({
  key: RAZORPAY_KEY_ID,
  amount: options.amount,
  currency: "INR",
  name: "Shree Kalamba Devi Temple",
  description: options.description,
  image: "/logo192.png",
  order_id: options.orderId,
  prefill: options.prefill || {},
  notes: {
    address: "Shree Kalamba Devi Temple",
  },
  theme: {
    color: "#d35400",
  },
});

export default razorpayService;
