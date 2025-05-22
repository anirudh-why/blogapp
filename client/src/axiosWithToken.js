import axios from "axios";

// Create axios instance
const axiosWithToken = axios.create();

// Add request interceptor to add token to each request
axiosWithToken.interceptors.request.use(
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

export { axiosWithToken };