"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Download, Edit, MoreHorizontal, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react"
import "../../styles/product/product.css"

// Sample product data
const products = [
    {
        id: "PROD-1",
        name: "Laptop Gaming Asus ROG Strix G15",
        category: "Laptop",
        price: 25990000,
        stock: 15,
        status: "Đang bán",
        image: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "PROD-2",
        name: "Điện thoại iPhone 14 Pro Max",
        category: "Điện thoại",
        price: 29990000,
        stock: 8,
        status: "Đang bán",
        image: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "PROD-3",
        name: "Tai nghe Bluetooth Apple AirPods Pro",
        category: "Phụ kiện",
        price: 4990000,
        stock: 25,
        status: "Đang bán",
        image: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "PROD-4",
        name: 'Màn hình Gaming LG UltraGear 27"',
        category: "Màn hình",
        price: 8990000,
        stock: 5,
        status: "Đang bán",
        image: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "PROD-5",
        name: "Bàn phím cơ Logitech G Pro X",
        category: "Phụ kiện",
        price: 2990000,
        stock: 0,
        status: "Hết hàng",
        image: "/placeholder.svg?height=40&width=40",
    },
]

function ProductsPage() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [dropdownOpen, setDropdownOpen] = useState(null)

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.id.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const toggleDropdown = (productId) => {
        if (dropdownOpen === productId) {
            setDropdownOpen(null)
        } else {
            setDropdownOpen(productId)
        }
    }

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => setDropdownOpen(null)
        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    }, [])

    return (
        <div className="products-page">
            <div className="page-header">
                <h1 className="page-title">Quản lý sản phẩm</h1>
                <button className="button primary" onClick={() => navigate("/dashboard/products/add")}>
                    <Plus className="icon-small" />
                    Thêm sản phẩm
                </button>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Danh sách sản phẩm</h2>
                    <p className="card-description">Quản lý tất cả sản phẩm trong cửa hàng của bạn</p>
                </div>
                <div className="card-content">
                    <div className="filters">
                        <div className="search-container">
                            <Search className="search-icon" />
                            <input
                                type="search"
                                className="search-input"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="filter-actions">
                            <button className="button outline small">
                                <SlidersHorizontal className="icon-small" />
                                Lọc
                            </button>
                            <button className="button outline small">
                                <Download className="icon-small" />
                                Xuất
                            </button>
                        </div>
                    </div>

                    <div className="products-table-container">
                        <table className="products-table">
                            <thead>
                            <tr>
                                <th className="id-column">Mã SP</th>
                                <th className="product-column">Sản phẩm</th>
                                <th>Danh mục</th>
                                <th className="price-column">Giá</th>
                                <th className="stock-column">Tồn kho</th>
                                <th className="status-column">Trạng thái</th>
                                <th className="actions-column">Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="empty-table">
                                        Không tìm thấy sản phẩm nào
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td className="id-cell">{product.id}</td>
                                        <td>
                                            <div className="product-info">
                                                <img
                                                    src={product.image || "/placeholder.svg"}
                                                    alt={product.name}
                                                    className="product-thumbnail"
                                                />
                                                <span className="product-name">{product.name}</span>
                                            </div>
                                        </td>
                                        <td>{product.category}</td>
                                        <td className="price-cell">{product.price.toLocaleString("vi-VN")} ₫</td>
                                        <td className="stock-cell">{product.stock}</td>
                                        <td className="status-cell">
                        <span className={`status-badge ${product.status === "Đang bán" ? "active" : "inactive"}`}>
                          {product.status}
                        </span>
                                        </td>
                                        <td className="actions-cell">
                                            <div className="dropdown">
                                                <button
                                                    className="button icon-only ghost"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        toggleDropdown(product.id)
                                                    }}
                                                >
                                                    <MoreHorizontal className="icon-small" />
                                                    <span className="sr-only">Mở menu</span>
                                                </button>
                                                {dropdownOpen === product.id && (
                                                    <div className="dropdown-menu">
                                                        <div className="dropdown-header">Thao tác</div>
                                                        <div className="dropdown-divider"></div>
                                                        <button className="dropdown-item">
                                                            <Edit className="icon-small" />
                                                            Chỉnh sửa
                                                        </button>
                                                        <button className="dropdown-item danger">
                                                            <Trash2 className="icon-small" />
                                                            Xóa
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
        </div>
    )
}

export default ProductsPage
