// Profile.jsx - Address field removed
import { useState, useEffect } from "react";
import { AlertCircle, Camera, Lock, Mail, Phone, Save, User } from "lucide-react";
import "../../styles/profile/profile.css";
import useSeller from "../../hooks/useSeller";
import { isValidEmail, isValidPhoneNumber } from "../../utils/validators";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import sellerService from "../../services/sellerService.js";

function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [formErrors, setFormErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [formData, setFormData] = useState({
        // Personal information
        firstName: "",
        lastName: "",
        email: "",
        phone: "",

        // Shop information
        shopName: "",
        logo: "",
        description: "",
        website: "",
        businessType: ""
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

    // Fetch profile and shop data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileData = await fetchProfile();
                const shopData = await fetchShopInfo();

                // Update form data with clean mapping
                setFormData({
                    // Personal information
                    firstName: profileData.firstName || "",
                    lastName: profileData.lastName || "",
                    email: profileData.email || "",
                    phone: profileData.phone || "",

                    // Shop information
                    shopName: shopData.shopName || `${profileData.firstName} ${profileData.lastName} Shop`,
                    logo: shopData.logo || profileData.imageUrl || "",
                    description: shopData.description || `Cửa hàng của ${profileData.firstName} ${profileData.lastName}`,
                    website: shopData.website || "",
                    businessType: shopData.businessType || "Cá nhân"
                });
            } catch (err) {
                console.error("Lỗi khi lấy thông tin profile:", err);
            }
        };

        fetchData();
    }, [fetchProfile, fetchShopInfo]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear errors when user types again
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Validate form before submission
    const validateForm = () => {
        const errors = {};

        // Check email (though it's disabled, keep validation)
        if (formData.email && !isValidEmail(formData.email)) {
            errors.email = "Email không hợp lệ";
        }

        // Check phone number
        if (formData.phone && !isValidPhoneNumber(formData.phone)) {
            errors.phone = "Số điện thoại không hợp lệ";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle save information
    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            // Update personal profile
            await updateProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone
            });

            // Update shop information
            await updateShopInfo({
                shopName: formData.shopName,
                description: formData.description,
                website: formData.website,
                businessType: formData.businessType,
                phone: formData.phone // Use same phone for shop
            });

            setIsEditing(false);
            console.log('Cập nhật thông tin thành công');

        } catch (err) {
            console.error("Lỗi khi cập nhật thông tin:", err);
            setFormErrors({
                ...formErrors,
                submit: "Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau."
            });
        }
    };

    // Handle logo upload
    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const response = await sellerService.uploadAvatar(file);

            setFormData(prev => ({
                ...prev,
                logo: response.data.data.imageUrl
            }));

            console.log('Upload avatar thành công');
        } catch (error) {
            console.error('Lỗi khi upload avatar:', error);
            setFormErrors(prev => ({
                ...prev,
                logo: 'Không thể upload avatar. Vui lòng thử lại.'
            }));
        } finally {
            setIsUploading(false);
        }
    };

    // Handle password change
    const handleChangePassword = async () => {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validate passwords
        if (!currentPassword || !newPassword || !confirmPassword) {
            setFormErrors(prev => ({
                ...prev,
                password: 'Vui lòng điền đầy đủ thông tin'
            }));
            return;
        }

        if (newPassword !== confirmPassword) {
            setFormErrors(prev => ({
                ...prev,
                password: 'Xác nhận mật khẩu không khớp'
            }));
            return;
        }

        if (newPassword.length < 6) {
            setFormErrors(prev => ({
                ...prev,
                password: 'Mật khẩu mới phải có ít nhất 6 ký tự'
            }));
            return;
        }

        try {
            setIsChangingPassword(true);
            await sellerService.changePassword({
                currentPassword,
                newPassword,
                confirmPassword
            });

            // Reset form
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';

            // Clear any previous errors
            setFormErrors(prev => ({
                ...prev,
                password: null
            }));

            console.log('Đổi mật khẩu thành công');
        } catch (error) {
            console.error('Lỗi khi đổi mật khẩu:', error);
            setFormErrors(prev => ({
                ...prev,
                password: error.response?.data?.message || 'Đổi mật khẩu thất bại'
            }));
        } finally {
            setIsChangingPassword(false);
        }
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
                </div>

                <div className="tab-content">
                    {activeTab === "profile" && (
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Thông tin cửa hàng</h2>
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
                                                disabled={!isEditing || isUploading}
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
                                                disabled={!isEditing || isUploading}
                                            />
                                        </div>
                                        <div className="logo-info">
                                            <h3 className="logo-title">Logo</h3>
                                            <p className="logo-description">
                                                {isUploading ? 'Đang tải lên...' : 'PNG hoặc JPG. Tối đa 1MB'}
                                            </p>
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
                                                placeholder="https://example.com"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="businessType" className="form-label">
                                                Loại hình kinh doanh
                                            </label>
                                            <select
                                                id="businessType"
                                                name="businessType"
                                                className="form-input"
                                                value={formData.businessType}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            >
                                                <option value="Cá nhân">Cá nhân</option>
                                                <option value="Công ty">Công ty</option>
                                                <option value="Doanh nghiệp">Doanh nghiệp</option>
                                            </select>
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
                                            <div className="input-with-icon">
                                                <div className="input-icon">
                                                    <Mail className="icon-small" />
                                                </div>
                                                <input
                                                    id="email"
                                                    name="email"
                                                    className="form-input with-icon"
                                                    value={formData.email}
                                                    disabled
                                                    readOnly
                                                />
                                            </div>
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
                                                    placeholder="0123456789"
                                                />
                                            </div>
                                            {formErrors.phone && <div className="form-error">{formErrors.phone}</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="separator"></div>
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
                                                <input
                                                    id="current-password"
                                                    type="password"
                                                    className="form-input with-icon"
                                                    disabled={isChangingPassword}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="new-password" className="form-label">
                                                Mật khẩu mới
                                            </label>
                                            <input
                                                id="new-password"
                                                type="password"
                                                className="form-input"
                                                disabled={isChangingPassword}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="confirm-password" className="form-label">
                                                Xác nhận mật khẩu mới
                                            </label>
                                            <input
                                                id="confirm-password"
                                                type="password"
                                                className="form-input"
                                                disabled={isChangingPassword}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <button
                                    className="button primary"
                                    onClick={handleChangePassword}
                                    disabled={isChangingPassword}
                                >
                                    <Save className="icon-small" />
                                    {isChangingPassword ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                                {formErrors.password && (
                                    <div className="form-error" style={{marginTop: '0.5rem', color: '#ef4444'}}>
                                        {formErrors.password}
                                    </div>
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