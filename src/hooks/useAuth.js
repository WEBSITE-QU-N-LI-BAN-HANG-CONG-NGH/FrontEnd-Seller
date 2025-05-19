// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { fetchWithRetry } from '../config/Api.js';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Kiểm tra JWT token có phải SELLER không
    const checkSellerFromToken = useCallback(() => {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) return false;

            const parts = token.split('.');
            if (parts.length !== 3) return false;

            const payload = JSON.parse(atob(parts[1]));

            // Kiểm tra vai trò từ payload
            if (payload.roles && Array.isArray(payload.roles)) {
                return payload.roles.includes('SELLER') || payload.roles.includes('ROLE_SELLER');
            }

            return payload.role === 'SELLER' || payload.role === 'ROLE_SELLER';
        } catch (e) {
            console.error('Lỗi khi phân tích JWT:', e);
            return false;
        }
    }, []);

    // Kiểm tra trạng thái đăng nhập khi hook được sử dụng
    useEffect(() => {
        const checkAuthStatus = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    setUser(null);
                    setLoading(false);
                    return;
                }

                // Kiểm tra nếu JWT có quyền SELLER
                const isSeller = checkSellerFromToken();

                if (isSeller) {
                    console.log('Xác thực vai trò qua JWT: SELLER');

                    // Tìm thông tin người dùng từ JWT để tạo object user
                    try {
                        const parts = token.split('.');
                        const payload = JSON.parse(atob(parts[1]));

                        // Tạo dữ liệu người dùng tối thiểu từ JWT payload
                        const userData = {
                            id: payload.id,
                            email: payload.sub,
                            firstName: payload.firstName || "",
                            lastName: payload.lastName || "",
                            role: "SELLER"
                        };

                        setUser(userData);
                        setLoading(false);
                        return;
                    } catch (err) {
                        console.warn('Không thể trích xuất thông tin người dùng từ JWT, sẽ gọi API');
                    }
                }

                // Nếu không lấy được từ JWT, gọi API profile
                try {
                    const response = await fetchWithRetry(api.get, '/users/profile');
                    setUser(response.data);
                } catch (profileError) {
                    console.error('Lỗi lấy profile:', profileError);

                    // Nếu lỗi 429, thử tạo user data tạm thời từ JWT
                    if (profileError.response?.status === 429 && isSeller) {
                        const parts = token.split('.');
                        const payload = JSON.parse(atob(parts[1]));

                        const userData = {
                            id: payload.id,
                            email: payload.sub,
                            firstName: payload.firstName || "",
                            lastName: payload.lastName || "",
                            role: "SELLER"
                        };

                        setUser(userData);
                        console.warn('Rate limit - Sử dụng thông tin tạm từ JWT');
                    } else {
                        throw profileError;
                    }
                }
            } catch (err) {
                console.error('Lỗi kiểm tra auth:', err);
                setError(err.response?.data?.message || 'Lỗi xác thực');
                localStorage.removeItem('jwt');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, [checkSellerFromToken]);

    // Đăng nhập
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { accessToken, user } = response.data.data;
            localStorage.setItem('jwt', accessToken);
            setUser(user);
            return user;
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Đăng xuất
    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Lỗi đăng xuất:', error);
        } finally {
            localStorage.removeItem('jwt');
            setUser(null);
            navigate('/login');
        }
    }, [navigate]);

    return { user, loading, error, login, logout };
};

export default useAuth;