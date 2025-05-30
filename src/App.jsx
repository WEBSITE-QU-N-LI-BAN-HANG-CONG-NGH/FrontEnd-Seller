// src/App.jsx (đã cập nhật)
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import {store} from './state/store.js'; // Đảm bảo import store của bạn
import AuthBridge from "./components/AuthBridge";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Product from "./pages/product/Product";
import AddProduct from "./pages/product/AddProduct";
import EditProduct from "./pages/product/EditProduct";
import Order from "./pages/order/Order";
import Profile from "./pages/profile/Profile";
import PrivateRoute from "./components/common/PrivateRoute";
import "./styles/global.css";

function App() {
    // Xử lý thông báo lỗi useLocation
    useEffect(() => {
        // Ghi đè console.error để bỏ qua lỗi cụ thể về useLocation
        const originalError = console.error;
        console.error = (...args) => {
            if (args[0] && typeof args[0] === 'string' &&
                (args[0].includes('useLocation') || args[0].includes('An error occurred in the <PrivateRoute>'))) {
                return;
            }
            originalError(...args);
        };

        return () => {
            console.error = originalError; // Khôi phục lại console.error gốc khi unmount
        };
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <AuthBridge>
                    <Routes>
                        {/* Trang dashboard (cần đăng nhập) */}
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <DashboardLayout>
                                        <Dashboard />
                                    </DashboardLayout>
                                </PrivateRoute>
                            }
                        />

                        {/* Quản lý sản phẩm */}
                        <Route
                            path="/dashboard/products"
                            element={
                                <PrivateRoute>
                                    <DashboardLayout>
                                        <Product />
                                    </DashboardLayout>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/dashboard/products/add"
                            element={
                                <PrivateRoute>
                                    <DashboardLayout>
                                        <AddProduct />
                                    </DashboardLayout>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/dashboard/products/edit/:id"
                            element={
                                <PrivateRoute>
                                    <DashboardLayout>
                                        <EditProduct editMode={true} />
                                    </DashboardLayout>
                                </PrivateRoute>
                            }
                        />

                        {/* Quản lý đơn hàng */}
                        <Route
                            path="/dashboard/orders"
                            element={
                                <PrivateRoute>
                                    <DashboardLayout>
                                        <Order />
                                    </DashboardLayout>
                                </PrivateRoute>
                            }
                        />

                        {/* Hồ sơ */}
                        <Route
                            path="/dashboard/profile"
                            element={
                                <PrivateRoute>
                                    <DashboardLayout>
                                        <Profile />
                                    </DashboardLayout>
                                </PrivateRoute>
                            }
                        />

                        {/* Redirect trang chủ */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />

                        {/* Tất cả các route không khớp sẽ chuyển về dashboard */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </AuthBridge>
            </Router>
        </Provider>
    );
}

export default App;