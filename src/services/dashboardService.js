// src/services/dashboardService.js
import axiosClient from './axiosClient';

const dashboardService = {
    getDashboardOverview: () => {
        return axiosClient.get('/seller/dashboard/overview');
    },

    getMonthlyRevenue: () => {
        return axiosClient.get('/seller/dashboard/revenue');
    },

    getOrderStats: () => {
        return axiosClient.get('/seller/dashboard/orders/stats');
    },

    getProductStats: () => {
        return axiosClient.get('/seller/dashboard/products/stats');
    }
};

export default dashboardService;