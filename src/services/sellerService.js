// src/services/sellerService.js
import api, { fetchWithRetry } from '../config/Api.js';

const sellerService = {
    // Hàm xác thực quyền seller mà không cần gọi API
    verifySellerRoleFromToken: () => {
        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('jwt');
            if (!token) return false;

            // Phân tích JWT token
            const parts = token.split('.');
            if (parts.length !== 3) return false;

            const payload = JSON.parse(atob(parts[1]));

            // Kiểm tra vai trò từ payload
            if (payload.roles && Array.isArray(payload.roles)) {
                return payload.roles.includes('SELLER') || payload.roles.includes('ROLE_SELLER');
            }

            // Trường hợp role là string
            return payload.role === 'SELLER' || payload.role === 'ROLE_SELLER';
        } catch (e) {
            console.error('Lỗi khi phân tích JWT:', e);
            return false;
        }
    },

    // Hàm gọi API xác thực vai trò với cơ chế retry khi bị rate limit
    verifySellerRole: async () => {
        try {
            // Kiểm tra thông qua JWT trước
            const isSellerFromToken = sellerService.verifySellerRoleFromToken();
            if (isSellerFromToken) {
                console.log('Xác thực SELLER thành công qua JWT token');
                return {
                    data: {
                        data: { isSeller: true }
                    }
                };
            }

            // Nếu JWT không xác nhận được, thử gọi API
            console.log('Không xác thực được qua JWT, gọi API...');
            const response = await fetchWithRetry(api.get, '/seller/verify-role');

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

            // Kiểm tra lại JWT khi API bị lỗi
            const isSellerFromToken = sellerService.verifySellerRoleFromToken();
            if (isSellerFromToken) {
                return {
                    data: {
                        data: { isSeller: true }
                    }
                };
            }

            // Thử phương án dự phòng - lấy thông tin từ profile
            try {
                const profileResponse = await fetchWithRetry(api.get, '/users/profile');
                const userData = profileResponse.data;
                const isSeller = userData.role === "SELLER";

                return {
                    data: {
                        data: { isSeller }
                    }
                };
            } catch (profileError) {
                // Nếu tất cả các cách đều thất bại, ném lỗi
                console.error('Không thể xác thực quyền seller:', profileError);
                throw error;
            }
        }
    },

    getProfile: () => {
        return fetchWithRetry(api.get, '/seller/profile');
    },

    updateProfile: (data) => {
        return api.put('/seller/profile', data);
    },

    getShopInfo: () => {
        return fetchWithRetry(api.get, '/seller/profile/shop');
    },

    updateShopInfo: (data) => {
        return api.put('/seller/profile/shop', data);
    },

    getVerificationStatus: () => {
        return fetchWithRetry(api.get, '/seller/profile/verification-status');
    }
};

export default sellerService;