// src/components/order/DetailOrder.jsx
import { useState } from "react";
import { X, Package, User, MapPin, CreditCard, Calendar, Truck } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/format.js";
import "../../styles/order/detailorder.css"

function DetailOrder({ order, onClose, onStatusUpdate }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(order.orderStatus); // Add local state for status

    // Handle status update
    const handleStatusChange = async (newStatus) => {
        setIsUpdating(true);
        try {
            await onStatusUpdate(order.id, newStatus);
            setCurrentStatus(newStatus); // Update local state immediately
        } catch (error) {
            console.error("Error updating status:", error);
            // Revert to original status if update fails
            setCurrentStatus(order.orderStatus);
        } finally {
            setIsUpdating(false);
        }
    };

    // Get status class for styling
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

    // Translate status to Vietnamese
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

    // Calculate total items
    const totalItems = order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content detail-order-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        <Package className="icon" />
                        Chi tiết đơn hàng #{order.id}
                    </h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X className="icon" />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="order-detail-grid">
                        {/* Order Info Section */}
                        <div className="order-info-section">
                            <h3 className="section-title">
                                <Calendar className="icon-small" />
                                Thông tin đơn hàng
                            </h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Mã đơn hàng:</label>
                                    <span className="order-id">OD-{order.id}</span>
                                </div>
                                <div className="info-item">
                                    <label>Ngày đặt:</label>
                                    <span>{formatDate(order.orderDate)}</span>
                                </div>
                                <div className="info-item">
                                    <label>Trạng thái:</label>
                                    <div className="status-display">
                                        <select
                                            className={`status-select ${getStatusClass(currentStatus)}`}
                                            value={currentStatus}
                                            onChange={(e) => handleStatusChange(e.target.value)}
                                            disabled={isUpdating}
                                        >
                                            <option value="PENDING">Chờ xác nhận</option>
                                            <option value="CONFIRMED">Đã xác nhận</option>
                                            <option value="SHIPPED">Đang giao hàng</option>
                                            <option value="DELIVERED">Đã giao hàng</option>
                                            <option value="CANCELLED">Đã hủy</option>
                                        </select>
                                        {isUpdating && <span className="updating-indicator">Đang cập nhật...</span>}
                                    </div>
                                </div>
                                <div className="info-item">
                                    <label>Tổng sản phẩm:</label>
                                    <span>{totalItems} sản phẩm</span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info Section */}
                        <div className="customer-info-section">
                            <h3 className="section-title">
                                <User className="icon-small" />
                                Thông tin khách hàng
                            </h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Họ tên:</label>
                                    <span>{order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Không có thông tin'}</span>
                                </div>
                                <div className="info-item">
                                    <label>Email:</label>
                                    <span>{order.user?.email || 'Không có thông tin'}</span>
                                </div>
                                <div className="info-item">
                                    <label>Số điện thoại:</label>
                                    <span>{order.user?.mobile || 'Không có thông tin'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address Section */}
                        <div className="shipping-info-section">
                            <h3 className="section-title">
                                <MapPin className="icon-small" />
                                Địa chỉ giao hàng
                            </h3>
                            <div className="address-info">
                                {order.shippingAddress ? (
                                    <div className="address-details">
                                        <p><strong>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</strong></p>
                                        <p>{order.shippingAddress.streetAddress}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                        <p>Mã bưu điện: {order.shippingAddress.zipCode}</p>
                                        <p>Điện thoại: {order.shippingAddress.mobile}</p>
                                    </div>
                                ) : (
                                    <p className="no-info">Không có thông tin địa chỉ giao hàng</p>
                                )}
                            </div>
                        </div>

                        {/* Payment Info Section */}
                        <div className="payment-info-section">
                            <h3 className="section-title">
                                <CreditCard className="icon-small" />
                                Thông tin thanh toán
                            </h3>
                            <div className="payment-summary">
                                <div className="payment-row">
                                    <span>Tổng tiền hàng:</span>
                                    <span>{formatCurrency(order.totalPrice || 0)}</span>
                                </div>
                                <div className="payment-row">
                                    <span>Giảm giá:</span>
                                    <span className="discount">-{formatCurrency((order.totalPrice || 0) - (order.totalDiscountedPrice || 0))}</span>
                                </div>
                                <div className="payment-row total">
                                    <span>Tổng thanh toán:</span>
                                    <span className="total-amount">{formatCurrency(order.totalDiscountedPrice || 0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items Section */}
                    <div className="order-items-section">
                        <h3 className="section-title">
                            <Package className="icon-small" />
                            Sản phẩm đã đặt
                        </h3>
                        <div className="items-table-container">
                            <table className="items-table">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Đơn giá</th>
                                        <th>Số lượng</th>
                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.orderItems?.map((item, index) => (
                                        <tr key={index}>
                                            <td className="product-info">
                                                <div className="product-details">
                                                    <div className="product-image">
                                                        {item.imageUrl ? (
                                                            <img src={item.imageUrl} alt={item.productTitle} />
                                                        ) : (
                                                            <div className="no-image">
                                                                <Package className="icon-small" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="product-text">
                                                        <h4>{item.productTitle || 'Không có tên sản phẩm'}</h4>
                                                        {item.size && <p className="product-size">Size: {item.size}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="price-cell">{formatCurrency(item.price || 0)}</td>
                                            <td className="quantity-cell">{item.quantity}</td>
                                            <td className="total-cell">{formatCurrency((item.price || 0) * item.quantity)}</td>
                                        </tr>
                                    )) || (
                                        <tr>
                                            <td colSpan="4" className="no-items">Không có sản phẩm nào</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="button outline" onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DetailOrder;