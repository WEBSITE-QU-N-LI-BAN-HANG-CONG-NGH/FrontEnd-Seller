// src/utils/jwtHelper.js
/**
 * Các hàm tiện ích để xử lý JWT token
 */

// Trích xuất thông tin từ JWT token
export const parseJwtToken = (token) => {
    if (!token) return null;

    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        return JSON.parse(atob(parts[1]));
    } catch (e) {
        console.error('Lỗi khi phân tích JWT token:', e);
        return null;
    }
};

// Kiểm tra token có quyền SELLER không
export const hasSellerRole = (token) => {
    const payload = parseJwtToken(token);
    if (!payload) return false;

    // Kiểm tra nhiều trường hợp cấu trúc khác nhau của payload
    if (payload.roles && Array.isArray(payload.roles)) {
        return payload.roles.includes('SELLER') || payload.roles.includes('ROLE_SELLER');
    }

    if (payload.authorities && Array.isArray(payload.authorities)) {
        return payload.authorities.some(auth => {
            if (typeof auth === 'string') {
                return auth === 'SELLER' || auth === 'ROLE_SELLER';
            }
            return auth.authority === 'SELLER' || auth.authority === 'ROLE_SELLER';
        });
    }

    return payload.role === 'SELLER' || payload.role === 'ROLE_SELLER';
};

// Kiểm tra token còn hạn không
export const isTokenExpired = (token) => {
    const payload = parseJwtToken(token);
    if (!payload || !payload.exp) return true;

    // Convert exp (segundos) en milisegundos y comparar con la hora actual
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();

    return currentTime >= expirationTime;
};

// Tạo thông tin người dùng cơ bản từ JWT token
export const createUserFromToken = (token) => {
    const payload = parseJwtToken(token);
    if (!payload) return null;

    return {
        id: payload.id || payload.userId || null,
        email: payload.sub || payload.email || null,
        firstName: payload.firstName || payload.given_name || "",
        lastName: payload.lastName || payload.family_name || "",
        role: hasSellerRole(token) ? "SELLER" : "CUSTOMER"
    };
};

// Lấy thời gian hết hạn của token (dạng timestamp)
export const getTokenExpirationTime = (token) => {
    const payload = parseJwtToken(token);
    if (!payload || !payload.exp) return null;

    return payload.exp * 1000; // Chuyển sang milliseconds
};