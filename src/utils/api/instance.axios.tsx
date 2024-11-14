import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // Set your base URL here
    timeout: 10000, // Set a request timeout
});

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Global error handling (e.g., redirect on 401 or 403 errors)
        if (error.response?.status === 401) {
            console.error('Unauthorized access detected.');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;