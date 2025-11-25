// services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://b0c8690b82bb.ngrok-free.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include tokens if needed
api.interceptors.request.use(
  (config) => {
    // You can add token here later when you implement token storage
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;