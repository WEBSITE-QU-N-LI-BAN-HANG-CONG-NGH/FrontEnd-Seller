// src/pages/order/Order.jsx
import { useState, useEffect } from "react";
import { Calendar, Download, Eye, Filter, MoreHorizontal, Search, X } from "lucide-react";
import "../../styles/order/order.css";
import useOrder from "../../hooks/useOrder";
import { formatCurrency, formatDate } from "../../utils/format.js";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";

function Order() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [viewOrderDetails, setViewOrderDetails] = useState(null);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);

    const {
        orders,
        fetchOrders,
        fetchOrderDetail,
        updateOrderStatus,
        pagination,
        loading,
        error,
        resetState
    } = useOrder();

    // Lấy danh sách đơn hàng khi component mount hoặc khi filter thay đổi
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchOrders({
                    page: currentPage,
                    size: pageSize,
                    status: selectedStatus || undefined,
                    search: searchQuery || undefined
                });
            } catch (err) {
                console.error("Lỗi khi lấy danh sách đơn hàng:", err);
            }
        };

        fetchData();
    }, [fetchOrders, currentPage, pageSize, selectedStatus, searchQuery]);

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

    // Mở/đóng dropdown filter
    const toggleFilterDropdown = () => {
        setFilterDropdownOpen(!filterDropdownOpen);
    };

    // Xử lý thay đổi trạng thái đơn hàng
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);

            // Nếu đang xem chi tiết đơn hàng này, cập nhật lại thông tin
            if (viewOrderDetails && viewOrderDetails.id === orderId) {
                const updatedOrder = await fetchOrderDetail(orderId);
                setViewOrderDetails(updatedOrder);
            }

            setDropdownOpen(null);
        } catch (err) {
            console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err);
        }
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

    // Xử lý phân trang
    const handleNextPage = () => {
        if (pagination && currentPage < pagination.totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
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
                    <p className="card-description">Quản lý và theo dõi tất cả đơn hàng của cửa hàng</p>
                </div>
                // src/pages/order/Order.jsx (tiếp tục)
                <div className="card-content">
                    <div className="filters">
                        <div className="search-container">
                            <Search className="search-icon" />
                            <input
                                type="search"
                                className="search-input"
                                placeholder="Tìm kiếm theo mã đơn hàng, khách hàng..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="filter-actions">
                            <div className="filter-dropdown">
                                <button className="button outline small" onClick={toggleFilterDropdown}>
                                    <Filter className="icon-small" />
                                    Lọc
                                    {selectedStatus && <span className="filter-badge">1</span>}
                                </button>
                                {filterDropdownOpen && (
                                    <div className="dropdown-menu filter-menu">
                                        <h4 className="dropdown-header">Lọc theo trạng thái</h4>
                                        <div className="dropdown-divider"></div>
                                        <select
                                            className="filter-select"
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                        >
                                            <option value="">Tất cả trạng thái</option>
                                            <option value="DELIVERED">Đã giao hàng</option>
                                            <option value="SHIPPED">Đang giao hàng</option>
                                            <option value="CONFIRMED">Đã xác nhận</option>
                                            <option value="PENDING">Chờ xác nhận</option>
                                            <option value="CANCELLED">Đã hủy</option>
                                        </select>
                                        {selectedStatus && (
                                            <button className="button ghost small" onClick={() => setSelectedStatus("")}>
                                                <X className="icon-small" />
                                                Xóa bộ lọc
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <button className="button outline small">
                                <Calendar className="icon-small" />
                                Ngày
                            </button>
                            <button className="button outline small">
                                <Download className="icon-small" />
                                Xuất
                            </button>
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
                                                                onClick={() => handleStatusChange(order.id, "PENDING")}
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

                    <div className="pagination">
                        <button
                            className="button outline small"
                            onClick={handlePrevPage}
                            disabled={currentPage === 0}
                        >
                            Trước
                        </button>
                        <span className="pagination-info">
                            Trang {currentPage + 1} / {pagination?.totalPages || 1}
                        </span>
                        <button
                            className="button outline small"
                            onClick={handleNextPage}
                            disabled={!pagination || currentPage >= pagination.totalPages - 1}
                        >
                            Sau
                        </button>
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