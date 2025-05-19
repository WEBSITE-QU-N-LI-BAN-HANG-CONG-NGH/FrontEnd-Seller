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

    // src/services/sellerService.js
    verifySellerRole: async () => {
        try {
            console.log('Đang kiểm tra vai trò seller...');

            // Tạo mảng các endpoints để thử
            const endpoints = [
                '/seller/verify-role',     // Endpoint chính từ backend
                '/api/v1/seller/verify-role', // Có thể cần prefix
                '/users/profile',          // Thử lấy profile và kiểm tra
                '/api/v1/users/profile'    // Có prefix
            ];

            // Thử lần lượt từng endpoint
            for (const endpoint of endpoints) {
                try {
                    console.log(`Thử gọi API: ${endpoint}`);
                    const response = await api.get(endpoint);
                    console.log(`Phản hồi từ ${endpoint}:`, response.data);

                    // Kiểm tra cấu trúc phản hồi để xác định có phải seller không
                    const responseData = response.data;

                    // Log chi tiết cấu trúc dữ liệu
                    console.log('responseData:', responseData);
                    console.log('responseData.data:', responseData.data);

                    if (endpoint.includes('verify-role')) {
                        // Nếu đây là API xác thực, kiểm tra trực tiếp kết quả
                        const isSeller =
                            (responseData.data && responseData.data.isSeller) ||
                            (responseData.isSeller);

                        console.log(`Endpoint ${endpoint} trả về isSeller:`, isSeller);

                        if (isSeller) {
                            return {
                                data: {
                                    data: { isSeller: true }
                                }
                            };
                        }
                    } else if (endpoint.includes('profile')) {
                        // Nếu là API profile, kiểm tra vai trò từ thông tin user
                        const userData = responseData.data || responseData;
                        const role = userData.role?.name || userData.role;
                        const isSeller =
                            role === 'SELLER' ||
                            (userData.roles && userData.roles.includes('SELLER'));

                        console.log(`Endpoint ${endpoint} trả về role:`, role);
                        console.log(`Xác định isSeller:`, isSeller);

                        if (isSeller) {
                            return {
                                data: {
                                    data: { isSeller: true }
                                }
                            };
                        }
                    }
                } catch (error) {
                    console.log(`Lỗi khi gọi ${endpoint}:`, error.message);
                    if (error.response) {
                        console.log(`Status code: ${error.response.status}`);
                        console.log(`Response data:`, error.response.data);
                    }
                }
            }

            // Nếu không có endpoint nào thành công, trả về kết quả mặc định
            console.log('Không xác định được vai trò seller từ các API');
            return {
                data: {
                    data: { isSeller: false }
                }
            };
        } catch (error) {
            console.error('Lỗi kiểm tra vai trò seller:', error);
            throw error;
        }
    }
};

export default sellerService;