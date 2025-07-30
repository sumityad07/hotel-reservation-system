// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://hotel-reservation-system-h3d2.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // This should now correctly get the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
 
    } else {
      console.log('--- AXIOS INTERCEPTOR LOG (No Token) ---');
      console.log('No token found in localStorage for outgoing request to:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ... (response interceptor if you have one) ...

export default axiosInstance;

