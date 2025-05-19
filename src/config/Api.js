import axios from 'axios';
import { getToken, removeToken } from '../utils/auth.js';

const API_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor xử lý việc thêm token vào header
api.interceptors.request.use(
    (config) => {
        const token = getToken();

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// Interceptor xử lý refresh token khi token hết hạn
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Nếu là lỗi 401 Unauthorized và chưa thử refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.log('Token hết hạn, thử refresh token...');

                // Xử lý refresh token (nếu có API refresh token)
                // Ví dụ:
                // const refreshToken = localStorage.getItem('refreshToken');
                // const response = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
                // const { accessToken } = response.data;
                // localStorage.setItem('accessToken', accessToken);

                // Trong trường hợp đơn giản, chuyển hướng về trang đăng nhập
                console.log('Phiên đăng nhập hết hạn, chuyển về trang đăng nhập...');
                removeToken();
                window.location.href = 'http://localhost:5173/login';

                return Promise.reject(error);
            } catch (refreshError) {
                // Nếu refresh token cũng thất bại, đăng xuất người dùng
                console.error('Lỗi khi refresh token:', refreshError);
                removeToken();
                window.location.href = 'http://localhost:5173/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;