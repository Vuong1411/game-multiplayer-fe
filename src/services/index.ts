import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

// Tạo instance axios 
export const api = axios.create({
    baseURL: API_CONFIG.baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm interceptor để xử lý token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Xử lý lỗi
api.interceptors.response.use(
    response => response,
    error => {
        // Xử lý khi token không hợp lệ hoặc hết hạn (401, 403, etc..)
        if (error.response.status === 401) {
            // Xóa token khỏi localStorage
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);
