// src/components/layout/DashboardLayout.jsx (refactored)
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import "../../styles/layout/layout.css";
import useAuth from '../../hooks/useAuth';
import api from "../../config/Api.js";

function DashboardLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const { user, logout, loading } = useAuth();

    // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    const routes = [
        {
            href: "/dashboard",
            label: "Dashboard",
            icon: <LayoutDashboard className="icon" />,
        },
        {
            href: "/dashboard/products",
            label: "Quản lý sản phẩm",
            icon: <Package className="icon" />,
        },
        {
            href: "/dashboard/orders",
            label: "Quản lý đơn hàng",
            icon: <ShoppingCart className="icon" />,
        },
        {
            href: "/dashboard/profile",
            label: "Hồ sơ",
            icon: <User className="icon" />,
        },
    ];

    // Xử lý đăng xuất
    const handleLogout = async () => {
        try {
            // Gọi API logout
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
            // Tiếp tục xử lý ngay cả khi có lỗi
        } finally {
            // Xóa token và chuyển hướng bất kể kết quả API
            localStorage.removeItem('jwt');
            navigate('/login');

            // Nếu vẫn gặp vấn đề, có thể thử chuyển hướng đến trang chính
            setTimeout(() => {
                window.location.href = 'http://localhost:5173/login';
            }, 300);
        }
    };

    if (loading) {
        return <div className="loading-container">Đang tải...</div>;
    }

    return (
        <div className="dashboard-layout">
            {/* Desktop Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <Link to="/dashboard" className="logo-link">
                        <Package className="logo-icon" />
                        <span>TechShop</span>
                    </Link>
                </div>
                <nav className="sidebar-nav">
                    <ul className="nav-list">
                        {routes.map((route) => (
                            <li key={route.href}>
                                <Link to={route.href} className={`nav-link ${location.pathname === route.href ? "active" : ""}`}>
                                    {route.icon}
                                    {route.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="avatar">
                            {/* Sử dụng URL cố định từ Cloudinary thay vì dựa vào user.imageUrl */}
                            <img
                                src={user.imageUrl}
                                alt="Avatar"
                                className="avatar-image"
                                onError={(e) => {
                                    // If image fails to load, show fallback
                                    e.target.style.display = 'none';
                                    const fallbackEl = e.target.parentNode.querySelector('.avatar-fallback');
                                    if (fallbackEl) fallbackEl.style.display = 'flex';
                                }}
                            />
                            <div className="avatar-fallback" style={{ display: 'none' }}>
                                {user ? (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '') : 'TS'}
                            </div>
                        </div>
                        <div className="user-details">
                            <div className="user-name">
                                {user ? `${user.firstName || ''} ${user.lastName || ''}` : 'Người dùng'}
                            </div>
                            <div className="user-role">{user?.email || 'Email'}</div>  {/* Thay đổi role thành email */}
                        </div>
                        <button className="logout-button" onClick={handleLogout}>
                            <LogOut className="icon" />
                            <span className="sr-only">Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Navigation */}
            <div className={`mobile-nav ${isMobileNavOpen ? "open" : ""}`}>
                <div className="mobile-nav-overlay" onClick={() => setIsMobileNavOpen(false)}></div>
                <div className="mobile-nav-content">
                    <div className="sidebar-header mobile-header">
                        <Link to="/dashboard" className="logo-link">
                            <Package className="logo-icon" />
                            <span>TechShop</span>
                        </Link>
                        <button className="close-button" onClick={() => setIsMobileNavOpen(false)}>
                            <X className="icon" />
                        </button>
                    </div>
                    <nav className="sidebar-nav">
                        <ul className="nav-list">
                            {routes.map((route) => (
                                <li key={route.href}>
                                    <Link
                                        to={route.href}
                                        className={`nav-link ${location.pathname === route.href ? "active" : ""}`}
                                        onClick={() => setIsMobileNavOpen(false)}
                                    >
                                        {route.icon}
                                        {route.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="sidebar-footer">
                        <div className="user-info">
                            <div className="avatar">
                                <div className="avatar-fallback">
                                    {user ? (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '') : 'TS'}
                                </div>
                            </div>
                            <div className="user-details">
                                <div className="user-name">
                                    {user ? `${user.firstName || ''} ${user.lastName || ''}` : 'Người dùng'}
                                </div>
                                <div className="user-role">{user?.role || 'Seller'}</div>
                            </div>
                            <button className="logout-button" onClick={handleLogout}>
                                <LogOut className="icon" />
                                <span className="sr-only">Đăng xuất</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <button className="mobile-menu-button" onClick={() => setIsMobileNavOpen(true)}>
                <Menu className="icon" />
                <span className="sr-only">Mở menu</span>
            </button>

            {/* Main Content - đã bỏ phần header */}
            <main className="main-content">
                <div className="content-container">{children}</div>
            </main>
        </div>
    );
}

export default DashboardLayout;