// src/components/AppInitializer.jsx
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess, getUser } from '../State/Auth/Action';
import sellerService from '../services/sellerService';
import LoadingSpinner from './common/LoadingSpinner';

const AppInitializer = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isInitializing, setIsInitializing] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkSellerAuth = async () => {
            try {
                // Lấy token từ localStorage
                const token = localStorage.getItem('jwt');

                if (!token) {
                    console.log('Không tìm thấy JWT, chuyển hướng tới trang customer để đăng nhập');
                    // Chuyển hướng tới trang đăng nhập ở customer app
                    redirectToCustomerLogin();
                    return;
                }

                // Dispatch action loginSuccess để cập nhật state với token đã có
                dispatch(loginSuccess(token));

                // Kiểm tra xem người dùng có phải seller không
                const response = await sellerService.verifySellerRole();
                const { isSeller } = response.data.data || response.data;

                if (!isSeller) {
                    console.error('Người dùng không có quyền seller');
                    alert('Bạn không có quyền truy cập trang quản lý');
                    // Chuyển hướng về ứng dụng customer
                    redirectToCustomer();
                    return;
                }

                // Lấy thông tin người dùng
                await dispatch(getUser());
                setIsInitializing(false);
            } catch (error) {
                console.error('Lỗi xác thực seller:', error);
                setError('Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
                // Xóa token nếu có lỗi xác thực
                localStorage.removeItem('jwt');
                // Chuyển hướng tới trang đăng nhập ở customer app
                setTimeout(() => {
                    redirectToCustomerLogin();
                }, 3000);
            } finally {
                setIsInitializing(false);
            }
        };
        const redirectToCustomerLogin = () => {
            window.location.href = 'http://localhost:5173';
        };
        const redirectToCustomer = () => {
            window.location.href = 'http://localhost:5173';
        };

        checkSellerAuth();
    }, [dispatch, navigate]);

    if (isInitializing) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="auth-error-container">
                <div className="auth-error">
                    <h2>Lỗi xác thực</h2>
                    <p>{error}</p>
                    <p>Đang chuyển hướng về trang chính...</p>
                </div>
            </div>
        );
    }

    return children;
};

export default AppInitializer;