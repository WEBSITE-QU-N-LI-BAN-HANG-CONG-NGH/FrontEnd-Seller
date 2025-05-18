// src/pages/profile/Profile.jsx
import { useState, useEffect } from "react";
import { AlertCircle, Building, Camera, CreditCard, Lock, Mail, MapPin, Phone, Save, User } from "lucide-react";
import "../../styles/profile/profile.css";
import useSeller from "../../hooks/useSeller";
import { isValidEmail, isValidPhoneNumber } from "../../utils/validators";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";

function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        // Thông tin cá nhân
        firstName: "",
        lastName: "",
        email: "",
        phone: "",

        // Thông tin shop
        shopName: "",
        logo: "",
        description: "",
        website: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        businessType: "",

        // Thông tin VNPay
        merchantId: "",
        terminalId: "",
        secretKey: "",
        callbackUrl: ""
    });

    const {
        profile,
        shopInfo,
        loading,
        error,
        fetchProfile,
        fetchShopInfo,
        updateProfile,
        updateShopInfo,
        resetState
    } = useSeller();

    // Lấy thông tin profile và shop khi component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileData = await fetchProfile();
                const shopData = await fetchShopInfo();

                // Cập nhật form data với thông tin từ API
                setFormData({
                    // Thông tin cá nhân
                    firstName: profileData.firstName || "",
                    lastName: profileData.lastName || "",
                    email: profileData.email || "",
                    phone: profileData.phone || "",

                    // Thông tin shop
                    shopName: shopData.shopName || "",
                    logo: shopData.logo || "",
                    description: shopData.description || "",
                    website: shopData.website || "",
                    address: shopData.address || "",
                    city: shopData.city || "",
                    state: shopData.state || "",
                    zipCode: shopData.zipCode || "",
                    phoneNumber: shopData.phoneNumber || "",
                    businessType: shopData.businessType || "",

                    // Thông tin VNPay (dummy data)
                    merchantId: "TECHSHOP123",
                    terminalId: "TECHSHOP01",
                    secretKey: "••••••••••••••••",
                    callbackUrl: "https://techshop.vn/vnpay/callback"
                });
            } catch (err) {
                console.error("Lỗi khi lấy thông tin profile:", err);
            }
        };

        fetchData();
    }, [fetchProfile, fetchShopInfo]);

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Xóa lỗi khi người dùng nhập lại
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Xác thực form trước khi gửi
    const validateForm = () => {
        const errors = {};

        // Kiểm tra email
        if (formData.email && !isValidEmail(formData.email)) {
            errors.email = "Email không hợp lệ";
        }

        // Kiểm tra số điện thoại
        if (formData.phone && !isValidPhoneNumber(formData.phone)) {
            errors.phone = "Số điện thoại không hợp lệ";
        }

        if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber)) {
            errors.phoneNumber = "Số điện thoại cửa hàng không hợp lệ";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Xử lý lưu thông tin
    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            // Cập nhật thông tin cá nhân
            await updateProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone
            });

            // Cập nhật thông tin shop
            await updateShopInfo({
                shopName: formData.shopName,
                logo: formData.logo,
                description: formData.description,
                website: formData.website,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                phoneNumber: formData.phoneNumber,
                businessType: formData.businessType
            });

            setIsEditing(false);
        } catch (err) {
            console.error("Lỗi khi cập nhật thông tin:", err);
            setFormErrors({
                ...formErrors,
                submit: "Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau."
            });
        }
    };

    // Xử lý upload logo
    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setFormData(prev => ({
                ...prev,
                logo: event.target.result
            }));
        };
        reader.readAsDataURL(file);
    };

    if (loading && !profile) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorAlert message={error} onDismiss={resetState} />;
    }

    return (
        <div className="profile-page">
            <h1 className="page-title">Hồ sơ</h1>
            <p className="page-description">Quản lý thông tin cửa hàng và tài khoản của bạn</p>

            {formErrors.submit && (
                <div className="alert danger">
                    <AlertCircle className="icon-small" />
                    <div className="alert-content">
                        <p className="alert-description">{formErrors.submit}</p>
                    </div>
                </div>
            )}

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
                                            <img
                                                src={formData.logo || "/placeholder.svg?height=128&width=128"}
                                                alt="Store logo"
                                                className="logo-image"
                                            />
                                            <button
                                                className="logo-edit-button"
                                                disabled={!isEditing}
                                                onClick={() => document.getElementById('logo-upload').click()}
                                            >
                                                <Camera className="icon-small" />
                                                <span className="sr-only">Thay đổi logo</span>
                                            </button>
                                            <input
                                                id="logo-upload"
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={handleLogoUpload}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="logo-info">
                                            <h3 className="logo-title">Logo cửa hàng</h3>
                                            <p className="logo-description">PNG hoặc JPG. Tối đa 1MB</p>
                                        </div>
                                    </div>

                                    <div className="store-details">
                                        <div className="form-group">
                                            <label htmlFor="shopName" className="form-label">
                                                Tên cửa hàng
                                            </label>
                                            <input
                                                id="shopName"
                                                name="shopName"
                                                className="form-input"
                                                value={formData.shopName}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="description" className="form-label">
                                                Mô tả cửa hàng
                                            </label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                className="form-textarea"
                                                value={formData.description}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            ></textarea>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="website" className="form-label">
                                                Website
                                            </label>
                                            <input
                                                id="website"
                                                name="website"
                                                className="form-input"
                                                value={formData.website}
                                                onChange={handleChange}
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
                                            <label htmlFor="email" className="form-label">
                                                Email liên hệ
                                            </label>
                                            <div className="input-icon">
                                                <Mail className="icon-small" />
                                            </div>
                                            <input
                                                id="email"
                                                name="email"
                                                className={`form-input with-icon ${formErrors.email ? 'error' : ''}`}
                                                value={formData.email}
                                                onChange={handleChange}
                                                disabled={true}
                                            />
                                        </div>
                                        {formErrors.email && <div className="form-error">{formErrors.email}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone" className="form-label">
                                            Số điện thoại
                                        </label>
                                        <div className="input-with-icon">
                                            <div className="input-icon">
                                                <Phone className="icon-small" />
                                            </div>
                                            <input
                                                id="phone"
                                                name="phone"
                                                className={`form-input with-icon ${formErrors.phone ? 'error' : ''}`}
                                                value={formData.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        {formErrors.phone && <div className="form-error">{formErrors.phone}</div>}
                                    </div>

                                    <div className="form-group full-width">
                                        <label htmlFor="address" className="form-label">
                                            Địa chỉ
                                        </label>
                                        <div className="input-with-icon">
                                            <div className="input-icon">
                                                <MapPin className="icon-small" />
                                            </div>
                                            <input
                                                id="address"
                                                name="address"
                                                className="form-input with-icon"
                                                value={formData.address}
                                                onChange={handleChange}
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
                                        <label htmlFor="businessType" className="form-label">
                                            Loại hình kinh doanh
                                        </label>
                                        <select
                                            id="businessType"
                                            name="businessType"
                                            className="form-select"
                                            value={formData.businessType}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                        >
                                            <option value="">Chọn loại hình kinh doanh</option>
                                            <option value="Cá nhân">Cá nhân</option>
                                            <option value="Doanh nghiệp">Doanh nghiệp</option>
                                            <option value="Hộ kinh doanh">Hộ kinh doanh</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phoneNumber" className="form-label">
                                            Số điện thoại doanh nghiệp
                                        </label>
                                        <div className="input-with-icon">
                                            <div className="input-icon">
                                                <Building className="icon-small" />
                                            </div>
                                            <input
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                className={`form-input with-icon ${formErrors.phoneNumber ? 'error' : ''}`}
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        {formErrors.phoneNumber && <div className="form-error">{formErrors.phoneNumber}</div>}
                                    </div>
                                </div>
                            </div>
                        <div className="card-footer">
                    {isEditing ? (
                        <>
                        <button className="button outline" onClick={() => setIsEditing(false)}>
                    Hủy
                </button>
                <button className="button primary" onClick={handleSave}>
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
                            <input
                                id="account-name"
                                className="form-input with-icon"
                                value={`${formData.firstName} ${formData.lastName}`}
                                disabled
                            />
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
                            <input
                                id="account-email"
                                className="form-input with-icon"
                                value={formData.email}
                                disabled
                            />
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
                        <label htmlFor="merchantId" className="form-label">
                            Mã đơn vị (Merchant ID)
                        </label>
                        <input
                            id="merchantId"
                            name="merchantId"
                            className="form-input"
                            value={formData.merchantId}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="terminalId" className="form-label">
                            Mã terminal
                        </label>
                        <div className="input-with-icon">
                            <div className="input-icon">
                                <CreditCard className="icon-small" />
                            </div>
                            <input
                                id="terminalId"
                                name="terminalId"
                                className="form-input with-icon"
                                value={formData.terminalId}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="secretKey" className="form-label">
                            Mã bí mật (Secret Key)
                        </label>
                        <input
                            id="secretKey"
                            name="secretKey"
                            type="password"
                            className="form-input"
                            value={formData.secretKey}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="callbackUrl" className="form-label">
                            URL callback
                        </label>
                        <input
                            id="callbackUrl"
                            name="callbackUrl"
                            className="form-input"
                            value={formData.callbackUrl}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>
            </div>
            <div className="card-footer">
                {isEditing ? (
                    <>
                        <button className="button outline" onClick={() => setIsEditing(false)}>
                            Hủy
                        </button>
                        <button className="button primary" onClick={handleSave}>
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
</div>
</div>
</div>
);
}

export default Profile;