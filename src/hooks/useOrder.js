// src/hooks/useOrder.js
import { useState, useCallback } from 'react';
import orderService from '../services/orderService';

const useOrder = () => {
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalItems: 0,
        totalPages: 0
    });

    // Lấy danh sách đơn hàng
    const fetchOrders = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const response = await orderService.getSellerOrders(params);
            const { orders, currentPage, totalItems, totalPages } = response.data.data;
            setOrders(orders);
            setPagination({ currentPage, totalItems, totalPages });
            return { orders, pagination: { currentPage, totalItems, totalPages } };
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy danh sách đơn hàng');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Lấy chi tiết đơn hàng
    const fetchOrderDetail = useCallback(async (orderId) => {
        setLoading(true);
        try {
            const response = await orderService.getOrderDetail(orderId);
            setOrder(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy chi tiết đơn hàng');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Cập nhật trạng thái đơn hàng
    const updateOrderStatus = useCallback(async (orderId, status) => {
        setLoading(true);
        try {
            const response = await orderService.updateOrderStatus(orderId, status);
            // Cập nhật trạng thái trong danh sách đơn hàng hiện tại
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId
                        ? { ...order, orderStatus: status }
                        : order
                )
            );
            // Nếu đang xem chi tiết đơn hàng này, cập nhật luôn
            if (order && order.id === orderId) {
                setOrder({ ...order, orderStatus: status });
            }
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [order]);

    // Lấy thống kê đơn hàng
    const fetchOrderStatistics = useCallback(async (period) => {
        setLoading(true);
        try {
            const response = await orderService.getOrderStatistics(period);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy thống kê đơn hàng');
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
        orders,
        order,
        loading,
        error,
        pagination,
        fetchOrders,
        fetchOrderDetail,
        updateOrderStatus,
        fetchOrderStatistics,
        resetState
    };
};

export default useOrder;