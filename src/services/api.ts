import axios from 'axios';
import { API_CONFIG } from '@project/config/api.config';
import { getCookie, deleteCookie } from '@project/utils/Cookie';

// Tạo instance axios cho public API
const publicApi = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout
});

// Tạo instance axios cho private API
const privateApi = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    withCredentials: true
});

// Request interceptor để tự động thêm token
privateApi.interceptors.request.use(
    (config) => {
        const token = getCookie('authToken');
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
privateApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token hết hạn, redirect về login
            deleteCookie('authToken');
            deleteCookie('authUser');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Interceptor cho publicApi để xử lý lỗi
publicApi.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export { publicApi, privateApi };
