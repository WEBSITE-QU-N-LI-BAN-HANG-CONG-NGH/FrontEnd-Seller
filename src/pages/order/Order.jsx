"use client"

import { useState } from "react"
import { Calendar, Download, Eye, Filter, MoreHorizontal, Search, X } from "lucide-react"
import "../../styles/order/order.css"

// Sample order data
const orders = [
    {
        id: "ORD-2023-1001",
        customer: "Nguyễn Văn A",
        date: "15/03/2023",
        total: 29990000,
        status: "Đã giao hàng",
        items: 2,
        payment: "Thanh toán khi nhận hàng",
        address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    },
    {
        id: "ORD-2023-1002",
        customer: "Trần Thị B",
        date: "14/03/2023",
        total: 8990000,
        status: "Đang giao hàng",
        items: 1,
        payment: "Chuyển khoản ngân hàng",
        address: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    },
    {
        id: "ORD-2023-1003",
        customer: "Lê Văn C",
        date: "13/03/2023",
        total: 12500000,
        status: "Đang xử lý",
        items: 3,
        payment: "Ví điện tử MoMo",
        address: "789 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM",
    },
    {
        id: "ORD-2023-1004",
        customer: "Phạm Thị D",
        date: "12/03/2023",
        total: 4990000,
        status: "Đã hủy",
        items: 1,
        payment: "Thẻ tín dụng",
        address: "101 Đường Hai Bà Trưng, Quận 1, TP.HCM",
    },
    {
        id: "ORD-2023-1005",
        customer: "Hoàng Văn E",
        date: "11/03/2023",
        total: 35500000,
        status: "Đã giao hàng",
        items: 4,
        payment: "Thanh toán khi nhận hàng",
        address: "202 Đường Võ Văn Tần, Quận 3, TP.HCM",
    },
]

function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("")
    const [viewOrderDetails, setViewOrderDetails] = useState(null)
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(null)

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = selectedStatus === "" || order.status === selectedStatus

        return matchesSearch && matchesStatus
    })

    const toggleDropdown = (orderId) => {
        if (dropdownOpen === orderId) {
            setDropdownOpen(null)
        } else {
            setDropdownOpen(orderId)
        }
    }

    const toggleFilterDropdown = () => {
        setFilterDropdownOpen(!filterDropdownOpen)
    }

    const getStatusClass = (status) => {
        switch (status) {
            case "Đã giao hàng":
                return "success"
            case "Đang giao hàng":
                return "warning"
            case "Đang xử lý":
                return "default"
            case "Đã hủy":
                return "danger"
            default:
                return "default"
        }
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
                                            <option value="Đã giao hàng">Đã giao hàng</option>
                                            <option value="Đang giao hàng">Đang giao hàng</option>
                                            <option value="Đang xử lý">Đang xử lý</option>
                                            <option value="Đã hủy">Đã hủy</option>
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
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="empty-table">
                                        Không tìm thấy đơn hàng nào
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="id-cell">{order.id}</td>
                                        <td>{order.customer}</td>
                                        <td>{order.date}</td>
                                        <td className="price-cell">{order.total.toLocaleString("vi-VN")} ₫</td>
                                        <td className="status-cell">
                                            <span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span>
                                        </td>
                                        <td className="actions-cell">
                                            <div className="dropdown">
                                                <button
                                                    className="button icon-only ghost"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        toggleDropdown(order.id)
                                                    }}
                                                >
                                                    <MoreHorizontal className="icon-small" />
                                                    <span className="sr-only">Mở menu</span>
                                                </button>
                                                {dropdownOpen === order.id && (
                                                    <div className="dropdown-menu">
                                                        <div className="dropdown-header">Thao tác</div>
                                                        <div className="dropdown-divider"></div>
                                                        <button className="dropdown-item" onClick={() => setViewOrderDetails(order)}>
                                                            <Eye className="icon-small" />
                                                            Xem chi tiết
                                                        </button>
                                                        <button className="dropdown-item">
                                                            <Download className="icon-small" />
                                                            Xuất hóa đơn
                                                        </button>
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
                        <button className="button outline small" disabled>
                            Trước
                        </button>
                        <button className="button outline small active">1</button>
                        <button className="button outline small">Sau</button>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {viewOrderDetails && (
                <div className="modal-overlay" onClick={() => setViewOrderDetails(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Chi tiết đơn hàng {viewOrderDetails.id}</h2>
                            <p className="modal-description">Thông tin chi tiết về đơn hàng</p>
                        </div>
                        <div className="modal-body">
                            <div className="order-info-grid">
                                <div className="order-info-section">
                                    <h3 className="section-title">Thông tin khách hàng</h3>
                                    <p className="section-text">{viewOrderDetails.customer}</p>
                                </div>
                                <div className="order-info-section">
                                    <h3 className="section-title">Ngày đặt hàng</h3>
                                    <p className="section-text">{viewOrderDetails.date}</p>
                                </div>
                            </div>

                            <div className="divider"></div>

                            <div className="order-info-section">
                                <h3 className="section-title">Địa chỉ giao hàng</h3>
                                <p className="section-text">{viewOrderDetails.address}</p>
                            </div>

                            <div className="order-info-section">
                                <h3 className="section-title">Phương thức thanh toán</h3>
                                <p className="section-text">{viewOrderDetails.payment}</p>
                            </div>

                            <div className="divider"></div>

                            <div className="order-info-section">
                                <h3 className="section-title">Trạng thái đơn hàng</h3>
                                <span className={`status-badge ${getStatusClass(viewOrderDetails.status)}`}>
                  {viewOrderDetails.status}
                </span>
                            </div>

                            <div className="order-info-section">
                                <h3 className="section-title">Tổng quan đơn hàng</h3>
                                <div className="order-summary">
                                    <div className="summary-row">
                                        <span>Số lượng sản phẩm:</span>
                                        <span>{viewOrderDetails.items}</span>
                                    </div>
                                    <div className="summary-row total">
                                        <span>Tổng tiền:</span>
                                        <span>{viewOrderDetails.total.toLocaleString("vi-VN")} ₫</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="button outline" onClick={() => setViewOrderDetails(null)}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default OrdersPage
