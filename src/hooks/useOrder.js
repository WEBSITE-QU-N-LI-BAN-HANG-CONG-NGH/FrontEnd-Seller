// src/hooks/useOrder.js
import { useState, useCallback } from 'react';
import orderService from '../services/orderService';

const useOrder = () => {
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        fromDate: '',
        toDate: ''
    });
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        hasNext: false,
        hasPrevious: false,
        pageSize: 10,
        isFirst: true,
        isLast: true
    });

    // Lấy danh sách đơn hàng
    const fetchOrders = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const response = await orderService.getSellerOrders(params);
            const { orders, pagination: paginationData } = response.data.data;

            setOrders(orders);
            setPagination(paginationData);

            return { orders, pagination: paginationData };
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy danh sách đơn hàng');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []); // No dependencies

    // Navigate to specific page
    const goToPage = useCallback((page) => {
        fetchOrders({
            page,
            size: pagination.pageSize
        });
    }, [fetchOrders, pagination.pageSize]);

// Navigate to next page
    const nextPage = useCallback(() => {
        if (pagination.hasNext) {
            goToPage(pagination.currentPage + 1);
        }
    }, [goToPage, pagination.hasNext, pagination.currentPage]);

// Navigate to previous page
    const previousPage = useCallback(() => {
        if (pagination.hasPrevious) {
            goToPage(pagination.currentPage - 1);
        }
    }, [goToPage, pagination.hasPrevious, pagination.currentPage]);

    // Add updateFilters function similar to useProduct
    const updateFilters = useCallback((newFilters) => {
        console.log("=== DEBUG FRONTEND FILTER ===");
        console.log("newFilters:", newFilters);

        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);

        // Call fetchOrders with complete params
        fetchOrders({
            page: 0,
            size: pagination.pageSize,
            search: updatedFilters.search,
            status: updatedFilters.status,
            fromDate: updatedFilters.fromDate,
            toDate: updatedFilters.toDate
        });
    }, [fetchOrders, filters, pagination.pageSize]);

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
        filters,
        fetchOrders,
        fetchOrderDetail,
        updateOrderStatus,
        fetchOrderStatistics,
        updateFilters,
        goToPage,           // Add this
        nextPage,           // Add this
        previousPage,       // Add this
        resetState
    };
};

export default useOrder;