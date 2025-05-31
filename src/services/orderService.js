// src/services/orderService.js
import api from '../config/Api.js';

const orderService = {
    getSellerOrders: (params) => {
        // Build query params similar to productService
        const queryParams = new URLSearchParams();

        if (params.page !== undefined) queryParams.append('page', params.page.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);
        if (params.fromDate) queryParams.append('startDate', params.fromDate);
        if (params.toDate) queryParams.append('endDate', params.toDate);

        return api.get(`/seller/orders?${queryParams}`);
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