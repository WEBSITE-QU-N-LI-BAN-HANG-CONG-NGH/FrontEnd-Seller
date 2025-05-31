// src/services/dashboardService.js

import api from '../config/Api.js';

const dashboardService = {
    getDashboardOverview: () => {
        return api.get('/seller/dashboard/overview');
    },

    getMonthlyRevenue: () => {
        return api.get('/seller/dashboard/revenue/month');
    },

    getOrderStats: () => {
        return api.get('/seller/dashboard/orders/stats');
    },

    getProductStats: () => {
        return api.get('/seller/dashboard/products/stats');
    },

    // Thêm các endpoints mới
    getDailyRevenue: () => {
        return api.get('/seller/dashboard/revenue/daily');
    },

    getCategoryRevenue: () => {
        return api.get('/seller/dashboard/revenue/category');
    }
};

export default dashboardService;