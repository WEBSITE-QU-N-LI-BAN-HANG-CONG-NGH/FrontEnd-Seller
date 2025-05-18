import { SET_USER, LOGOUT, LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST } from "./ActionType";

const initialState = {
    loading: false,
    user: null,
    jwt: localStorage.getItem('jwt'),
    error: null
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return { ...state, loading: true, error: null };
        case LOGIN_SUCCESS:
            return { ...state, loading: false, jwt: action.payload, error: null };
        case LOGIN_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case SET_USER:
            return { ...state, user: action.payload, loading: false };
        case LOGOUT:
            return { ...initialState, jwt: null };
        default:
            return state;
    }
};