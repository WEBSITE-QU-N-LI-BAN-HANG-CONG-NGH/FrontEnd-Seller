import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor xử lý việc thêm token vào header
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
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
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Gọi API refresh token
                const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
                    withCredentials: true
                });
                const { accessToken } = response.data.data;
                localStorage.setItem('accessToken', accessToken);

                // Thử lại request ban đầu với token mới
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                // Nếu refresh token cũng hết hạn, đăng xuất người dùng
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;