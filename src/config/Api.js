// src/config/Api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

// Tạo một instance axios với các cấu hình mặc định
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Thêm timeout để tránh request treo quá lâu
    timeout: 10000,
});

// Interceptor xử lý việc thêm token vào header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor xử lý response
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
            error.config._retry = true;

            // Remove correct token key
            localStorage.removeItem('jwt'); // Not 'accessToken'

            if (window.location.href.includes('localhost:5174')) {
                window.location.href = 'http://localhost:5173';
            }
        }
        return Promise.reject(error);
    }
);

// Thêm một simple retry mechanism cho lỗi 429
export const fetchWithRetry = async (apiMethod, ...args) => {
    try {
        return await apiMethod(...args);
    } catch (error) {
        if (error.response?.status === 429) {
            console.log('Rate limit exceeded, retrying after 2 seconds...');

            // Đợi 2 giây rồi thử lại
            await new Promise(resolve => setTimeout(resolve, 2000));
            return apiMethod(...args);
        }
        throw error;
    }
};

export default api;