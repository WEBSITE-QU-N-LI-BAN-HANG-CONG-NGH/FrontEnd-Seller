// src/services/orderService.js
import axiosClient from './axiosClient';

const orderService = {
    getSellerOrders: (params) => {
        return axiosClient.get('/seller/orders', { params });
    },

    getOrderDetail: (orderId) => {
        return axiosClient.get(`/seller/orders/${orderId}`);
    },

    updateOrderStatus: (orderId, status) => {
        return axiosClient.put(`/seller/orders/${orderId}/status`, null, {
            params: { status }
        });
    },

    getOrderStatistics: (period) => {
        return axiosClient.get('/seller/orders/statistics', {
            params: { period }
        });
    }
};

export default orderService;