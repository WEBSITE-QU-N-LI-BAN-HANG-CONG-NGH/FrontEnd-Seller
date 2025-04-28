"use client"

import { useState } from "react"
import {
    Package,
    ShoppingCart,
    Users,
    ArrowUp,
    ArrowDown,
    DollarSign,
    Calendar,
    Zap,
    Percent,
    CreditCard,
    RefreshCcw,
    UserPlus,
    UserCheck,
} from "lucide-react"
import "../../styles/dashboard/dashboard.css"
function Dashboard() {
    const [selectedMonth, setSelectedMonth] = useState("Tháng 3, 2023")
    const [activeTab, setActiveTab] = useState("overview")

    // Dữ liệu mẫu cho biểu đồ doanh thu theo tháng
    const monthlyRevenue = [
        { month: "T1", amount: 65000000 },
        { month: "T2", amount: 72000000 },
        { month: "T3", amount: 120500000 },
        { month: "T4", amount: 85000000 },
        { month: "T5", amount: 90000000 },
        { month: "T6", amount: 110000000 },
        { month: "T7", amount: 95000000 },
        { month: "T8", amount: 105000000 },
        { month: "T9", amount: 115000000 },
        { month: "T10", amount: 0 },
        { month: "T11", amount: 0 },
        { month: "T12", amount: 0 },
    ]

    // Dữ liệu mẫu cho phân tích chi tiết
    const analyticsData = [
        {
            metric: "Tỷ lệ chuyển đổi",
            value: "12.5%",
            change: "+4%",
            status: "increase",
            icon: <Percent className="icon-small" />,
            color: "blue",
        },
        {
            metric: "Giá trị đơn hàng trung bình",
            value: "2.150.000 ₫",
            change: "+8%",
            status: "increase",
            icon: <CreditCard className="icon-small" />,
            color: "purple",
        },
        {
            metric: "Tỷ lệ hoàn trả",
            value: "2.3%",
            change: "-0.5%",
            status: "decrease",
            icon: <RefreshCcw className="icon-small" />,
            color: "amber",
        },
        {
            metric: "Tỷ lệ hủy đơn hàng",
            value: "4.2%",
            change: "+1.1%",
            status: "increase",
            icon: <ShoppingCart className="icon-small" />,
            color: "red",
        },
        {
            metric: "Khách hàng mới",
            value: "1,245",
            change: "+15%",
            status: "increase",
            icon: <UserPlus className="icon-small" />,
            color: "green",
        },
        {
            metric: "Khách hàng quay lại",
            value: "1,105",
            change: "+22%",
            status: "increase",
            icon: <UserCheck className="icon-small" />,
            color: "indigo",
        },
    ]

    // Dữ liệu mẫu cho doanh thu theo sản phẩm
    const productRevenue = [
        {
            id: "PROD-1",
            name: "Laptop Gaming Asus ROG Strix G15",
            category: "Laptop",
            sold: 32,
            revenue: 831680000,
            percentOfTotal: 28,
            color: "blue",
        },
        {
            id: "PROD-2",
            name: "Điện thoại iPhone 14 Pro Max",
            category: "Điện thoại",
            sold: 45,
            revenue: 1349550000,
            percentOfTotal: 45,
            color: "primary",
        },
        {
            id: "PROD-3",
            name: "Tai nghe Bluetooth Apple AirPods Pro",
            category: "Phụ kiện",
            sold: 78,
            revenue: 389220000,
            percentOfTotal: 13,
            color: "green",
        },
        {
            id: "PROD-4",
            name: 'Màn hình Gaming LG UltraGear 27"',
            category: "Màn hình",
            sold: 25,
            revenue: 224750000,
            percentOfTotal: 8,
            color: "amber",
        },
        {
            id: "PROD-5",
            name: "Bàn phím cơ Logitech G Pro X",
            category: "Phụ kiện",
            sold: 62,
            revenue: 185380000,
            percentOfTotal: 6,
            color: "orange",
        },
    ]

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div className="header-info">
                    <h1 className="page-title gradient-text">Dashboard</h1>
                    <p className="page-description">Xem tổng quan về cửa hàng của bạn</p>
                </div>
                <div className="header-actions">
                    <div className="month-selector">
                        <Calendar className="icon-small" />
                        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="month-select">
                            <option value="Tháng 1, 2023">Tháng 1, 2023</option>
                            <option value="Tháng 2, 2023">Tháng 2, 2023</option>
                            <option value="Tháng 3, 2023">Tháng 3, 2023</option>
                        </select>
                    </div>
                    <button className="button icon-only outline">
                        <RefreshCcw className="icon-small" />
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card primary">
                    <div className="stat-header">
                        <h3 className="stat-title">Tổng doanh thu</h3>
                        <div className="stat-icon">
                            <DollarSign className="icon-small" />
                        </div>
                    </div>
                    <div className="stat-value">120.500.000 ₫</div>
                    <div className="stat-change positive">
                        <ArrowUp className="icon-tiny" />
                        <span>20% so với tháng trước</span>
                    </div>
                </div>

                <div className="stat-card blue">
                    <div className="stat-header">
                        <h3 className="stat-title">Đơn hàng</h3>
                        <div className="stat-icon">
                            <ShoppingCart className="icon-small" />
                        </div>
                    </div>
                    <div className="stat-value">+573</div>
                    <div className="stat-change positive">
                        <ArrowUp className="icon-tiny" />
                        <span>12% so với tháng trước</span>
                    </div>
                </div>

                <div className="stat-card green">
                    <div className="stat-header">
                        <h3 className="stat-title">Sản phẩm</h3>
                        <div className="stat-icon">
                            <Package className="icon-small" />
                        </div>
                    </div>
                    <div className="stat-value">128</div>
                    <div className="stat-change neutral">
                        <Zap className="icon-tiny amber" />
                        <span>+4 sản phẩm mới</span>
                    </div>
                </div>

                <div className="stat-card purple">
                    <div className="stat-header">
                        <h3 className="stat-title">Khách hàng</h3>
                        <div className="stat-icon">
                            <Users className="icon-small" />
                        </div>
                    </div>
                    <div className="stat-value">+2350</div>
                    <div className="stat-change positive">
                        <ArrowUp className="icon-tiny" />
                        <span>18% so với tháng trước</span>
                    </div>
                </div>
            </div>

            <div className="tabs">
                <div className="tabs-list">
                    <button
                        className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
                        onClick={() => setActiveTab("overview")}
                    >
                        Tổng quan
                    </button>
                    <button
                        className={`tab-button ${activeTab === "analytics" ? "active" : ""}`}
                        onClick={() => setActiveTab("analytics")}
                    >
                        Phân tích chi tiết
                    </button>
                    <button
                        className={`tab-button ${activeTab === "products" ? "active" : ""}`}
                        onClick={() => setActiveTab("products")}
                    >
                        Doanh thu
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === "overview" && (
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Doanh thu theo tháng</h2>
                                <p className="card-description">Biểu đồ hiển thị doanh thu theo tháng trong năm nay</p>
                            </div>
                            <div className="card-content">
                                <div className="chart-container">
                                    <div className="bar-chart">
                                        {monthlyRevenue.map((data, index) => (
                                            <div key={index} className="chart-column">
                                                <div
                                                    className={`bar ${index === 2 ? "highlight" : ""}`}
                                                    style={{
                                                        height: `${data.amount ? (data.amount / 120500000) * 220 : 0}px`,
                                                    }}
                                                >
                                                    {index === 2 && <div className="bar-tooltip">{(data.amount / 1000000).toFixed(1)}M ₫</div>}
                                                </div>
                                                <div className="bar-label">{data.month}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "analytics" && (
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Phân tích chi tiết</h2>
                                <p className="card-description">Thông tin phân tích chi tiết về doanh thu của cửa hàng</p>
                            </div>
                            <div className="card-content">
                                <div className="analytics-grid">
                                    {analyticsData.map((item, index) => (
                                        <div key={index} className={`analytics-card ${item.color}`}>
                                            <div className="analytics-header">
                                                <h3 className="analytics-title">{item.metric}</h3>
                                                <div className={`analytics-icon ${item.color}`}>{item.icon}</div>
                                            </div>
                                            <div className="analytics-value">{item.value}</div>
                                            <div
                                                className={`analytics-change ${item.status === "increase" ? (item.metric.includes("hủy") || item.metric.includes("hoàn") ? "negative" : "positive") : item.metric.includes("hủy") || item.metric.includes("hoàn") ? "positive" : "negative"}`}
                                            >
                                                {item.status === "increase" ? (
                                                    <ArrowUp className="icon-tiny" />
                                                ) : (
                                                    <ArrowDown className="icon-tiny" />
                                                )}
                                                <span>{item.change} so với tháng trước</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "products" && (
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Doanh thu theo sản phẩm</h2>
                                <p className="card-description">Phân tích doanh thu theo từng sản phẩm</p>
                            </div>
                            <div className="card-content">
                                <div className="products-table-container">
                                    <table className="products-table">
                                        <thead>
                                        <tr>
                                            <th>Sản phẩm</th>
                                            <th>Danh mục</th>
                                            <th className="text-center">Đã bán</th>
                                            <th className="text-right">Doanh thu</th>
                                            <th className="text-right">% Tổng</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {productRevenue.map((product) => (
                                            <tr key={product.id}>
                                                <td className="product-name">{product.name}</td>
                                                <td>
                                                    <span className="category-badge">{product.category}</span>
                                                </td>
                                                <td className="text-center">{product.sold}</td>
                                                <td className="text-right">{product.revenue.toLocaleString("vi-VN")} ₫</td>
                                                <td className="text-right">
                                                    <span className={`percent-badge ${product.color}`}>{product.percentOfTotal}%</span>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="revenue-distribution">
                                    <h3 className="distribution-title">Phân bổ doanh thu theo sản phẩm</h3>
                                    <div className="distribution-chart">
                                        {productRevenue.map((product, index) => (
                                            <div key={index} className="distribution-item">
                                                <div className="distribution-header">
                                                    <span className="distribution-name">{product.name}</span>
                                                    <span className="distribution-percent">{product.percentOfTotal}%</span>
                                                </div>
                                                <div className="progress-container">
                                                    <div
                                                        className={`progress-bar ${product.color}`}
                                                        style={{ width: `${product.percentOfTotal}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
