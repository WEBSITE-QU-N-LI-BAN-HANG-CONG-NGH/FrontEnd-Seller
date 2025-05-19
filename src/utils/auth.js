/**
 * Các hàm tiện ích cho xác thực và xử lý token
 */

// Key thống nhất cho token trong localStorage
export const TOKEN_KEY = 'jwt';

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
        const parts = token.split('.');
        if (parts.length !== 3) return false;

        const payload = JSON.parse(atob(parts[1]));
        console.log('JWT payload:', payload);

        // In ra chi tiết để debug
        if (payload.roles) console.log('roles từ payload:', payload.roles);
        if (payload.role) console.log('role từ payload:', payload.role);
        if (payload.authorities) console.log('authorities từ payload:', payload.authorities);

        // Kiểm tra vai trò từ payload
        // Trường hợp roles là array
        if (payload.roles && Array.isArray(payload.roles)) {
            if (payload.roles.includes('SELLER') || payload.roles.includes('ROLE_SELLER')) {
                console.log('Tìm thấy SELLER trong mảng roles');
                return true;
            }
        }

        // Trường hợp role là string
        if (payload.role === 'SELLER' || payload.role === 'ROLE_SELLER') {
            console.log('Tìm thấy SELLER trong role string');
            return true;
        }

        // Trường hợp authorities là array của objects
        if (payload.authorities && Array.isArray(payload.authorities)) {
            for (const auth of payload.authorities) {
                if (
                    (typeof auth === 'string' && (auth === 'SELLER' || auth === 'ROLE_SELLER')) ||
                    (auth.authority && (auth.authority === 'SELLER' || auth.authority === 'ROLE_SELLER'))
                ) {
                    console.log('Tìm thấy SELLER trong authorities');
                    return true;
                }
            }
        }

        console.log('Không tìm thấy quyền SELLER trong token');
        return false;
    } catch (e) {
        console.error('Lỗi khi phân tích JWT:', e);
        return false;
    }
};