import api from "./api";
import axios, { AxiosError } from "axios";

interface User {
  _id: string;
  username?: string;
  email?: string;
  mobileNumber: string;
  role: string;
}

interface AuthResponse {
  token: string;
  user: User;
  message?: string;
  isNewUser?: boolean;
  requiresRegistration?: boolean;
}

interface OTPRequestResponse {
  message: string;
  userExists: boolean;
}

interface UserRegistrationData {
  name: string;
  email?: string;
  username?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

// Create a custom event for auth state changes
const AUTH_STATE_CHANGE_EVENT = "auth_state_change";

// Function to dispatch auth change event
const dispatchAuthEvent = (isAuthenticated: boolean) => {
  const event = new CustomEvent(AUTH_STATE_CHANGE_EVENT, {
    detail: { isAuthenticated },
  });
  window.dispatchEvent(event);
};

// Token handling
const getToken = (): string | null => localStorage.getItem("temple_token");
const setToken = (token: string): void => {
  localStorage.setItem("temple_token", token);
  dispatchAuthEvent(true);
};
const removeToken = (): void => {
  localStorage.removeItem("temple_token");
  dispatchAuthEvent(false);
};

// User data handling
const getUser = (): User | null => {
  const userStr = localStorage.getItem("temple_user");
  return userStr ? JSON.parse(userStr) : null;
};
const setUser = (user: User): void =>
  localStorage.setItem("temple_user", JSON.stringify(user));
const removeUser = (): void => localStorage.removeItem("temple_user");

// Auth service
const authService = {
  // Request OTP
  requestOTP: async (mobileNumber: string): Promise<OTPRequestResponse> => {
    const response = await api.post<OTPRequestResponse>(
      "/otp-auth/request-otp",
      { mobileNumber }
    );
    return response.data;
  },

  // Verify OTP - for existing users
  verifyOTP: async (
    mobileNumber: string,
    otp: string
  ): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/otp-auth/verify-otp", {
      mobileNumber,
      otp,
    });
    if (response.data.token) {
      setToken(response.data.token);
      setUser(response.data.user);
    }
    return response.data;
  },

  // Verify OTP and register - for new users
  verifyOTPAndRegister: async (
    mobileNumber: string,
    otp: string,
    userData: UserRegistrationData
  ): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/otp-auth/verify-otp", {
      mobileNumber,
      otp,
      userData,
    });
    if (response.data.token) {
      setToken(response.data.token);
      setUser(response.data.user);
    }
    return response.data;
  },

  // Register an admin (requires admin secret key)
  registerAdmin: async (
    userData: {
      name: string;
      email?: string;
      mobileNumber: string;
      username?: string;
      address?: string;
    },
    adminSecretKey: string
  ): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      "/auth/register/admin",
      userData,
      {
        headers: {
          "admin-secret-key": adminSecretKey,
        },
      }
    );
    if (response.data.token) {
      setToken(response.data.token);
      setUser(response.data.user);
    }
    return response.data;
  },

  // Legacy methods - redirect to OTP auth
  register: async (): Promise<never> => {
    throw new Error(
      "Traditional registration is not supported. Please use OTP authentication."
    );
  },

  login: async (): Promise<never> => {
    throw new Error(
      "Traditional login is not supported. Please use OTP authentication."
    );
  },

  // Logout user
  logout: (redirect: boolean = true): void => {
    removeToken();
    removeUser();

    // Optionally redirect to home page after logout
    if (redirect) {
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    }
  },

  // Get current user profile
  getProfile: async (): Promise<User | null> => {
    const token = getToken();
    if (!token) return null;

    try {
      const response = await api.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      // @ts-ignore
      const axiosError = error as AxiosError;

      if (
        axiosError.response &&
        (axiosError.response.status === 401 ||
          axiosError.response.status === 403)
      ) {
        // If token is invalid or expired, log the user out
        authService.logout();
      }
      throw error;
    }
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => !!getToken(),

  // Check if user is admin
  isAdmin: (): boolean => {
    const user = getUser();
    return user ? user.role === "admin" : false;
  },

  // Get current user
  getCurrentUser: (): User | null => getUser(),

  // Get auth header
  getAuthHeader: (): Record<string, string> => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

// Update API instance to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default authService;
