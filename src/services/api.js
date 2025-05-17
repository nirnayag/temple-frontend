import axios from 'axios';

// API base path for all endpoints - using relative URL which will work with proxy
const API_URL = '/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Devotee services
export const devoteeService = {
  getAll: () => api.get('/devotees'),
  getById: (id) => api.get(`/devotees/${id}`),
  create: (data) => api.post('/devotees', data),
  update: (id, data) => api.patch(`/devotees/${id}`, data),
  delete: (id) => api.delete(`/devotees/${id}`),
  addDonation: (id, data) => api.post(`/devotees/${id}/donations`, data)
};

// Event services
export const eventService = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.patch(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  register: (id) => api.post(`/events/${id}/register`)
};

export default api; 