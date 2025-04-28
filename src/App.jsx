import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "./components/layout/DashboardLayout.jsx"
import Dashboard from "./pages/dashboard/Dashboard.jsx"
import Product from "./pages/product/Product.jsx"
import AddProduct from "./pages/product/AddProduct.jsx"
import Order from "./pages/order/Order.jsx"
import Profile from "./pages/profile/Profile.jsx"
import "./styles/global.css"

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/dashboard"
                    element={
                        <DashboardLayout>
                            <Dashboard />
                        </DashboardLayout>
                    }
                />
                <Route
                    path="/products"
                    element={
                        <DashboardLayout>
                            <Product />
                        </DashboardLayout>
                    }
                />
                <Route
                    path="products/add"
                    element={
                        <DashboardLayout>
                            <AddProduct />
                        </DashboardLayout>
                    }
                />
                <Route
                    path="orders"
                    element={
                        <DashboardLayout>
                            <Order />
                        </DashboardLayout>
                    }
                />
                <Route
                    path="profile"
                    element={
                        <DashboardLayout>
                            <Profile />
                        </DashboardLayout>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    )
}

export default App
