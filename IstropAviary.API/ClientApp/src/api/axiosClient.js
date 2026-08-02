import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5010/api', // For local development. For production: import.meta.env.VITE_API_URL
});

// Add a request interceptor to attach the JWT token
axiosClient.interceptors.request.use(
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

export default axiosClient;
