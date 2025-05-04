// src/pages/dashboard/Dashboard.jsx
import { useState, useEffect } from "react";
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
} from "lucide-react";
import "../../styles/dashboard/dashboard.css";
import useDashboard from "../../hooks/useDashboard";
import { formatCurrency } from "../../utils/formatters";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";

function Dashboard() {
    const [selectedMonth, setSelectedMonth] = useState("Tháng 5, 2025");
    const [activeTab, setActiveTab] = useState("overview");
    const {
        overview,
        monthlyRevenue,
        orderStats,
        productStats,
        loading,
        error,
        fetchAllDashboardData
    } = useDashboard();

    // Fetch dữ liệu dashboard khi component mount
    useEffect(() => {
        fetchAllDashboardData();
    }, [fetchAllDashboardData]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorAlert message={error} />;
    }

    // Chuyển đổi dữ liệu doanh thu theo tháng để hiển thị trên biểu đồ
    const revenueChartData = monthlyRevenue ? Object.entries(monthlyRevenue).map(([month, amount]) => ({
        month,
        amount: amount
    })) : [];

    // Dữ liệu phân tích chi tiết
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
            value: overview ? formatCurrency(overview.totalRevenue / overview.totalOrders) : "0 ₫",
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
            value: orderStats ? `${(orderStats.cancelled / orderStats.total * 100).toFixed(1)}%` : "0%",
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
    ];

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
                            <option value="Tháng 5, 2025">Tháng 5, 2025</option>
                            <option value="Tháng 4, 2025">Tháng 4, 2025</option>
                            <option value="Tháng 3, 2025">Tháng 3, 2025</option>
                        </select>
                    </div>
                    <button
                        className="button icon-only outline"
                        onClick={() => fetchAllDashboardData()}
                    >
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
                    <div className="stat-value">
                        {overview ? formatCurrency(overview.totalRevenue) : "0 ₫"}
                    </div>
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
                    <div className="stat-value">+{overview ? overview.totalOrders : 0}</div>
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
                    <div className="stat-value">{overview ? overview.totalProducts : 0}</div>
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
                        type="button"
                        className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
                        onClick={() => setActiveTab("overview")}
                    >
                        Tổng quan
                    </button>
                    <button
                        type="button"
                        className={`tab-button ${activeTab === "analytics" ? "active" : ""}`}
                        onClick={() => setActiveTab("analytics")}
                    >
                        Phân tích chi tiết
                    </button>
                    <button
                        type="button"
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
                                        {revenueChartData.map((data, index) => (
                                            <div key={index} className="chart-column">
                                                <div
                                                    className={`bar ${index === 2 ? "highlight" : ""}`}
                                                    style={{
                                                        height: `${data.amount ? (data.amount / Math.max(...revenueChartData.map(d => d.amount))) * 220 : 0}px`,
                                                    }}
                                                >
                                                    {index === 2 && <div className="bar-tooltip">{formatCurrency(data.amount)}</div>}
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
                                {/* Nội dung tab doanh thu theo sản phẩm */}
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
                                        {overview && overview.recentOrders ? overview.recentOrders.map((order, index) => (
                                            <tr key={index}>
                                                <td className="product-name">{order.customerName}</td>
                                                <td>
                                                    <span className="category-badge">Đơn hàng</span>
                                                </td>
                                                <td className="text-center">1</td>
                                                <td className="text-right">{formatCurrency(order.totalAmount)}</td>
                                                <td className="text-right">
                                                    <span className={`percent-badge blue`}>
                                                        {((order.totalAmount / overview.totalRevenue) * 100).toFixed(1)}%
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : null}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;