// src/hooks/useDashboard.js
import { useState, useCallback } from 'react';
import dashboardService from '../services/dashboardService';

const useDashboard = () => {
    const [overview, setOverview] = useState(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState(null);
    const [orderStats, setOrderStats] = useState(null);
    const [productStats, setProductStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Lấy tổng quan dashboard
    const fetchDashboardOverview = useCallback(async () => {
        setLoading(true);
        try {
            const response = await dashboardService.getDashboardOverview();
            setOverview(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy dữ liệu tổng quan');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Lấy doanh thu theo tháng
    const fetchMonthlyRevenue = useCallback(async () => {
        setLoading(true);
        try {
            const response = await dashboardService.getMonthlyRevenue();
            setMonthlyRevenue(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy dữ liệu doanh thu');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Lấy thống kê đơn hàng
    const fetchOrderStats = useCallback(async () => {
        setLoading(true);
        try {
            const response = await dashboardService.getOrderStats();
            setOrderStats(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy thống kê đơn hàng');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Lấy thống kê sản phẩm
    const fetchProductStats = useCallback(async () => {
        setLoading(true);
        try {
            const response = await dashboardService.getProductStats();
            setProductStats(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy thống kê sản phẩm');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Lấy tất cả dữ liệu dashboard
    const fetchAllDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const [overviewRes, revenueRes, orderStatsRes, productStatsRes] = await Promise.all([
                dashboardService.getDashboardOverview(),
                dashboardService.getMonthlyRevenue(),
                dashboardService.getOrderStats(),
                dashboardService.getProductStats(),
            ]);

            setOverview(overviewRes.data.data);
            setMonthlyRevenue(revenueRes.data.data);
            setOrderStats(orderStatsRes.data.data);
            setProductStats(productStatsRes.data.data);

            return {
                overview: overviewRes.data.data,
                monthlyRevenue: revenueRes.data.data,
                orderStats: orderStatsRes.data.data,
                productStats: productStatsRes.data.data
            };
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy dữ liệu dashboard');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Reset state khi có lỗi
    const resetState = () => {
        setError(null);
    };

    return {
        overview,
        monthlyRevenue,
        orderStats,
        productStats,
        loading,
        error,
        fetchDashboardOverview,
        fetchMonthlyRevenue,
        fetchOrderStats,
        fetchProductStats,
        fetchAllDashboardData,
        resetState
    };
};

export default useDashboard;