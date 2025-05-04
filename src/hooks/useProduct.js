// src/hooks/useProduct.js
import { useState, useCallback } from 'react';
import productService from '../services/productService';

const useProduct = () => {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Lấy danh sách sản phẩm
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await productService.getSellerProducts();
            setProducts(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy danh sách sản phẩm');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Lấy thông tin chi tiết sản phẩm
    const fetchProductDetail = useCallback(async (productId) => {
        setLoading(true);
        try {
            const response = await productService.getProductDetail(productId);
            setProduct(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lấy thông tin sản phẩm');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Tạo sản phẩm mới
    const createProduct = useCallback(async (productData) => {
        setLoading(true);
        try {
            const response = await productService.createProduct(productData);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tạo sản phẩm');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Cập nhật sản phẩm
    const updateProduct = useCallback(async (productId, productData) => {
        setLoading(true);
        try {
            const response = await productService.updateProduct(productId, productData);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể cập nhật sản phẩm');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Xóa sản phẩm
    const deleteProduct = useCallback(async (productId) => {
        setLoading(true);
        try {
            await productService.deleteProduct(productId);
            setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể xóa sản phẩm');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Upload hình ảnh sản phẩm
    const uploadProductImage = useCallback(async (productId, imageFile) => {
        setLoading(true);
        try {
            const response = await productService.uploadProductImage(productId, imageFile);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải lên hình ảnh');
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
        products,
        product,
        loading,
        error,
        fetchProducts,
        fetchProductDetail,
        createProduct,
        updateProduct,
        deleteProduct,
        uploadProductImage,
        resetState
    };
};

export default useProduct;