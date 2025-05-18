// src/services/orderService.js
import api from '../config/Api.js';

const orderService = {
    getSellerOrders: (params) => {
        return api.get('/seller/orders', { params });
    },

    getOrderDetail: (orderId) => {
        return api.get(`/seller/orders/${orderId}`);
    },

    updateOrderStatus: (orderId, status) => {
        return api.put(`/seller/orders/${orderId}/status`, null, {
            params: { status }
        });
    },

    getOrderStatistics: (period) => {
        return api.get('/seller/orders/statistics', {
            params: { period }
        });
    }
};

export default orderService;