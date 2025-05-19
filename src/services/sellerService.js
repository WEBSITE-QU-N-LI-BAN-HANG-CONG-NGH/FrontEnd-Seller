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

    verifySellerRole: async () => {
        try {
            // Sử dụng endpoint không có prefix
            const response = await api.get('/seller/verify-role');

            // Điều chỉnh cách xử lý dữ liệu phản hồi
            const responseData = response.data;
            const isSeller = responseData.data &&
                (responseData.data.isSeller || responseData.data.seller);

            return {
                data: {
                    data: { isSeller }
                }
            };
        } catch (error) {
            console.error('Lỗi kiểm tra quyền seller:', error);

            // Thử phương án dự phòng - lấy thông tin từ profile
            try {
                const profileResponse = await api.get('/users/profile');
                const userData = profileResponse.data;
                const isSeller = userData.role === "SELLER";

                return {
                    data: {
                        data: { isSeller }
                    }
                };
            } catch (profileError) {
                console.error('Không thể lấy thông tin profile:', profileError);
                throw error;
            }
        }
    }
};

export default sellerService;