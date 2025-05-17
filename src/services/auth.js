import api from './api';

// Token handling
const getToken = () => localStorage.getItem('temple_token');
const setToken = (token) => localStorage.setItem('temple_token', token);
const removeToken = () => localStorage.removeItem('temple_token');

// User data handling
const getUser = () => {
  const userStr = localStorage.getItem('temple_user');
  return userStr ? JSON.parse(userStr) : null;
};
const setUser = (user) => localStorage.setItem('temple_user', JSON.stringify(user));
const removeUser = () => localStorage.removeItem('temple_user');

// Auth service
const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      setToken(response.data.token);
      setUser(response.data.user);
    }
    return response.data;
  },
  
  // Register an admin (requires admin secret key)
  registerAdmin: async (userData, adminSecretKey) => {
    const response = await api.post('/auth/register/admin', userData, {
      headers: {
        'admin-secret-key': adminSecretKey
      }
    });
    if (response.data.token) {
      setToken(response.data.token);
      setUser(response.data.user);
    }
    return response.data;
  },
  
  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      setToken(response.data.token);
      setUser(response.data.user);
    }
    return response.data;
  },
  
  // Logout user
  logout: () => {
    removeToken();
    removeUser();
  },
  
  // Get current user profile
  getProfile: async () => {
    const token = getToken();
    if (!token) return null;
    
    try {
      const response = await api.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // If token is invalid or expired, log the user out
        authService.logout();
      }
      throw error;
    }
  },
  
  // Check if user is logged in
  isLoggedIn: () => !!getToken(),
  
  // Check if user is admin
  isAdmin: () => {
    const user = getUser();
    return user && user.role === 'admin';
  },
  
  // Get current user
  getCurrentUser: () => getUser(),
  
  // Get auth header
  getAuthHeader: () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
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