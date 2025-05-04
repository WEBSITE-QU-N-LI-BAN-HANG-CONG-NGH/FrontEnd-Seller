// src/components/feature/OrderDetailModal.jsx
import React from 'react';
import { X } from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

const OrderDetailModal = ({ order, onClose, onStatusChange }) => {
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

    // Chuyển đổi phương thức thanh toán
    const translatePaymentMethod = (method) => {
        switch (method) {
            case "COD":
                return "Thanh toán khi nhận hàng";
            case "VNPAY":
                return "Thanh toán qua VNPay";
            default:
                return method;
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">Chi tiết đơn hàng #{order.id}</h2>
                        <p className="modal-description">Đặt ngày: {formatDate(order.orderDate)}</p>
                    </div>
                    <button className="modal-close-button" onClick={onClose}>
                        <X className="icon-small" />
                    </button>
                </div>
                <div className="modal-body">
                    <div className="order-status-section">
                        <h3 className="section-title">Trạng thái đơn hàng</h3>
                        <div className="order-status-container">
                            <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                                {translateStatus(order.orderStatus)}
                            </span>
                            <div className="status-actions">
                                <select
                                    className="status-select"
                                    value={order.orderStatus}
                                    onChange={(e) => onStatusChange(order.id, e.target.value)}
                                >
                                    <option value="PENDING">Chờ xác nhận</option>
                                    <option value="CONFIRMED">Đã xác nhận</option>
                                    <option value="SHIPPED">Đang giao hàng</option>
                                    <option value="DELIVERED">Đã giao hàng</option>
                                    <option value="CANCELLED">Đã hủy</option>
                                </select>
                                <button
                                    className="button small primary"
                                    onClick={() => onStatusChange(order.id, "CONFIRMED")}
                                    disabled={order.orderStatus === "CONFIRMED"}
                                >
                                    Xác nhận
                                </button>
                                <button
                                    className="button small outline"
                                    onClick={() => onStatusChange(order.id, "CANCELLED")}
                                    disabled={order.orderStatus === "CANCELLED"}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="order-grid">
                        <div className="order-info-section">
                            <h3 className="section-title">Thông tin khách hàng</h3>
                            <p className="info-item">
                                <span className="info-label">Họ tên:</span>
                                <span className="info-value">
                                    {order.shippingAddress?.fullName || 'N/A'}
                                </span>
                            </p>
                            <p className="info-item">
                                <span className="info-label">Số điện thoại:</span>
                                <span className="info-value">
                                    {order.shippingAddress?.phoneNumber || 'N/A'}
                                </span>
                            </p>
                            <p className="info-item">
                                <span className="info-label">Địa chỉ giao hàng:</span>
                                <span className="info-value">
                                    {order.shippingAddress ? (
                                        `${order.shippingAddress.street}, ${order.shippingAddress.ward}, ${order.shippingAddress.district}, ${order.shippingAddress.province}`
                                    ) : 'N/A'}
                                </span>
                            </p>
                            {order.shippingAddress?.note && (
                                <p className="info-item">
                                    <span className="info-label">Ghi chú:</span>
                                    <span className="info-value">
                                        {order.shippingAddress.note}
                                    </span>
                                </p>
                            )}
                        </div>

                        <div className="order-info-section">
                            <h3 className="section-title">Thông tin thanh toán</h3>
                            <p className="info-item">
                                <span className="info-label">Phương thức:</span>
                                <span className="info-value">
                                    {translatePaymentMethod(order.paymentMethod)}
                                </span>
                            </p>
                            <p className="info-item">
                                <span className="info-label">Trạng thái thanh toán:</span>
                                <span className={`info-value status-text ${order.paymentStatus === 'COMPLETED' ? 'success' : order.paymentStatus === 'PENDING' ? 'warning' : 'danger'}`}>
                                    {order.paymentStatus === 'COMPLETED' ? 'Đã thanh toán' :
                                        order.paymentStatus === 'PENDING' ? 'Chờ thanh toán' :
                                            order.paymentStatus === 'CANCELLED' ? 'Đã hủy' :
                                                order.paymentStatus}
                                </span>
                            </p>
                            <p className="info-item">
                                <span className="info-label">Ngày đặt hàng:</span>
                                <span className="info-value">
                                    {formatDateTime(order.orderDate)}
                                </span>
                            </p>
                            {order.deliveryDate && (
                                <p className="info-item">
                                    <span className="info-label">Ngày giao hàng:</span>
                                    <span className="info-value">
                                        {formatDateTime(order.deliveryDate)}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="order-items-section">
                        <h3 className="section-title">Chi tiết sản phẩm</h3>
                        <div className="order-items-table-container">
                            <table className="order-items-table">
                                <thead>
                                <tr>
                                    <th className="item-image-col"></th>
                                    <th className="item-name-col">Sản phẩm</th>
                                    <th className="item-price-col">Đơn giá</th>
                                    <th className="item-quantity-col">SL</th>
                                    <th className="item-total-col">Thành tiền</th>
                                </tr>
                                </thead>
                                <tbody>
                                {order.orderItems?.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <img
                                                src={item.imageUrl || "/placeholder.svg?height=50&width=50"}
                                                alt={item.productTitle}
                                                className="item-thumbnail"
                                            />
                                        </td>
                                        <td>
                                            <div className="item-details">
                                                <span className="item-name">{item.productTitle}</span>
                                                {item.size && (
                                                    <span className="item-variant">Phiên bản: {item.size}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="item-price">
                                            {formatCurrency(item.discountedPrice || item.price)}
                                            {item.discountedPrice && item.price > item.discountedPrice && (
                                                <span className="original-price">
                                                        {formatCurrency(item.price)}
                                                    </span>
                                            )}
                                        </td>
                                        <td className="item-quantity">{item.quantity}</td>
                                        <td className="item-total">
                                            {formatCurrency((item.discountedPrice || item.price) * item.quantity)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="order-summary-section">
                        <div className="order-summary">
                            <div className="summary-row">
                                <span>Tổng tiền hàng:</span>
                                <span>{formatCurrency(order.originalPrice || 0)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Giảm giá:</span>
                                <span>-{formatCurrency(order.discount || 0)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Phí vận chuyển:</span>
                                <span>{formatCurrency(0)}</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-row total">
                                <span>Tổng thanh toán:</span>
                                <span>{formatCurrency(order.totalDiscountedPrice || 0)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="button outline" onClick={onClose}>
                        Đóng
                    </button>
                    <button className="button primary">
                        In hóa đơn
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;