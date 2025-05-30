// src/pages/product/Product.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Download,
    Edit,
    MoreHorizontal,
    Plus,
    Search,
    SlidersHorizontal,
    Trash2,
    X,
    ChevronDown
} from "lucide-react";
import "../../styles/product/product.css";
import useProduct from "../../hooks/useProduct";
import { formatCurrency } from "../../utils/format.js";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import ConfirmModal from "../../components/features/ConfirmModal";

function Product() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [pageInput, setPageInput] = useState("");

    // Local filter state
    const [localFilters, setLocalFilters] = useState({
        category: '',
        subcategory: '',
        minPrice: '',
        maxPrice: '',
        status: 'all'
    });

    const {
        products,
        loading,
        error,
        pagination,
        filters,
        fetchProducts,
        deleteProduct,
        updateFilters,
        clearFilters,
        goToPage,
        nextPage,
        previousPage,
        resetState
    } = useProduct();

    // Fetch products when component mounts - only once
    useEffect(() => {
        fetchProducts();
    }, []); // Remove fetchProducts dependency

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== filters.search) {
                updateFilters({ search: searchQuery });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]); // Remove dependencies to prevent loops

    // Toggle dropdown menu
    const toggleDropdown = (e, productId) => {
        e.stopPropagation();
        if (dropdownOpen === productId) {
            setDropdownOpen(null);
        } else {
            setDropdownOpen(productId);
        }
    };

    // Handle delete button click
    const handleDeleteClick = (e, product) => {
        e.stopPropagation();
        setSelectedProduct(product);
        setDeleteModalOpen(true);
        setDropdownOpen(null);
    };

    // Handle confirm delete
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

    // Handle cancel delete
    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setSelectedProduct(null);
    };

    // Handle edit product
    const handleEditClick = (e, productId) => {
        e.stopPropagation();
        navigate(`/dashboard/products/edit/${productId}`);
        setDropdownOpen(null);
    };

    // Apply filters
    const handleApplyFilters = () => {
        const filtersToApply = {
            category: localFilters.category, subcategory: localFilters.subcategory,
            minPrice: localFilters.minPrice ? parseInt(localFilters.minPrice) : null,
            maxPrice: localFilters.maxPrice ? parseInt(localFilters.maxPrice) : null,
            status: localFilters.status
        };
        updateFilters(filtersToApply);
        setFilterDropdownOpen(false);
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

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.dropdown')) {
                setDropdownOpen(null);
            }
            if (!e.target.closest('.filter-dropdown-container')) {
                setFilterDropdownOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

<<<<<<< Updated upstream
    if (loading && products.length === 0) {
        return <LoadingSpinner />;
    }
=======
        // Handle delete button click
        const handleDeleteClick = (e, product) => {
            e.stopPropagation();
            setSelectedProduct(product);
            setDeleteModalOpen(true);
            setDropdownOpen(null);
        };

        // Handle confirm delete
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

        // Handle cancel delete
        const handleCancelDelete = () => {
            setDeleteModalOpen(false);
            setSelectedProduct(null);
        };

        // Handle edit product
        const handleEditClick = (e, productId) => {
            e.stopPropagation();
            navigate(`/dashboard/products/edit/${productId}`);
            setDropdownOpen(null);
        };

        // Apply filters
        const handleApplyFilters = () => {
            const filtersToApply = {
                topLevelCategory: localFilters.category,
                minPrice: localFilters.minPrice ? parseInt(localFilters.minPrice) : null,
                maxPrice: localFilters.maxPrice ? parseInt(localFilters.maxPrice) : null,
                status: localFilters.status
            };
            updateFilters(filtersToApply);
            setFilterDropdownOpen(false);
        };

        // Clear all filters
        const handleClearFilters = () => {
            setLocalFilters({
                category: '',
                minPrice: '',
                maxPrice: '',
                status: 'all'
            });
            setSearchQuery('');
            clearFilters();
            setFilterDropdownOpen(false);
        };

        // Generate page numbers to display
            const generatePageNumbers = () => {
            const pages = [];
            const totalPages = pagination.totalPages;
            const currentPage = pagination.currentPage;
    // Handle page input change
    const handlePageInputChange = (e) => {
        setPageInput(e.target.value);
    };

            if (totalPages <= 7) {
                // Show all pages if total is 7 or less
                for (let i = 0; i < totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Always show first page (0)
                pages.push(0);

                if (currentPage > 2) {
                    pages.push('...');
                }

                // Show pages around current page
                const startPage = Math.max(1, currentPage - 1);
                const endPage = Math.min(currentPage + 1, totalPages - 2);

                for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                }

                if (currentPage < totalPages - 3) {
                    pages.push('...');
                }
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
                // Always show last page
                if (totalPages > 1) {
                    pages.push(totalPages - 1);
                }
            }

            return pages;
        };

        // Close dropdowns when clicking outside
        useEffect(() => {
            const handleClickOutside = (e) => {
                if (!e.target.closest('.dropdown')) {
                    setDropdownOpen(null);
                }
            };
            document.addEventListener("click", handleClickOutside);
            return () => document.removeEventListener("click", handleClickOutside);
        }, []);

        if (loading && products.length === 0) {
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
>>>>>>> Stashed changes

    if (error) {
        return (
            <ErrorAlert
                message={error}
                onDismiss={() => resetState()}
            />
        );
    }

    // Get unique categories from products
    const categories = [...new Set(products.map(p => p.topLevelCategory).filter(Boolean))];

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
                    <h2 className="card-title">
                        Danh sách sản phẩm
                        <span className="product-count">({pagination.totalElements} sản phẩm)</span>
                    </h2>
                </div>
                <div className="card-content">
                    <div className="filters-product">
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
                            <div className="filter-dropdown-container">
                                    <div className="filter-dropdown">
                                        <div className="filter-dropdown-content">
                                            <div className="filter-group">
                                                <label>Danh mục</label>
                                                <select
                                                    value={localFilters.category}
                                                    onChange={(e) => setLocalFilters({...localFilters, category: e.target.value})}
                                                    className="filter-select"
                                                >
                                                    <option value="">Tất cả danh mục</option>
                                                    {categories.map(cat => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="filter-group">
                                                <label>Danh mục con</label>
                                                <select
                                                    value={localFilters.subcategory}
                                                    onChange={(e) => setLocalFilters({...localFilters, subcategory: e.target.value})}
                                                    className="filter-select"
                                                >
                                                    <option value="">Tất cả danh mục</option>
                                                    {categories.map(cat => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="filter-group">
                                                <label>Khoảng giá</label>
                                                <div className="price-range">
                                                    <input
                                                        type="number"
                                                        placeholder="Từ"
                                                        value={localFilters.minPrice}
                                                        onChange={(e) => setLocalFilters({...localFilters, minPrice: e.target.value})}
                                                        className="filter-input"
                                                    />
                                                    <span> - </span>
                                                    <input
                                                        type="number"
                                                        placeholder="Đến"
                                                        value={localFilters.maxPrice}
                                                        onChange={(e) => setLocalFilters({...localFilters, maxPrice: e.target.value})}
                                                        className="filter-input"
                                                    />
                                                </div>
                                            </div>

                                            <div className="filter-group">
                                                <label>Trạng thái</label>
                                                <select
                                                    value={localFilters.status}
                                                    onChange={(e) => setLocalFilters({...localFilters, status: e.target.value})}
                                                    className="filter-select"
                                                >
                                                    <option value="all">Tất cả</option>
                                                    <option value="inStock">Còn hàng</option>
                                                    <option value="outOfStock">Hết hàng</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="filter-dropdown-footer">
                                                <button
                                                    className="button primary small"
                                                    onClick={handleApplyFilters}
                                                >
                                                    Áp dụng
                                                </button>
                                    </div>
<<<<<<< Updated upstream
                                    </div>
                               
=======

>>>>>>> Stashed changes
                            </div>
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
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="empty-table">
                                        <LoadingSpinner size="small" />
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="empty-table">
                                        Không tìm thấy sản phẩm nào
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
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
                                        <td className="price-cell">
                                            <div>
                                                <div className="original-price">{formatCurrency(product.price)}</div>
                                                {product.discountPersent > 0 && (
                                                    <div className="discounted-price">
                                                        {formatCurrency(product.discountedPrice)}
                                                        <span className="discount-badge">-{product.discountPersent}%</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="stock-cell">{product.quantity}</td>
                                        <td className="status-cell">
                                                <span className={`status-badge ${product.quantity > 0 ? "active" : "inactive"}`}>
                                                    {product.quantity > 0 ? "Còn hàng" : "Hết hàng"}
                                                </span>
                                        </td>
                                        <td className="actions-cell">
                                            <div className="dropdown">
                                                <button
                                                    className="button-config icon-only ghost"
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

<<<<<<< Updated upstream
=======
                    {/* Pagination controls */}
>>>>>>> Stashed changes
                    {pagination.totalPages > 1 && (
                        <div className="pagination-container">
                            <div className="pagination">
                                <button
<<<<<<< Updated upstream
                                    className={`button-product outline small ${pagination.currentPage === 0 ? 'active' : ''}`}
                                    onClick={() => goToPage(0)}
                                    disabled={pagination.currentPage === 0}
                                >
                                    Trang đầu
                                </button>

                                <button
=======
>>>>>>> Stashed changes
                                    className="button outline small"
                                    disabled={!pagination.hasPrevious}
                                    onClick={previousPage}
                                >
<<<<<<< Updated upstream
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
=======
                                    Trước
                                </button>

                                {/* Page numbers */}
                                {generatePageNumbers().map((page, index) => (
                                    page === '...' ? (
                                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                                    ) : (
                                        <button
                                            key={page}
                                            className={`button outline small ${page === pagination.currentPage ? 'active' : ''}`}
                                            onClick={() => goToPage(page)}
                                        >
                                            {page + 1}
                                        </button>
                                    )
                                ))}
>>>>>>> Stashed changes

                                <button
                                    className="button outline small"
                                    disabled={!pagination.hasNext}
                                    onClick={nextPage}
                                >
<<<<<<< Updated upstream
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
                                Hiển thị {products.length} trên {pagination.totalElements || 0} sản phẩm
=======
                                    Sau
                                </button>
                            </div>

                           <div className="pagination-info">
                                Trang {pagination.currentPage + 1} / {pagination.totalPages}
                                <span className="separator">•</span>
                                Hiển thị {products.length} trên {pagination.totalElements} sản phẩm
>>>>>>> Stashed changes
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete confirmation modal */}
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