import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import { authReducer } from './auth/Reducer';

// Kết hợp tất cả reducers
const rootReducer = combineReducers({
    auth: authReducer,
    // Thêm các reducers khác nếu cần
});

// Tạo store với middleware thunk để hỗ trợ async actions
export const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
);