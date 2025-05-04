// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Product from "./pages/product/Product";
import AddProduct from "./pages/product/AddProduct";
import Order from "./pages/order/Order";
import Profile from "./pages/profile/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/common/NotFound";
import PrivateRoute from "./components/common/PrivateRoute";
import "./styles/global.css";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Trang login và đăng ký */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

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
                                    <AddProduct editMode={true} />
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

                    {/* Trang 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;