// src/hooks/useDashboard.js

import {useCallback, useState} from 'react';
import dashboardService from '../services/dashboardService';

const useDashboard = () => {
    const [overview, setOverview] = useState(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState(null);
    const [orderStats, setOrderStats] = useState(null);
    const [productStats, setProductStats] = useState(null);
    const [dailyRevenue, setDailyRevenue] = useState(null);
    const [categoryRevenue, setCategoryRevenue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Các hàm hiện có
    const fetchDashboardOverview = useCallback(async () => {
        setLoading(true);
        try {
            const response = await dashboardService.getDashboardOverview();
            setOverview(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy dữ liệu tổng quan');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMonthlyRevenue = useCallback(async () => {
        setLoading(true);
        try {
            const response = await dashboardService.getMonthlyRevenue();
            setMonthlyRevenue(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy dữ liệu doanh thu hàng tháng');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOrderStats = useCallback(async () => {
        setLoading(true);
        try {
            const response = await dashboardService.getOrderStats();
            setOrderStats(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy thống kê đơn hàng');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchProductStats = useCallback(async () => {
        setLoading(true);
        try {
            const response = await dashboardService.getProductStats();
            setProductStats(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy thống kê sản phẩm');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Thêm các hàm mới
    const fetchDailyRevenue = useCallback(async () => {
        setLoading(true);
        try {
            const response = await dashboardService.getDailyRevenue();
            setDailyRevenue(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy dữ liệu doanh thu theo ngày');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCategoryRevenue = useCallback(async () => {
        setLoading(true);
        try {
            const response = await dashboardService.getCategoryRevenue();
            setCategoryRevenue(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy dữ liệu doanh thu theo danh mục');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch tất cả dữ liệu
    const fetchAllDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            // Gọi API song song để cải thiện tốc độ
            const [overviewRes, revenueRes, orderStatsRes, productStatsRes, dailyRevenueRes, categoryRevenueRes] = await Promise.all([
                dashboardService.getDashboardOverview(),
                dashboardService.getMonthlyRevenue(),
                dashboardService.getOrderStats(),
                dashboardService.getProductStats(),
                dashboardService.getDailyRevenue(),
                dashboardService.getCategoryRevenue()
            ]);

            setOverview(overviewRes.data.data);
            setMonthlyRevenue(revenueRes.data.data);
            setOrderStats(orderStatsRes.data.data);
            setProductStats(productStatsRes.data.data);
            setDailyRevenue(dailyRevenueRes.data.data);
            setCategoryRevenue(categoryRevenueRes.data.data);

            return {
                overview: overviewRes.data.data,
                monthlyRevenue: revenueRes.data.data,
                orderStats: orderStatsRes.data.data,
                productStats: productStatsRes.data.data,
                dailyRevenue: dailyRevenueRes.data.data,
                categoryRevenue: categoryRevenueRes.data.data
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
        dailyRevenue,
        categoryRevenue,
        loading,
        error,
        fetchDashboardOverview,
        fetchMonthlyRevenue,
        fetchOrderStats,
        fetchProductStats,
        fetchDailyRevenue,
        fetchCategoryRevenue,
        fetchAllDashboardData,
        resetState
    };
};

export default useDashboard;