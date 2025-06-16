// src/hooks/useProduct.js
import { useState, useCallback } from 'react';
import productService from '../services/productService';

const useProduct = () => {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState({
        topLevel: [],
        secondLevel: {}
    });

    // Pagination state
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

    // Filter state
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        subcategory: '',
        minPrice: null,
        maxPrice: null,
        status: 'all'
    });

    const fetchCategories = useCallback(async () => {
        try {
            const response = await productService.getSellerCategories();
            setCategories(response.data);
            return response.data;
        } catch (err) {
            console.error('Error fetching categories:', err);
            return { topLevel: [], secondLevel: {} };
        }
    }, []);

    const fetchProducts = useCallback(async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc', currentFilters = null) => {
        setLoading(true);
        try {
            const filtersToUse = currentFilters || filters;
            const response = await productService.getSellerProducts({
                page,
                size,
                sortBy,
                sortDir,
                search: filtersToUse.search,
                category: filtersToUse.category,
                subcategory: filtersToUse.subcategory,
                minPrice: filtersToUse.minPrice,
                maxPrice: filtersToUse.maxPrice,
                status: filtersToUse.status
            });

            const data = response.data;
            setProducts(data.products || []);

            const paginationData = data.pagination;
            setPagination({
                currentPage: paginationData.currentPage,
                totalPages: paginationData.totalPages,
                totalElements: paginationData.totalElements,
                hasNext: paginationData.hasNext,
                hasPrevious: paginationData.hasPrevious,
                pageSize: paginationData.pageSize,
                isFirst: paginationData.isFirst,
                isLast: paginationData.isLast
            });

            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy danh sách sản phẩm');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []); // Remove dependencies to prevent loops

    // Add getProductById method
    const getProductById = useCallback(async (productId) => {
        setLoading(true);
        try {
            const response = await productService.getProductById(productId);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy thông tin sản phẩm');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Fix updateFilters to use current filters state
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => {
            const updatedFilters = { ...prev, ...newFilters };
            // Call fetchProducts with updated filters
            fetchProducts(0, pagination.pageSize, 'createdAt', 'desc', updatedFilters);
            return updatedFilters;
        });
    }, [fetchProducts, pagination.pageSize]);

    // Clear filters
    const clearFilters = useCallback(() => {
        const defaultFilters = {
            search: '',
            category: '',
            minPrice: null,
            maxPrice: null,
            status: 'all'
        };
        setFilters(defaultFilters);
        fetchProducts(0, pagination.pageSize, 'createdAt', 'desc', defaultFilters);
    }, [fetchProducts, pagination.pageSize]);

    // Navigate to specific page
    const goToPage = useCallback((page) => {
        console.log('Going to page:', page);
        fetchProducts(page, pagination.pageSize, 'createdAt', 'desc', filters);
    }, [fetchProducts, pagination.pageSize, filters]);

    // Navigate to next page
    const nextPage = useCallback(() => {
        console.log('Next page clicked, hasNext:', pagination.hasNext);
        if (pagination.hasNext) {
            goToPage(pagination.currentPage + 1);
        }
    }, [goToPage, pagination.hasNext, pagination.currentPage]);

    // Navigate to previous page
    const previousPage = useCallback(() => {
        console.log('Previous page clicked, hasPrevious:', pagination.hasPrevious);
        if (pagination.hasPrevious) {
            goToPage(pagination.currentPage - 1);
        }
    }, [goToPage, pagination.hasPrevious, pagination.currentPage]);

    // Fetch product detail
    const fetchProductDetail = useCallback(async (productId) => {
        setLoading(true);
        try {
            const response = await productService.getProductDetail(productId);
            setProduct(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy thông tin sản phẩm');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Create product
    const createProduct = useCallback(async (productData) => {
        setLoading(true);
        try {
            const response = await productService.createProduct(productData);
            // Refresh current page after creating
            await fetchProducts(0, pagination.pageSize); // Go to first page to see new product
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tạo sản phẩm');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchProducts, pagination.pageSize]);

    // Update product
    const updateProduct = useCallback(async (productId, productData) => {
        setLoading(true);
        try {
            const response = await productService.updateProduct(productId, productData);
            // Refresh current page after updating
            await fetchProducts(pagination.currentPage, pagination.pageSize);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể cập nhật sản phẩm');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchProducts, pagination.currentPage, pagination.pageSize]);

    // Delete product
    const deleteProduct = useCallback(async (productId) => {
        setLoading(true);
        try {
            await productService.deleteProduct(productId);

            // Check if we need to go to previous page after deletion
            const remainingOnPage = products.length - 1;
            const targetPage = remainingOnPage === 0 && pagination.currentPage > 0
                ? pagination.currentPage - 1
                : pagination.currentPage;

            await fetchProducts(targetPage, pagination.pageSize);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể xóa sản phẩm');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [products.length, pagination.currentPage, pagination.pageSize, fetchProducts]);

    // Upload product image
    const uploadProductImage = useCallback(async (productId, imageFile) => {
        setLoading(true);
        try {
            const response = await productService.uploadProductImage(productId, imageFile);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải lên hình ảnh');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Get product statistics
    const getProductStats = useCallback(async () => {
        setLoading(true);
        try {
            const response = await productService.getProductStats();
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy thống kê sản phẩm');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Reset state
    const resetState = useCallback(() => {
        setError(null);
    }, []);

    return {
        products,
        product,
        loading,
        error,
        pagination,
        filters,
        categories,
        fetchProducts,
        fetchProductDetail,
        fetchCategories,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        uploadProductImage,
        getProductStats,
        updateFilters,
        clearFilters,
        goToPage,
        nextPage,
        previousPage,
        resetState
    };
};

export default useProduct;