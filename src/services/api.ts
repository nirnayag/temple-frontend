import axios from 'axios';

// API base path for all endpoints
const API_URL = 'http://localhost:4000/api';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Enable sending cookies
});

// Add a response interceptor
api.interceptors.response.use(
  response => response, 
  error => {
    console.error('API Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Response Error:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Request Error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Devotee services
export const devoteeService = {
  getAll: () => api.get('/devotees'),
  getById: (id: string) => api.get(`/devotees/${id}`),
  create: (data: any) => api.post('/devotees', data),
  update: (id: string, data: any) => api.patch(`/devotees/${id}`, data),
  delete: (id: string) => api.delete(`/devotees/${id}`),
  addDonation: (id: string, data: any) => api.post(`/devotees/${id}/donations`, data)
};

// Event services
export const eventService = {
  getAll: () => api.get('/events'),
  getUpcoming: () => api.get('/events/upcoming'),
  getById: (id: string) => api.get(`/events/${id}`),
  create: (data: any) => api.post('/events', data),
  update: (id: string, data: any) => api.patch(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
  register: (id: string) => api.post(`/events/${id}/register`)
};

// Announcement services
export const announcementService = {
  getAll: () => api.get('/announcements'),
  getById: (id: string) => api.get(`/announcements/${id}`),
  create: (data: any) => api.post('/announcements', data),
  update: (id: string, data: any) => api.patch(`/announcements/${id}`, data),
  delete: (id: string) => api.delete(`/announcements/${id}`)
};

// Prasadam services
export const prasadamService = {
  getAll: () => api.get('/prasadam'),
  getByDay: (day: string) => api.get(`/prasadam/day/${day}`),
  getInfo: () => api.get('/prasadam/info'),
  create: (data: any) => api.post('/prasadam', data),
  update: (id: string, data: any) => api.patch(`/prasadam/${id}`, data),
  delete: (id: string) => api.delete(`/prasadam/${id}`)
};

// Temple information services
export const templeService = {
  getInfo: () => api.get('/temple'),
  getFeatures: () => api.get('/temple/features'),
  getSections: () => api.get('/temple/sections'),
  update: (data: any) => api.post('/temple/info', data)
};

// Puja services
export const pujaService = {
  getAll: () => api.get('/pujas'),
  getUpcoming: () => api.get('/pujas/upcoming'),
  getById: (id: string) => api.get(`/pujas/${id}`),
  create: (data: any) => api.post('/pujas', data),
  update: (id: string, data: any) => api.patch(`/pujas/${id}`, data),
  delete: (id: string) => api.delete(`/pujas/${id}`),
  book: (data: any) => api.post('/pujas/book', data),
  getBookings: () => api.get('/pujas/bookings'),
  cancelBooking: (id: string) => api.delete(`/pujas/bookings/${id}`)
};

export default api; 