/**
 * Các hàm tiện ích cho xác thực và xử lý token
 */

// Key thống nhất cho token trong localStorage
export const TOKEN_KEY = 'accessToken';

/**
 * Lấy token từ localStorage
 * @returns {string|null} JWT token hoặc null nếu không có
 */
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

/**
 * Lưu token vào localStorage
 * @param {string} token - JWT token cần lưu
 */
export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Xóa token khỏi localStorage
 */
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

/**
 * Kiểm tra token có hợp lệ hoặc hết hạn không dựa vào thời gian hết hạn
 * @param {string} token - JWT token cần kiểm tra
 * @returns {boolean} true nếu token còn hạn, false nếu token không hợp lệ hoặc hết hạn
 */
export const isTokenValid = (token) => {
    if (!token) return false;

    try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;

        const payload = JSON.parse(atob(parts[1]));
        const expirationTime = payload.exp * 1000; // Chuyển thành milliseconds
        const currentTime = Date.now();

        return currentTime < expirationTime;
    } catch (error) {
        console.error('Lỗi khi kiểm tra token:', error);
        return false;
    }
};

/**
 * Trích xuất thông tin từ JWT token
 * @param {string} token - JWT token cần trích xuất
 * @returns {object|null} Payload của JWT hoặc null nếu không thể trích xuất
 */
export const decodeToken = (token) => {
    if (!token) return null;

    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        return JSON.parse(atob(parts[1]));
    } catch (error) {
        console.error('Lỗi khi decode token:', error);
        return null;
    }
};

/**
 * Kiểm tra xem người dùng có phải là seller không từ JWT token
 * @param {string} token - JWT token cần kiểm tra
 * @returns {boolean} true nếu người dùng có quyền seller, ngược lại là false
 */
export const isSellerFromToken = (token) => {
    try {
        const payload = decodeToken(token);
        if (!payload) return false;

        // Kiểm tra vai trò từ payload
        const roles = payload.roles || payload.authorities || [];
        if (Array.isArray(roles)) {
            return roles.includes('SELLER') || roles.includes('ROLE_SELLER');
        }

        // Trường hợp role là string
        return payload.role === 'SELLER' || payload.role === 'ROLE_SELLER';
    } catch (error) {
        console.error('Lỗi khi kiểm tra quyền seller từ token:', error);
        return false;
    }
};