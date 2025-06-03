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
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Nếu là lỗi 429 (Too Many Requests), hiển thị thông báo rõ ràng
        if (error.response?.status === 429) {
            console.warn('Rate limit exceeded - Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.');
        }

        // Nếu là lỗi 401 Unauthorized và chưa thử refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.log('Token hết hạn, thử refresh token...');

                // Xử lý refresh token nếu cần
                // ...

                // Trong trường hợp không có refresh token hoặc không thể refresh
                console.log('Phiên đăng nhập hết hạn, chuyển về trang đăng nhập...');
                localStorage.removeItem('jwt');

                // Nếu đang ở trang seller thì chuyển về trang đăng nhập của customer
                if (window.location.href.includes('localhost:5174')) {
                    window.location.href = 'http://localhost:5173';
                }

                return Promise.reject(error);
            } catch (refreshError) {
                console.error('Lỗi khi refresh token:', refreshError);
                localStorage.removeItem('jwt');

                // Nếu đang ở trang seller thì chuyển về trang đăng nhập của customer
                if (window.location.href.includes('localhost:5174')) {
                    window.location.href = 'http://localhost:5173';
                }

                return Promise.reject(refreshError);
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