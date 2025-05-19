import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/Api.js';
import LoadingSpinner from './common/LoadingSpinner';

// Key thống nhất để lưu token giữa customer và seller
const TOKEN_KEY = 'accessToken';
// URL để chuyển hướng về trang đăng nhập của customer
const CUSTOMER_LOGIN_URL = 'http://localhost:5173/login';

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

                // Bước 3: Kiểm tra quyền seller
                try {
                    // Đặt token vào header cho request
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    // Gọi API xác thực seller
                    const response = await api.get('/seller/verify-role');
                    console.log('Kết quả xác thực role seller:', response.data);

                    const isSeller = response.data?.data?.isSeller ||
                        response.data?.isSeller ||
                        (response.data?.role === 'SELLER');

                    if (!isSeller) {
                        console.error('Người dùng không có quyền seller');
                        setAuthError('Bạn không có quyền truy cập trang quản lý seller');
                        setTimeout(() => redirectToCustomerLogin(), 3000);
                        return;
                    }

                    console.log('Xác thực seller thành công');

                } catch (error) {
                    console.error('Lỗi khi kiểm tra quyền seller:', error);

                    // Nếu lỗi 401/403, token không hợp lệ
                    if (error.response?.status === 401 || error.response?.status === 403) {
                        console.log('Token không hợp lệ hoặc hết hạn');
                        localStorage.removeItem(TOKEN_KEY);
                        setAuthError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                        setTimeout(() => redirectToCustomerLogin(), 3000);
                        return;
                    }

                    // Dùng phương pháp dự phòng: Kiểm tra token JWT trực tiếp
                    if (isSellerFromToken(token)) {
                        console.log('Xác thực quyền seller từ JWT payload');
                    } else {
                        console.error('Không thể xác thực quyền seller');
                        setAuthError('Không thể xác thực quyền seller. Vui lòng đăng nhập lại.');
                        setTimeout(() => redirectToCustomerLogin(), 3000);
                        return;
                    }
                }

                // Nếu mọi thứ OK, hoàn tất quá trình kiểm tra
                setIsAuthChecking(false);

            } catch (error) {
                console.error('Lỗi kiểm tra xác thực:', error);
                setAuthError('Đã xảy ra lỗi khi kiểm tra xác thực.');
                setTimeout(() => redirectToCustomerLogin(), 3000);
            }
        };

        checkAuth();
    }, [navigate]);

    // Hàm kiểm tra quyền seller từ JWT payload
    const isSellerFromToken = (token) => {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return false;

            const payload = JSON.parse(atob(parts[1]));
            console.log('JWT payload:', payload);

            // Kiểm tra vai trò từ payload
            const roles = payload.roles || payload.authorities || [];
            if (Array.isArray(roles)) {
                return roles.includes('SELLER') || roles.includes('ROLE_SELLER');
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
        console.log(`Chuyển hướng đến: ${CUSTOMER_LOGIN_URL}`);
        // Thêm tham số để customer app biết đây là redirect từ seller app
        window.location.href = `${CUSTOMER_LOGIN_URL}?redirect=seller`;
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