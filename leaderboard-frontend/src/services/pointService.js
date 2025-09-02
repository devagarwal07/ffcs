import axios from 'axios';

const API_URL = 'https://ieeeras-ffcs.onrender.com/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject({ error: 'No response from server. Please try again.' });
    } else {
      // Something happened in setting up the request
      return Promise.reject({ error: error.message });
    }
  }
);

// Points API
export const getLeaderboard = async () => {
  try {
    const response = await axiosInstance.get('/points/leaderboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

export const submitPointRequest = async (data) => {
  try {
    const response = await axiosInstance.post('/points/request', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting point request:', error);
    throw error;
  }
};

export const getMyRequests = async () => {
  try {
    const response = await axiosInstance.get('/points/requests');
    return response.data;
  } catch (error) {
    console.error('Error fetching user requests:', error);
    throw error;
  }
};

export const getAllRequests = async () => {
  try {
    const response = await axiosInstance.get('/points/all-requests');
    return response.data;
  } catch (error) {
    console.error('Error fetching all requests:', error);
    throw error;
  }
};

export const updateRequestStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(`/points/request/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating request status:', error);
    throw error;
  }
};

// Auth API
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};
