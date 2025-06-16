import { Routes, Route, Navigate } from "react-router-dom";
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
    return (
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
                            <EditProduct />
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

            {/* Redirect trang chủ và các route không khớp */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default App;