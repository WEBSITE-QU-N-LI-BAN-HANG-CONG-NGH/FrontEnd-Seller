// src/services/dashboardService.js
import api from '../config/Api.js';

const dashboardService = {
    getDashboardOverview: () => {
        return api.get('/seller/dashboard/overview');
    },

    getMonthlyRevenue: () => {
        return api.get('/seller/dashboard/revenue');
    },

    getOrderStats: () => {
        return api.get('/seller/dashboard/orders/stats');
    },

    getProductStats: () => {
        return api.get('/seller/dashboard/products/stats');
    }
};

export default dashboardService;