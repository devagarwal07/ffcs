import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api/points',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getLeaderboard = async () => {
  try {
    const response = await axiosInstance.get('/leaderboard');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitPointRequest = async (data) => {
  try {
    const response = await axiosInstance.post('/request', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyRequests = async () => {
  try {
    const response = await axiosInstance.get('/requests');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllRequests = async () => {
  try {
    const response = await axiosInstance.get('/all-requests');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRequestStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(`/request/${id}`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};
