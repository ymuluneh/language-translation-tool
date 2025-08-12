
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle different HTTP status codes
      switch (error.response.status) {
        case 404:
          error.message = "Resource not found";
          break;
        case 500:
          error.message = "Server error";
          break;
        // Add more cases as needed
      }
    }
    return Promise.reject(error);
  }
);

export default api;