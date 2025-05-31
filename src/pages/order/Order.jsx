// src/pages/order/Order.jsx
import { useState, useEffect, useRef } from "react";
import { Calendar, Download, Eye, Filter, MoreHorizontal, Search, X } from "lucide-react";
import "../../styles/order/order.css";
import useOrder from "../../hooks/useOrder";
import { formatCurrency, formatDate } from "../../utils/format.js";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";

function Order() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [viewOrderDetails, setViewOrderDetails] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [pageInput, setPageInput] = useState("");

    const {
        orders,
        fetchOrders,
        fetchOrderDetail,
        updateOrderStatus,
        pagination,
        filters,
        updateFilters,
        loading,
        error,
        goToPage,
        nextPage,
        previousPage,
        resetState
    } = useOrder();

    // Lấy danh sách đơn hàng khi component mount hoặc khi filter thay đổi
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchOrders({
                    page: currentPage,
                    size: pageSize
                });
            } catch (err) {
                console.error("Lỗi khi lấy danh sách đơn hàng:", err);
            }
        };

        fetchData();
    }, [fetchOrders, currentPage, pageSize]);

    const searchTimeoutRef = useRef(null);
    // Update filter change handlers to use updateFilters
    const handleSearchChange = (value) => {
        setSearchQuery(value);
        // Debounce search
        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        // Set new timeout
        searchTimeoutRef.current = setTimeout(() => {
            updateFilters({ search: value });
        }, 500);
    };

    // Hiển thị chi tiết đơn hàng
    const handleViewOrderDetail = async (orderId) => {
        try {
            const orderDetail = await fetchOrderDetail(orderId);
            setViewOrderDetails(orderDetail);
        } catch (err) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
        }
    };

    // Đóng modal chi tiết đơn hàng
    const handleCloseModal = () => {
        setViewOrderDetails(null);
    };

    // Mở/đóng dropdown
    const toggleDropdown = (e, orderId) => {
        e.stopPropagation();
        if (dropdownOpen === orderId) {
            setDropdownOpen(null);
        } else {
            setDropdownOpen(orderId);
        }
    };

    // Xử lý thay đổi trạng thái đơn hàng
    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        updateFilters({ status });
    };

    const handleDateChange = (fromDate, toDate) => {
        setFromDate(fromDate);
        setToDate(toDate);
        updateFilters({ fromDate, toDate });
    };

    // Clear date filters
    const clearDateFilters = () => {
        setFromDate("");
        setToDate("");
        updateFilters({ fromDate: "", toDate: "" });
    };

    // Lấy class CSS cho badge trạng thái đơn hàng
    const getStatusClass = (status) => {
        switch (status) {
            case "DELIVERED":
                return "success";
            case "SHIPPED":
                return "warning";
            case "CONFIRMED":
            case "PENDING":
                return "default";
            case "CANCELLED":
                return "danger";
            default:
                return "default";
        }
    };

    // Chuyển đổi mã trạng thái thành chữ tiếng Việt
    const translateStatus = (status) => {
        switch (status) {
            case "DELIVERED":
                return "Đã giao hàng";
            case "SHIPPED":
                return "Đang giao hàng";
            case "CONFIRMED":
                return "Đã xác nhận";
            case "PENDING":
                return "Chờ xác nhận";
            case "CANCELLED":
                return "Đã hủy";
            default:
                return status;
        }
    };

    // Handle page input change
    const handlePageInputChange = (e) => {
        setPageInput(e.target.value);
    };

    // Handle page input submit
    const handlePageInputSubmit = (e) => {
        e.preventDefault();
        const pageNumber = parseInt(pageInput);
        if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
            goToPage(pageNumber - 1); // Convert to 0-based index
            setPageInput("");
        } else {
            // Show error or reset input
            setPageInput("");
        }
    };

    // Handle page input key press
    const handlePageInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            handlePageInputSubmit(e);
        }
    };

    if (loading && orders.length === 0) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorAlert message={error} onDismiss={resetState} />;
    }

    return (
        <div className="orders-page">
            <div className="page-header">
                <h1 className="page-title">Quản lý đơn hàng</h1>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Danh sách đơn hàng</h2>
                </div>
                <div className="card-content">
                    <div className="filters">
                        <div className="search-container">
                            <Search className="search-icon" />
                            <input
                                type="search"
                                className="search-input"
                                placeholder="Tìm kiếm theo mã đơn hàng, khách hàng..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>
                        <div className="filter-actions">
                            {/* Permanent Status Filter */}
                            <div className="status-filter">
                                <select
                                    id="status-select"
                                    className="filter-select"
                                    value={selectedStatus}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="DELIVERED">Đã giao hàng</option>
                                    <option value="SHIPPED">Đang giao hàng</option>
                                    <option value="CONFIRMED">Đã xác nhận</option>
                                    <option value="PENDING">Chờ xác nhận</option>
                                    <option value="CANCELLED">Đã hủy</option>
                                </select>
                                {selectedStatus && (
                                    <button
                                        className="button ghost small clear-filter"
                                        onClick={() => {
                                            setSelectedStatus("");
                                            handleStatusChange("");
                                        }}
                                        title="Xóa bộ lọc"
                                    >
                                        <X className="icon-small" />
                                    </button>
                                )}
                            </div>

                            <div className="date-filter">
                                <div className="date-input-group">
                                    <label htmlFor="from-date" className="date-label"> Từ </label>
                                    <input
                                        id="from-date"
                                        type="date"
                                        className="date-input"
                                        value={fromDate}
                                        onChange={(e) => handleDateChange(e.target.value, toDate)}
                                        max={toDate || undefined}
                                    />
                                </div>


                                <div className="date-input-group">
                                    <label htmlFor="to-date" className="date-label"> đến </label>
                                    <input
                                        id="to-date"
                                        type="date"
                                        className="date-input"
                                        value={toDate}
                                        onChange={(e) => handleDateChange(fromDate, e.target.value)}
                                        min={fromDate || undefined}
                                    />
                                </div>

                                {(fromDate || toDate) && (
                                    <button
                                        className="button ghost small clear-date-filter"
                                        onClick={clearDateFilters}
                                        title="Xóa bộ lọc ngày"
                                    >
                                        <X className="icon-small" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="orders-table-container">
                        <table className="orders-table">
                            <thead>
                            <tr>
                                <th className="id-column">Mã đơn hàng</th>
                                <th>Khách hàng</th>
                                <th>Ngày đặt</th>
                                <th className="price-column">Tổng tiền</th>
                                <th className="status-column">Trạng thái</th>
                                <th className="actions-column">Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="empty-table">
                                        Không tìm thấy đơn hàng nào
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="id-cell">OD-{order.id}</td>
                                        <td>{order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Khách hàng'}</td>
                                        <td>{formatDate(order.orderDate)}</td>
                                        <td className="price-cell">{formatCurrency(order.totalDiscountedPrice)}</td>
                                        <td className="status-cell">
                                            <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                                                {translateStatus(order.orderStatus)}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <div className="dropdown">
                                                <button
                                                    className="button icon-only ghost"
                                                    onClick={(e) => toggleDropdown(e, order.id)}
                                                >
                                                    <MoreHorizontal className="icon-small" />
                                                    <span className="sr-only">Mở menu</span>
                                                </button>
                                                {dropdownOpen === order.id && (
                                                    <div className="dropdown-menu">
                                                        <div className="dropdown-header">Thao tác</div>
                                                        <div className="dropdown-divider"></div>
                                                        <button
                                                            className="dropdown-item"
                                                            onClick={() => handleViewOrderDetail(order.id)}
                                                        >
                                                            <Eye className="icon-small" />
                                                            Xem chi tiết
                                                        </button>
                                                        <div className="dropdown-divider"></div>
                                                        <div className="dropdown-header">Thay đổi trạng thái</div>
                                                        <div className="dropdown-divider"></div>
                                                        {order.orderStatus !== "PENDING" && (
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={async () => {
                                                                    try {
                                                                        await updateOrderStatus(order.id, "PENDING");
                                                                        setDropdownOpen(null);
                                                                        // Refresh data after status update
                                                                        fetchOrders();
                                                                    } catch (err) {
                                                                        console.error("Lỗi cập nhật trạng thái:", err);
                                                                    }
                                                                }}
                                                            >
                                                                Chờ xác nhận
                                                            </button>
                                                        )}
                                                        {order.orderStatus !== "CONFIRMED" && (
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={() => handleStatusChange(order.id, "CONFIRMED")}
                                                            >
                                                                Đã xác nhận
                                                            </button>
                                                        )}
                                                        {order.orderStatus !== "SHIPPED" && (
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={() => handleStatusChange(order.id, "SHIPPED")}
                                                            >
                                                                Đang giao hàng
                                                            </button>
                                                        )}
                                                        {order.orderStatus !== "DELIVERED" && (
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={() => handleStatusChange(order.id, "DELIVERED")}
                                                            >
                                                                Đã giao hàng
                                                            </button>
                                                        )}
                                                        {order.orderStatus !== "CANCELLED" && (
                                                            <button
                                                                className="dropdown-item danger"
                                                                onClick={() => handleStatusChange(order.id, "CANCELLED")}
                                                            >
                                                                Hủy đơn hàng
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination-container">
                        <div className="pagination">
                            <button
                                className={`button-product outline small ${pagination.currentPage === 0 ? 'active' : ''}`}
                                onClick={() => goToPage(0)}
                                disabled={pagination.currentPage === 0}
                            >
                                Trang đầu
                            </button>

                            <button
                                className="button outline small"
                                disabled={!pagination.hasPrevious}
                                onClick={previousPage}
                            >
                                Trang Trước
                            </button>

                            <div className="page-input-container">
                                <input
                                    type="number"
                                    value={pageInput}
                                    onChange={handlePageInputChange}
                                    onKeyPress={handlePageInputKeyPress}
                                    placeholder={`${pagination.currentPage + 1}`}
                                    min="1"
                                    max={pagination.totalPages}
                                    className="button-product outline small "
                                />
                            </div>

                            <button
                                className="button outline small"
                                disabled={!pagination.hasNext}
                                onClick={nextPage}
                            >
                                Trang kế
                            </button>
                            <button
                                className={`button-product outline small ${pagination.currentPage === pagination.totalPages - 1 || pagination.totalPages === 0 ? 'active' : ''}`}
                                onClick={() => goToPage(pagination.totalPages - 1)}
                                disabled={pagination.currentPage === pagination.totalPages-1 || pagination.totalPages === 0}
                            >
                                Trang cuối
                            </button>
                        </div>

                        <div className="pagination-info">
                            Hiển thị {orders.length} trên {pagination.totalElements || 0} đơn hàng
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {viewOrderDetails && (
                <OrderDetailModal
                    order={viewOrderDetails}
                    onClose={handleCloseModal}
                    onStatusChange={handleStatusChange}
                />
            )}
        </div>
    );
}

export default Order;