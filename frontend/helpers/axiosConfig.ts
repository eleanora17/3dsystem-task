// src/axiosConfig.ts
import axios, { AxiosResponse } from 'axios';

// Create an instance of axios with default settings
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Set the base URL for all requests
  timeout: 10000, // Set a timeout limit for requests (optional)
  headers: {
    'Content-Type': 'application/json', // Set default headers (optional)
  },
});

// Optional: Add response interceptors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle errors globally, for example, log out on 401 error
    if (error.response && error.response.status === 401) {
      // Redirect to login or show a message
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
