// src/services/productService.js
import axiosClient from './axiosClient';

const productService = {
    getSellerProducts: () => {
        return axiosClient.get('/seller/products/list-products');
    },

    getProductDetail: (id) => {
        return axiosClient.get(`/seller/products/${id}`);
    },

    createProduct: (data) => {
        return axiosClient.post('/seller/products/create', data);
    },

    updateProduct: (id, data) => {
        return axiosClient.put(`/seller/products/${id}/update`, data);
    },

    deleteProduct: (id) => {
        return axiosClient.delete(`/seller/products/${id}/delete`);
    },

    getProductStats: () => {
        return axiosClient.get('/seller/products/stats');
    },

    uploadProductImage: (productId, imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        return axiosClient.post(`/images/upload/${productId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    deleteProductImage: (imageId) => {
        return axiosClient.delete(`/images/delete/${imageId}`);
    }
};

export default productService;