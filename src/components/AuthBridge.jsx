// src/components/AuthBridge.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/Api.js';
import LoadingSpinner from './common/LoadingSpinner';

// Key thống nhất để lưu token giữa customer và seller
const TOKEN_KEY = 'jwt';

const AuthBridge = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log('Bắt đầu kiểm tra xác thực seller...');

                // Bước 1: Kiểm tra token từ URL (khi được redirect từ customer)
                const params = new URLSearchParams(window.location.search);
                const tokenFromUrl = params.get('token');

                if (tokenFromUrl) {
                    console.log('Đã nhận token từ URL, lưu vào localStorage');
                    localStorage.setItem(TOKEN_KEY, tokenFromUrl);
                    // Xóa token khỏi URL để tránh lộ thông tin nhạy cảm
                    window.history.replaceState({}, document.title, window.location.pathname);
                }

                // Bước 2: Kiểm tra token trong localStorage
                const token = localStorage.getItem(TOKEN_KEY);

                if (!token) {
                    console.log('Không tìm thấy token trong localStorage');
                    redirectToCustomerLogin();
                    return;
                }

                console.log('Đã tìm thấy token, kiểm tra tính hợp lệ...');

                // Phân tích token JWT để kiểm tra quyền seller
                if (token) {
                    try {
                        const parts = token.split('.');
                        if (parts.length === 3) {
                            const payload = JSON.parse(atob(parts[1]));
                            console.log('JWT payload:', payload);

                            // Kiểm tra trực tiếp payload có role SELLER không
                            if (payload.roles && Array.isArray(payload.roles) &&
                                payload.roles.includes("SELLER")) {
                                console.log('Token hợp lệ và có quyền SELLER');
                                setIsAuthChecking(false);
                                return; // Thoát sớm, không cần gọi API
                            }
                        }
                    } catch (e) {
                        console.error('Lỗi khi phân tích JWT:', e);
                    }
                }

                // Bước 3: Kiểm tra quyền seller qua API nếu JWT không đủ thông tin
                if (token) {
                    try {
                        // Đặt token vào header cho request
                        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                        console.log('Gọi API xác thực seller');
                        const response = await api.get('/seller/verify-role');
                        console.log('Phản hồi từ verify-role:', response.data);

                        // Kiểm tra xem có phải seller không
                        const isSeller = checkIfSeller(response.data);

                        if (!isSeller) {
                            setAuthError('Bạn không có quyền seller để truy cập trang quản lý');
                            redirectToCustomerLogin();
                            return;
                        }
                    } catch (error) {
                        console.error('Lỗi khi gọi API xác thực:', error);

                        // Nếu lỗi 429 (rate limit) thì xác thực trực tiếp từ JWT
                        if (error.response && error.response.status === 429) {
                            console.log('Bị rate limit, kiểm tra JWT trực tiếp');
                            const isSeller = isSellerFromToken(token);
                            console.log('Xác thực quyền seller từ JWT payload:', isSeller);

                            if (!isSeller) {
                                setAuthError('Bạn không có quyền seller để truy cập trang quản lý');
                                redirectToCustomerLogin();
                                return;
                            }
                        } else {
                            // Các lỗi khác
                            setAuthError('Đã xảy ra lỗi khi kiểm tra xác thực.');
                            redirectToCustomerLogin();
                            return;
                        }
                    }
                }

                setIsAuthChecking(false);

            } catch (error) {
                console.error('Lỗi kiểm tra xác thực:', error);
                setAuthError('Đã xảy ra lỗi khi kiểm tra xác thực.');
                setTimeout(() => redirectToCustomerLogin(), 3000);
            } finally {
                setIsAuthChecking(false);
            }
        };

        checkAuth();
    }, [navigate]);

    // Hàm kiểm tra từ response API có phải seller không
    const checkIfSeller = (responseData) => {
        return (responseData?.data?.isSeller) ||
            (responseData?.isSeller) ||
            (responseData?.role === 'SELLER') ||
            (responseData?.data?.role === 'SELLER') ||
            (Array.isArray(responseData?.roles) && responseData.roles.includes('SELLER')) ||
            (Array.isArray(responseData?.data?.roles) && responseData.data.roles.includes('SELLER'));
    };

    // Hàm kiểm tra quyền seller từ JWT payload
    const isSellerFromToken = (token) => {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return false;

            const payload = JSON.parse(atob(parts[1]));

            // Kiểm tra vai trò từ payload
            if (payload.roles && Array.isArray(payload.roles)) {
                return payload.roles.includes('SELLER') || payload.roles.includes('ROLE_SELLER');
            }

            // Trường hợp role là string
            return payload.role === 'SELLER' || payload.role === 'ROLE_SELLER';
        } catch (e) {
            console.error('Lỗi khi phân tích JWT:', e);
            return false;
        }
    };

    // Hàm chuyển hướng về trang đăng nhập của customer
    const redirectToCustomerLogin = () => {
        console.log('Chuyển hướng đến: http://localhost:5173/login');
        window.location.href = 'http://localhost:5173/login?redirect=seller';
    };

    if (isAuthChecking) {
        return <LoadingSpinner />;
    }

    if (authError) {
        return (
            <div className="auth-error-container">
                <div className="auth-error">
                    <h2>Thông báo xác thực</h2>
                    <p>{authError}</p>
                    <p>Đang chuyển hướng về trang đăng nhập...</p>
                </div>
            </div>
        );
    }

    return children;
};

export default AuthBridge;