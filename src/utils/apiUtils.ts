import axios, { AxiosError, AxiosResponse } from "axios";
import {
  translateApiResponse as translateResponse,
  formatApiError,
  formatApiSuccess,
  translateApiData,
} from "./translationUtils";

const API_BASE_URL = "temple-backed-production.up.railway.app";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Generic API request function with translation
export const apiRequest = async <T>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any
): Promise<T> => {
  try {
    const response = await api[method](url, data);
    // Translate the response data for display
    const translatedData = await translateApiData(response.data);
    return translatedData as T;
  } catch (error) {
    const translatedError = await formatApiError(error);
    throw new Error(translatedError);
  }
};

// API error handler with translation
export const handleApiError = async (error: any): Promise<string> => {
  return await formatApiError(error);
};

// API success handler with translation
export const handleApiSuccess = async (response: any): Promise<string> => {
  return await formatApiSuccess(response);
};

// API response translator for display
export const translateApiResponse = async (response: any): Promise<any> => {
  return await translateApiData(response);
};

export default {
  api,
  apiRequest,
  handleApiError,
  handleApiSuccess,
  translateApiResponse,
};
