// src/pages/product/Product.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Edit, MoreHorizontal, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import "../../styles/product/product.css";
import useProduct from "../../hooks/useProduct";
import { formatCurrency } from "../../utils/formatters";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import ConfirmModal from "../../components/feature/ConfirmModal";

function Product() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const {
        products,
        loading,
        error,
        fetchProducts,
        deleteProduct,
        resetState
    } = useProduct();

    // Lấy danh sách sản phẩm khi component mount
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Lọc sản phẩm theo từ khóa tìm kiếm
    const filteredProducts = products.filter(
        (product) =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.category?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.id + '').toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Mở/đóng dropdown
    const toggleDropdown = (e, productId) => {
        e.stopPropagation();
        if (dropdownOpen === productId) {
            setDropdownOpen(null);
        } else {
            setDropdownOpen(productId);
        }
    };

    // Xử lý ấn nút xóa
    const handleDeleteClick = (e, product) => {
        e.stopPropagation();
        setSelectedProduct(product);
        setDeleteModalOpen(true);
        setDropdownOpen(null);
    };

    // Xử lý xác nhận xóa
    const handleConfirmDelete = async () => {
        if (selectedProduct) {
            try {
                await deleteProduct(selectedProduct.id);
                setDeleteModalOpen(false);
                setSelectedProduct(null);
            } catch (err) {
                console.error("Lỗi khi xóa sản phẩm:", err);
            }
        }
    };

    // Xử lý hủy xóa
    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setSelectedProduct(null);
    };

    // Xử lý chỉnh sửa sản phẩm
    const handleEditClick = (e, productId) => {
        e.stopPropagation();
        navigate(`/dashboard/products/edit/${productId}`);
        setDropdownOpen(null);
    };

    // Click bên ngoài để đóng dropdown
    useEffect(() => {
        const handleClickOutside = () => setDropdownOpen(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <ErrorAlert
                message={error}
                onDismiss={() => resetState()}
            />
        );
    }

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
                                                    src={product.imageUrls && product.imageUrls.length > 0
                                                        ? product.imageUrls[0].downloadUrl
                                                        : "/placeholder.svg"}
                                                    alt={product.title}
                                                    className="product-thumbnail"
                                                />
                                                <span className="product-name">{product.title}</span>
                                            </div>
                                        </td>
                                        <td>{product.topLevelCategory || 'Chưa phân loại'}</td>
                                        <td className="price-cell">{formatCurrency(product.price)}</td>
                                        <td className="stock-cell">{product.quantity}</td>
                                        <td className="status-cell">
                                            <span className={`status-badge ${product.quantity > 0 ? "active" : "inactive"}`}>
                                                {product.quantity > 0 ? "Đang bán" : "Hết hàng"}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <div className="dropdown">
                                                <button
                                                    className="button icon-only ghost"
                                                    onClick={(e) => toggleDropdown(e, product.id)}
                                                >
                                                    <MoreHorizontal className="icon-small" />
                                                    <span className="sr-only">Mở menu</span>
                                                </button>
                                                {dropdownOpen === product.id && (
                                                    <div className="dropdown-menu">
                                                        <div className="dropdown-header">Thao tác</div>
                                                        <div className="dropdown-divider"></div>
                                                        <button
                                                            className="dropdown-item"
                                                            onClick={(e) => handleEditClick(e, product.id)}
                                                        >
                                                            <Edit className="icon-small" />
                                                            Chỉnh sửa
                                                        </button>
                                                        <button
                                                            className="dropdown-item danger"
                                                            onClick={(e) => handleDeleteClick(e, product)}
                                                        >
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

            {/* Modal xác nhận xóa */}
            {deleteModalOpen && selectedProduct && (
                <ConfirmModal
                    title="Xác nhận xóa sản phẩm"
                    message={`Bạn có chắc chắn muốn xóa sản phẩm "${selectedProduct.title}" không? Hành động này không thể hoàn tác.`}
                    confirmText="Xóa"
                    cancelText="Hủy"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    variant="danger"
                />
            )}
        </div>
    );
}

export default Product;