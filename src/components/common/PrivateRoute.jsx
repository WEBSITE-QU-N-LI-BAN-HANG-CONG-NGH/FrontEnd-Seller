// src/components/common/PrivateRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ children }) => {
    const { auth } = useSelector(state => state);
    const location = useLocation();

    // Kiểm tra nếu đang loading
    if (auth.loading) {
        return <LoadingSpinner />;
    }

    // Kiểm tra nếu chưa đăng nhập hoặc không có token
    if (!auth.jwt) {
        // Chuyển hướng về customer app để đăng nhập
        window.location.href = `http://localhost:5173/login?redirect=${encodeURIComponent(window.location.href)}`;
        return null;
    }

    // Kiểm tra nếu không phải seller
    if (!auth.user?.roles?.includes('SELLER') && !auth.user?.isSeller) {
        // Chuyển hướng về customer app
        window.location.href = 'http://localhost:5173/';
        return null;
    }

    return children;
};

export default PrivateRoute;