// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../services/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Kiểm tra trạng thái đăng nhập khi component được mount
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
        try {
            const response = await axiosClient.post('/auth/login', {email, password});
            const {accessToken, user} = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            setUser(user);
            return user;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Đăng xuất
    const logout = async () => {
        try {
            await axiosClient.post('/auth/logout');
        } catch (error) {
            console.error('Lỗi đăng xuất:', error);
        } finally {
            localStorage.removeItem('accessToken');
            setUser(null);
            navigate('/login');
        }
    };
}