// src/services/sellerService.js
import axiosClient from './axiosClient';

const sellerService = {
    getProfile: () => {
        return axiosClient.get('/seller/profile');
    },

    updateProfile: (data) => {
        return axiosClient.put('/seller/profile', data);
    },

    getShopInfo: () => {
        return axiosClient.get('/seller/profile/shop');
    },

    updateShopInfo: (data) => {
        return axiosClient.put('/seller/profile/shop', data);
    },

    getVerificationStatus: () => {
        return axiosClient.get('/seller/profile/verification-status');
    },

    verifySellerRole: () => {
        return axiosClient.get('/seller/verify-role');
    },

    getSellerStatus: () => {
        return axiosClient.get('/seller/status');
    }
};

export default sellerService;