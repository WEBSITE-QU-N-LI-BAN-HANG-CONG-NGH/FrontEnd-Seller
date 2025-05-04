// src/components/layout/DashboardLayout.jsx
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, User, LogOut, Menu } from 'lucide-react';
import "../../styles/layout/layout.css";
import useAuth from '../../hooks/useAuth';

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
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
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
                            <img
                                src={user?.imageUrl || "/placeholder.svg?height=40&width=40"}
                                alt="Avatar"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    document.querySelector('.avatar-fallback').style.display = 'flex';
                                }}
                            />
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
            </aside>

            {/* Mobile Navigation */}
            <div className={`mobile-nav ${isMobileNavOpen ? "open" : ""}`}>
                <div className="mobile-nav-overlay" onClick={() => setIsMobileNavOpen(false)}></div>
                <div className="mobile-nav-content">
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
                                <img
                                    src={user?.imageUrl || "/placeholder.svg?height=40&width=40"}
                                    alt="Avatar"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        document.querySelector('.mobile-avatar-fallback').style.display = 'flex';
                                    }}
                                />
                                <div className="avatar-fallback mobile-avatar-fallback">
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

            {/* Main Content */}
            <main className="main-content">
                <div className="main-header">
                    <div className="header-actions">
                        <div className="avatar small">
                            <img
                                src={user?.imageUrl || "/placeholder.svg?height=32&width=32"}
                                alt="Avatar"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    document.querySelector('.header-avatar-fallback').style.display = 'flex';
                                }}
                            />
                            <div className="avatar-fallback header-avatar-fallback">
                                {user ? (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '') : 'TS'}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-container">{children}</div>
            </main>
        </div>
    );
}

export default DashboardLayout;