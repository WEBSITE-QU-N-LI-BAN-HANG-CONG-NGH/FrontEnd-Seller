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
        // Lấy token từ query string
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            // Lưu token vào localStorage của trang seller
            localStorage.setItem("jwt", token);

            // Xóa token khỏi URL để tránh lộ thông tin nhạy cảm
            window.history.replaceState({}, document.title, "/dashboard");
        }
    }, []);

    useEffect(() => {
        const checkSellerAuth = async () => {
            try {
                console.log('Bắt đầu kiểm tra xác thực seller');
                // Lấy token từ localStorage
                const token = localStorage.getItem('jwt');
                if (token) {
                    try {
                        const parts = token.split('.');
                        const payload = JSON.parse(atob(parts[1]));
                        console.log("JWT payload:", payload);
                        console.log("User roles:", payload.roles);
                    } catch (e) {
                        console.error("Không thể giải mã token:", e);
                    }
                }
                console.log('Token từ localStorage:', token ? 'Tồn tại' : 'Không tồn tại');

                if (!token) {
                    console.log('Không tìm thấy JWT, chuyển hướng tới trang customer để đăng nhập');
                    // Chuyển hướng tới trang đăng nhập ở customer app
                    redirectToCustomerLogin();
                    return;
                }

                // Dispatch action loginSuccess để cập nhật state với token đã có
                dispatch(loginSuccess(token));
                console.log('Đã dispatch loginSuccess với token');

                // Kiểm tra xem người dùng có phải seller không
                console.log('Gọi API kiểm tra vai trò seller');
                const response = await sellerService.verifySellerRole();
                console.log('Phản hồi từ API kiểm tra vai trò:', response);

                // Log chi tiết cấu trúc dữ liệu
                console.log('response.data:', response.data);
                console.log('response.data.data:', response.data.data);

                // Lấy dữ liệu từ nhiều cấu trúc có thể có
                const isSeller = (response.data.data && response.data.data.isSeller) ||
                    response.data.isSeller ||
                    (response.data.user && response.data.user.role === 'SELLER');

                console.log('Kết quả kiểm tra isSeller:', isSeller);

                if (!isSeller) {
                    console.error('Người dùng không có quyền seller');
                    alert('Bạn không có quyền truy cập trang quản lý');
                    // Chuyển hướng về ứng dụng customer
                    redirectToCustomerLogin();
                    return;
                }

                // Lấy thông tin người dùng
                console.log('Gọi getUser để lấy thông tin người dùng');
                await dispatch(getUser());
                console.log('Đã lấy thông tin người dùng thành công');
                setIsInitializing(false);
            } catch (error) {
                console.error('Lỗi xác thực seller:', error);
                // In chi tiết lỗi
                if (error.response) {
                    console.error('Lỗi response:', error.response.status, error.response.data);
                } else if (error.request) {
                    console.error('Không nhận được response:', error.request);
                } else {
                    console.error('Error message:', error.message);
                }
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
            // Thay vì chuyển hướng ngay, hiển thị thông báo xác nhận trước
            const shouldRedirect = confirm("Phát hiện lỗi xác thực. Bạn có muốn xem logs debug trước khi chuyển hướng về trang đăng nhập không?");

            if (!shouldRedirect) {
                console.log("Người dùng đã chọn ở lại để xem logs");
                // Hiển thị chi tiết lỗi
                document.body.innerHTML = `
            <div style="padding: 20px; font-family: monospace;">
                <h2>Debug Mode</h2>
                <p>Mở Console (F12) để xem logs chi tiết.</p>
                <button onclick="window.location.href='http://localhost:5173'">
                    Quay về trang đăng nhập
                </button>
            </div>
        `;
                return;
            }

            // Nếu chọn chuyển hướng
            console.log('Thực hiện chuyển hướng đến trang đăng nhập customer (5173)');
            window.location.href = 'http://localhost:5173';
        }

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