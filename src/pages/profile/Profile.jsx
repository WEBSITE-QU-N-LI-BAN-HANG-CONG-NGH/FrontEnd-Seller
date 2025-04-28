"use client"

import { useState } from "react"
import { AlertCircle, Building, Camera, CreditCard, Lock, Mail, MapPin, Phone, Save, User } from "lucide-react"
import "../../styles/profile/profile.css"


function Profile() {
    const [isEditing, setIsEditing] = useState(false)
    const [activeTab, setActiveTab] = useState("profile")

    return (
        <div className="profile-page">
            <h1 className="page-title">Hồ sơ</h1>
            <p className="page-description">Quản lý thông tin cửa hàng và tài khoản của bạn</p>

            <div className="tabs">
                <div className="tabs-list">
                    <button
                        className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
                        onClick={() => setActiveTab("profile")}
                    >
                        Thông tin cửa hàng
                    </button>
                    <button
                        className={`tab-button ${activeTab === "account" ? "active" : ""}`}
                        onClick={() => setActiveTab("account")}
                    >
                        Tài khoản
                    </button>
                    <button
                        className={`tab-button ${activeTab === "payment" ? "active" : ""}`}
                        onClick={() => setActiveTab("payment")}
                    >
                        VNPay
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === "profile" && (
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Thông tin cửa hàng</h2>
                                <p className="card-description">Quản lý thông tin cửa hàng của bạn hiển thị cho khách hàng</p>
                            </div>
                            <div className="card-content">
                                <div className="store-info">
                                    <div className="store-logo">
                                        <div className="logo-container">
                                            <img src="/placeholder.svg?height=128&width=128" alt="Store logo" className="logo-image" />
                                            <button className="logo-edit-button" disabled={!isEditing}>
                                                <Camera className="icon-small" />
                                                <span className="sr-only">Thay đổi logo</span>
                                            </button>
                                        </div>
                                        <div className="logo-info">
                                            <h3 className="logo-title">Logo cửa hàng</h3>
                                            <p className="logo-description">PNG hoặc JPG. Tối đa 1MB</p>
                                        </div>
                                    </div>

                                    <div className="store-details">
                                        <div className="form-group">
                                            <label htmlFor="store-name" className="form-label">
                                                Tên cửa hàng
                                            </label>
                                            <input id="store-name" className="form-input" defaultValue="TechShop" disabled={!isEditing} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="store-description" className="form-label">
                                                Mô tả cửa hàng
                                            </label>
                                            <textarea
                                                id="store-description"
                                                className="form-textarea"
                                                defaultValue="Cửa hàng chuyên cung cấp các sản phẩm công nghệ chính hãng với giá tốt nhất thị trường."
                                                disabled={!isEditing}
                                            ></textarea>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="store-website" className="form-label">
                                                Website
                                            </label>
                                            <input
                                                id="store-website"
                                                className="form-input"
                                                defaultValue="https://techshop.vn"
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="separator"></div>

                                <div className="contact-info">
                                    <h3 className="section-title">Thông tin liên hệ</h3>

                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="contact-email" className="form-label">
                                                Email liên hệ
                                            </label>
                                            <div className="input-with-icon">
                                                <div className="input-icon">
                                                    <Mail className="icon-small" />
                                                </div>
                                                <input
                                                    id="contact-email"
                                                    className="form-input with-icon"
                                                    defaultValue="contact@techshop.vn"
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="contact-phone" className="form-label">
                                                Số điện thoại
                                            </label>
                                            <div className="input-with-icon">
                                                <div className="input-icon">
                                                    <Phone className="icon-small" />
                                                </div>
                                                <input
                                                    id="contact-phone"
                                                    className="form-input with-icon"
                                                    defaultValue="0123456789"
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group full-width">
                                            <label htmlFor="contact-address" className="form-label">
                                                Địa chỉ
                                            </label>
                                            <div className="input-with-icon">
                                                <div className="input-icon">
                                                    <MapPin className="icon-small" />
                                                </div>
                                                <input
                                                    id="contact-address"
                                                    className="form-input with-icon"
                                                    defaultValue="123 Đường Nguyễn Huệ, Quận 1, TP.HCM"
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="separator"></div>

                                <div className="business-info">
                                    <h3 className="section-title">Thông tin doanh nghiệp</h3>

                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="business-name" className="form-label">
                                                Tên doanh nghiệp
                                            </label>
                                            <div className="input-with-icon">
                                                <div className="input-icon">
                                                    <Building className="icon-small" />
                                                </div>
                                                <input
                                                    id="business-name"
                                                    className="form-input with-icon"
                                                    defaultValue="Công ty TNHH TechShop"
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="tax-id" className="form-label">
                                                Mã số thuế
                                            </label>
                                            <input id="tax-id" className="form-input" defaultValue="0123456789" disabled={!isEditing} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                {isEditing ? (
                                    <>
                                        <button className="button outline" onClick={() => setIsEditing(false)}>
                                            Hủy
                                        </button>
                                        <button className="button primary" onClick={() => setIsEditing(false)}>
                                            <Save className="icon-small" />
                                            Lưu thay đổi
                                        </button>
                                    </>
                                ) : (
                                    <button className="button primary" onClick={() => setIsEditing(true)}>
                                        Chỉnh sửa thông tin
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "account" && (
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Thông tin tài khoản</h2>
                                <p className="card-description">Quản lý thông tin đăng nhập và bảo mật tài khoản</p>
                            </div>
                            <div className="card-content">
                                <div className="account-info">
                                    <div className="form-group">
                                        <label htmlFor="account-name" className="form-label">
                                            Tên người dùng
                                        </label>
                                        <div className="input-with-icon">
                                            <div className="input-icon">
                                                <User className="icon-small" />
                                            </div>
                                            <input id="account-name" className="form-input with-icon" defaultValue="Nguyễn Văn A" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="account-email" className="form-label">
                                            Email
                                        </label>
                                        <div className="input-with-icon">
                                            <div className="input-icon">
                                                <Mail className="icon-small" />
                                            </div>
                                            <input id="account-email" className="form-input with-icon" defaultValue="admin@techshop.vn" />
                                        </div>
                                    </div>
                                </div>

                                <div className="separator"></div>

                                <div className="password-section">
                                    <h3 className="section-title">Đổi mật khẩu</h3>

                                    <div className="alert danger">
                                        <AlertCircle className="icon-small" />
                                        <div className="alert-content">
                                            <h4 className="alert-title">Lưu ý</h4>
                                            <p className="alert-description">Sau khi đổi mật khẩu, bạn sẽ cần đăng nhập lại vào hệ thống.</p>
                                        </div>
                                    </div>

                                    <div className="password-form">
                                        <div className="form-group">
                                            <label htmlFor="current-password" className="form-label">
                                                Mật khẩu hiện tại
                                            </label>
                                            <div className="input-with-icon">
                                                <div className="input-icon">
                                                    <Lock className="icon-small" />
                                                </div>
                                                <input id="current-password" type="password" className="form-input with-icon" />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="new-password" className="form-label">
                                                Mật khẩu mới
                                            </label>
                                            <input id="new-password" type="password" className="form-input" />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="confirm-password" className="form-label">
                                                Xác nhận mật khẩu mới
                                            </label>
                                            <input id="confirm-password" type="password" className="form-input" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <button className="button primary">
                                    <Save className="icon-small" />
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === "payment" && (
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Thông tin VNPay</h2>
                                <p className="card-description">Quản lý thông tin tài khoản VNPay để nhận thanh toán</p>
                            </div>
                            <div className="card-content">
                                <div className="vnpay-info">
                                    <div className="form-group">
                                        <label htmlFor="vnpay-merchant" className="form-label">
                                            Mã đơn vị (Merchant ID)
                                        </label>
                                        <input id="vnpay-merchant" className="form-input" defaultValue="TECHSHOP123" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="vnpay-terminal" className="form-label">
                                            Mã terminal
                                        </label>
                                        <div className="input-with-icon">
                                            <div className="input-icon">
                                                <CreditCard className="icon-small" />
                                            </div>
                                            <input id="vnpay-terminal" className="form-input with-icon" defaultValue="TECHSHOP01" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="vnpay-secret" className="form-label">
                                            Mã bí mật (Secret Key)
                                        </label>
                                        <input id="vnpay-secret" type="password" className="form-input" defaultValue="••••••••••••••••" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="vnpay-callback" className="form-label">
                                            URL callback
                                        </label>
                                        <input
                                            id="vnpay-callback"
                                            className="form-input"
                                            defaultValue="https://techshop.vn/vnpay/callback"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <button className="button primary">
                                    <Save className="icon-small" />
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile

