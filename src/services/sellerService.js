// src/services/sellerService.js
import api from '../config/Api.js';

const sellerService = {
    getProfile: () => {
        return api.get('/seller/profile');
    },

    updateProfile: (data) => {
        return api.put('/seller/profile', data);
    },

    getShopInfo: () => {
        return api.get('/seller/profile/shop');
    },

    updateShopInfo: (data) => {
        return api.put('/seller/profile/shop', data);
    },

    getVerificationStatus: () => {
        return api.get('/seller/profile/verification-status');
    },

    verifySellerRole: () => {
        return api.get('/seller/verify-role');
    },

    getSellerStatus: () => {
        return api.get('/seller/status');
    }
};

export default sellerService;