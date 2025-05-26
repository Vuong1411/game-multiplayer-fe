import axios from 'axios';
import { API_CONFIG } from '@project/config/api.config';

// Tạo instance axios 
const api = axios.create({
    baseURL: API_CONFIG.baseURL,
});

// Request interceptor để tự động thêm token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor để xử lý token hết hạn
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token hết hạn, redirect về login
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export { api };
