// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../services/axiosClient';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Kiểm tra trạng thái đăng nhập khi hook được sử dụng
    useEffect(() => {
        const checkAuthStatus = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    setUser(null);
                    setLoading(false);
                    return;
                }

                const response = await axiosClient.get('/users/profile');
                setUser(response.data);
            } catch (err) {
                console.error('Lỗi kiểm tra auth:', err);
                setError(err.response?.data?.message || 'Lỗi xác thực');
                localStorage.removeItem('accessToken');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    // Đăng nhập
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosClient.post('/auth/login', { email, password });
            const { accessToken, user } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
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
            await axiosClient.post('/auth/logout');
        } catch (error) {
            console.error('Lỗi đăng xuất:', error);
        } finally {
            localStorage.removeItem('accessToken');
            setUser(null);
            navigate('/login');
        }
    }, [navigate]);

    return { user, loading, error, login, logout };
};

export default useAuth;