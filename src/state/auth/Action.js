import axios from 'axios';
import { SET_USER, LOGOUT, LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST } from "./ActionType";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const urlCustomer = import.meta.env.VITE_CUSTOMER_URL || 'http://localhost:5173';

// API config
const API_URL = `${BACKEND_URL}/api/v1`; // Điều chỉnh theo URL API của bạn

// Action để thiết lập thông tin người dùng đã đăng nhập
export const loginSuccess = (token) => {
    return {
        type: LOGIN_SUCCESS,
        payload: token
    };
};

// Action để lấy thông tin người dùng
export const getUser = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get(`${API_URL}/users/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.data) {
            dispatch({
                type: SET_USER,
                payload: response.data
            });
            return response.data;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        // Nếu lỗi 401 (Unauthorized), đăng xuất người dùng
        if (error.response && error.response.status === 401) {
            dispatch(logout());
        }
        throw error;
    }
};

// Action đăng xuất
export const logout = () => (dispatch) => {
    localStorage.removeItem('jwt');
    dispatch({
        type: LOGOUT
    });
    // Chuyển hướng về ứng dụng customer
    window.location.href = urlCustomer;
};