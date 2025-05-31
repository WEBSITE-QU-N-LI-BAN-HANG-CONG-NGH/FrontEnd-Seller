// src/services/productService.js
import api from '../config/Api.js';

const productService = {

    getSellerProducts: (params = {}) => {
        const {
            page = 0,
            size = 10,
            sortBy = 'createdAt',
            sortDir = 'desc',
            search,
            category,
            subcategory,
            minPrice,
            maxPrice,
            status
        } = params;

        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sortBy,
            sortDir
        });

        // Add filters to query params
        if (search) queryParams.append('keyword', search);
        if (category) queryParams.append('topLevelCategory', category);
        if (subcategory) queryParams.append('secondLevelCategory', subcategory);
        if (minPrice) queryParams.append('minPrice', minPrice.toString());
        if (maxPrice) queryParams.append('maxPrice', maxPrice.toString());
        if (status && status !== 'all') queryParams.append('status', status);

        return api.get(`/seller/products/list-products?${queryParams}`);
    },

    getProductDetail: (id) => {
        return api.get(`/seller/products/${id}`);
    },

    createProduct: (data) => {
        return api.post('/seller/products/create', data);
    },

    updateProduct: (id, data) => {
        return api.put(`/seller/products/${id}/update`, data);
    },

    deleteProduct: (id) => {
        return api.delete(`/seller/products/${id}/delete`);
    },

    getProductStats: () => {
        return api.get('/seller/products/stats');
    },

    uploadProductImage: (productId, imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);

        return api.post(`/images/upload/${productId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    deleteProductImage: (imageId) => {
        return api.delete(`/images/delete/${imageId}`);
    },

    getSellerCategories: () => {
        return api.get('/seller/products/categories');
    },

    getFilterStats: () => {
        return api.get('/seller/products/filter-stats');
    },
};

export default productService;