// src/services/productService.js
import api from '../config/Api.js';

const productService = {
    getSellerProducts: () => {
        return api.get('/seller/products/list-products');
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
    }
};

export default productService;