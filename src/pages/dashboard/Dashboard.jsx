// src/pages/dashboard/Dashboard.jsx

import { useState, useEffect } from "react";
import {
    Package,
    ShoppingCart,
    Users,
    DollarSign,
    Calendar,
    RefreshCcw,
} from "lucide-react";
import "../../styles/dashboard/dashboard.css";
import useDashboard from "../../hooks/useDashboard";
import { formatCurrency } from "../../utils/format.js";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import RevenueChart from "./RevenueChart.jsx";
import DailyRevenueChart from "./DailyRevenueChart.jsx";
import CategoryRevenueChart from "./CategoryRevenueChart.jsx";

function Dashboard() {
    const [selectedMonth, setSelectedMonth] = useState("Tháng 5, 2025");
    const [activeTab, setActiveTab] = useState("monthly");
    const {
        overview,
        monthlyRevenue,
        orderStats,
        productStats,
        dailyRevenue,
        categoryRevenue,
        loading,
        error,
        fetchAllDashboardData,
        fetchDailyRevenue,
        fetchCategoryRevenue
    } = useDashboard();

    // Get today's date in dd/mm/yyyy format
    const getTodayDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Fetch dữ liệu khi component mount
    useEffect(() => {
        fetchAllDashboardData();
    }, [fetchAllDashboardData]);

    // Fetch dữ liệu theo tab khi cần thiết
    useEffect(() => {
        if (activeTab === "daily" && !dailyRevenue) {
            fetchDailyRevenue();
        } else if (activeTab === "category" && !categoryRevenue) {
            fetchCategoryRevenue();
        }
    }, [activeTab, dailyRevenue, categoryRevenue, fetchDailyRevenue, fetchCategoryRevenue]);

    if (loading && !overview) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorAlert message={error} />;
    }


    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div className="header-info">
                    <h1 className="page-title gradient-text">Dashboard</h1>
                </div>
                <div className="header-actions">
                    <div className="month-selector">
                        {getTodayDate()}
                    </div>
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
                </div>

                <div className="stat-card blue">
                    <div className="stat-header">
                        <h3 className="stat-title">Đơn hàng</h3>
                        <div className="stat-icon">
                            <ShoppingCart className="icon-small" />
                        </div>
                    </div>
                    <div className="stat-value">+{overview ? overview.totalOrders : 0}</div>
                </div>

                <div className="stat-card green">
                    <div className="stat-header">
                        <h3 className="stat-title">Sản phẩm</h3>
                        <div className="stat-icon">
                            <Package className="icon-small" />
                        </div>
                    </div>
                    <div className="stat-value">{overview ? overview.totalProducts : 0}</div>
                </div>

                <div className="stat-card purple">
                    <div className="stat-header">
                        <h3 className="stat-title">Khách hàng</h3>
                        <div className="stat-icon">
                            <Users className="icon-small" />
                        </div>
                    </div>
                    <div className="stat-value">{overview ? overview.totalCustomers : 0}</div>
                </div>
            </div>

            <div className="tabs">
                <div className="tabs-list">
                    <button
                        type="button"
                        className={`tab-button ${activeTab === "monthly" ? "active" : ""}`}
                        onClick={() => setActiveTab("monthly")}
                    >
                        Doanh thu theo tháng
                    </button>
                    <button
                        type="button"
                        className={`tab-button ${activeTab === "daily" ? "active" : ""}`}
                        onClick={() => setActiveTab("daily")}
                    >
                        Doanh thu theo ngày
                    </button>
                    <button
                        type="button"
                        className={`tab-button ${activeTab === "category" ? "active" : ""}`}
                        onClick={() => setActiveTab("category")}
                    >
                        Doanh thu theo danh mục
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === "monthly" && (
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Doanh thu theo tháng</h2>
                                <p className="card-description">
                                    Biểu đồ thể hiện doanh thu của cửa hàng theo từng tháng
                                </p>
                            </div>
                            <div className="card-content">
                                <RevenueChart data={monthlyRevenue} />
                            </div>
                        </div>
                    )}

                    {activeTab === "daily" && (
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Doanh thu theo ngày</h2>
                                <p className="card-description">
                                    Biểu đồ thể hiện doanh thu của cửa hàng trong 15 ngày gần nhất
                                </p>
                            </div>
                            <div className="card-content">
                                {loading ? (
                                    <div className="loading-container small">
                                        <LoadingSpinner />
                                    </div>
                                ) : (
                                    <DailyRevenueChart data={dailyRevenue} />
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "category" && (
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Doanh thu theo danh mục sản phẩm</h2>
                                <p className="card-description">
                                    Biểu đồ thể hiện phân bổ doanh thu theo từng danh mục sản phẩm
                                </p>
                            </div>
                            <div className="card-content">
                                {loading ? (
                                    <div className="loading-container small">
                                        <LoadingSpinner />
                                    </div>
                                ) : (
                                    <CategoryRevenueChart data={categoryRevenue} />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;