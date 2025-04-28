import "../../styles/layout/layout.css"
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

function DashboardLayout({ children }) {
    const location = useLocation()
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

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
            href: "/dashboard/order",
            label: "Quản lý đơn hàng",
            icon: <ShoppingCart className="icon" />,
        },
        {
            href: "/dashboard/profile",
            label: "Hồ sơ",
            icon: <User className="icon" />,
        },
    ]

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
                            <img src="/placeholder.svg?height=40&width=40" alt="Avatar" />
                            <div className="avatar-fallback">TS</div>
                        </div>
                        <div className="user-details">
                            <div className="user-name">Seller</div>
                        </div>
                        <button className="logout-button">
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
                                <img src="/placeholder.svg?height=40&width=40" alt="Avatar" />
                                <div className="avatar-fallback">TS</div>
                            </div>
                            <div className="user-details">
                                <div className="user-name">Seller</div>
                            </div>
                            <button className="logout-button">
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
                            <img src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                            <div className="avatar-fallback">TS</div>
                        </div>
                    </div>
                </div>
                <div className="content-container">{children}</div>
            </main>
        </div>
    )
}

export default DashboardLayout
