import { Navigate } from 'react-router-dom';

// URL để chuyển hướng về trang đăng nhập của customer
const CUSTOMER_LOGIN_URL = 'http://localhost:5173';

const PrivateRoute = ({ children }) => {
    // Kiểm tra token trực tiếp từ localStorage
    const token = localStorage.getItem('accessToken');

    if (!token) {
        console.log('Không tìm thấy token, chuyển hướng đến trang đăng nhập customer');
        // Thực hiện chuyển hướng thay vì sử dụng <Navigate>
        window.location.href = `${CUSTOMER_LOGIN_URL}`;
        return null; // Trả về null để không render gì khi đang chuyển hướng
    }

    return children;
};

export default PrivateRoute;