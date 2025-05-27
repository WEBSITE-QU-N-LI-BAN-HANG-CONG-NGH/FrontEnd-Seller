// src/pages/product/AddProduct.jsx
import { useState} from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Save,
    ImagePlus,
    X,
    Info,
    Check,
    AlertCircle
} from "lucide-react";
import "../../styles/product/add_product.css";
import useProduct from "../../hooks/useProduct";
import { isNotEmpty, isPositiveNumber } from "../../utils/validators";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";

function AddProduct() {
    const navigate = useNavigate();
    const { createProduct, uploadProductImage, loading, error, resetState } = useProduct();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");
    const [productImages, setProductImages] = useState([]);
    const [specifications, setSpecifications] = useState([
        { key: "CPU", value: "" },
        { key: "RAM", value: "" },
        { key: "Ổ cứng", value: "" },
        { key: "Màn hình", value: "" },
        { key: "Card đồ họa", value: "" },
    ]);
    const [formErrors, setFormErrors] = useState({});
    const [productData, setProductData] = useState({
        title: "",
        brand: "",
        price: "",
        quantity: "",
        description: "",
        topLevelCategory: "",
        secondLevelCategory: "",
        discountPersent: 0,
        color: "",
        sizes: [],
        featured: false,
        active: true
    });

    // Xử lý thêm kích thước sản phẩm
    const handleAddSize = () => {
        const newSizes = [...productData.sizes];
        newSizes.push({ name: "", quantity: 0 });
        setProductData({ ...productData, sizes: newSizes });
    };

    // Xử lý xóa kích thước sản phẩm
    const handleRemoveSize = (index) => {
        const newSizes = [...productData.sizes];
        newSizes.splice(index, 1);
        setProductData({ ...productData, sizes: newSizes });
    };

    // Xử lý thay đổi kích thước sản phẩm
    const handleSizeChange = (index, field, value) => {
        const newSizes = [...productData.sizes];
        newSizes[index][field] = value;
        setProductData({ ...productData, sizes: newSizes });
    };

    // Xử lý thêm thông số kỹ thuật
    const handleAddSpecification = () => {
        setSpecifications([...specifications, { key: "", value: "" }]);
    };

    // Xử lý xóa thông số kỹ thuật
    const handleRemoveSpecification = (index) => {
        const newSpecs = [...specifications];
        newSpecs.splice(index, 1);
        setSpecifications(newSpecs);
    };

    // Xử lý thay đổi thông số kỹ thuật
    const handleSpecChange = (index, field, value) => {
        const newSpecs = [...specifications];
        newSpecs[index][field] = value;
        setSpecifications(newSpecs);
    };

    // Xử lý thay đổi input form
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductData({
            ...productData,
            [name]: type === 'checkbox' ? checked : value
        });

        // Xóa lỗi khi người dùng nhập lại
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: null
            });
        }
    }

    // Xác thực form trước khi gửi
    const validateForm = () => {
        const errors = {};

        if (!isNotEmpty(productData.title)) {
            errors.title = "Vui lòng nhập tên sản phẩm";
        }

        if (!isNotEmpty(productData.brand)) {
            errors.brand = "Vui lòng nhập thương hiệu";
        }

        if (!isPositiveNumber(productData.price)) {
            errors.price = "Giá bán phải là số dương";
        }

        if (!isPositiveNumber(productData.quantity)) {
            errors.quantity = "Số lượng phải là số dương";
        }

        if (!isNotEmpty(productData.description)) {
            errors.description = "Vui lòng nhập mô tả sản phẩm";
        }

        if (!isNotEmpty(productData.topLevelCategory)) {
            errors.topLevelCategory = "Vui lòng chọn danh mục cấp 1";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Xử lý tải lên hình ảnh
    const handleImageUpload = async (event, index) => {
        const file = event.target.files[0];
        if (!file) return;

        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            const newImages = [...productImages];
            // Cập nhật preview image
            newImages[index] = {
                file: file,
                preview: e.target.result,
                uploading: true
            };
            setProductImages(newImages);
        };
        fileReader.readAsDataURL(file);
    };

    // Xử lý xóa hình ảnh
    const handleRemoveImage = (index) => {
        const newImages = [...productImages];
        newImages.splice(index, 1);
        setProductImages(newImages);
    };

    // Xử lý thêm ô hình ảnh mới
    const handleAddImage = () => {
        setProductImages([...productImages, null]);
    };

    // Xử lý gửi form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Chuẩn bị dữ liệu sản phẩm
            const formattedData = {
                ...productData,
                price: parseInt(productData.price),
                quantity: parseInt(productData.quantity),
                discountPersent: parseInt(productData.discountPersent || 0),
                // Chuyển thông số kỹ thuật thành một chuỗi JSON trong description
                description: productData.description + "\n\n" + JSON.stringify(
                    specifications.filter(spec => spec.key && spec.value)
                        .reduce((obj, item) => {
                            obj[item.key] = item.value;
                            return obj;
                        }, {})
                ),
                // Định dạng sizes cho API
                sizes: productData.sizes.map(size => ({
                    name: size.name,
                    quantity: parseInt(size.quantity)
                }))
            };

            // Gọi API tạo sản phẩm
            const result = await createProduct(formattedData);

            // Upload hình ảnh cho sản phẩm đã tạo
            if (result.id) {
                const uploadPromises = productImages
                    .filter(img => img && img.file)
                    .map(img => uploadProductImage(result.id, img.file));

                await Promise.all(uploadPromises);
            }

            // Chuyển đến trang danh sách sản phẩm
            navigate("/dashboard/products");

        } catch (error) {
            console.error("Lỗi khi tạo sản phẩm:", error);
            setFormErrors({
                ...formErrors,
                submit: "Có lỗi xảy ra khi tạo sản phẩm. Vui lòng thử lại sau."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="add-product-page">
            <div className="page-header">
                <div className="header-left">
                    <button className="button icon-only outline" onClick={() => navigate("/dashboard/products")}>
                        <ArrowLeft className="icon-small" />
                    </button>
                    <h1 className="page-title">Thêm sản phẩm mới</h1>
                </div>
                <div className="header-actions">
                    <button className="button outline" onClick={() => navigate("/dashboard/products")}>
                        Hủy
                    </button>
                    <button className="button primary" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>Đang lưu...</>
                        ) : (
                            <>
                                <Save className="icon-small" />
                                Lưu sản phẩm
                            </>
                        )}
                    </button>
                </div>
            </div>

            {error && <ErrorAlert message={error} onDismiss={() => resetState()} />}

            {formErrors.submit && (
                <div className="alert danger">
                    <AlertCircle className="icon-small" />
                    <div className="alert-content">
                        <h4 className="alert-title">Lỗi</h4>
                        <p className="alert-description">{formErrors.submit}</p>
                    </div>
                </div>
            )}

            <div className="alert warning">
                <AlertCircle className="icon-small" />
                <div className="alert-content">
                    <h4 className="alert-title">Lưu ý</h4>
                    <p className="alert-description">
                        Vui lòng điền đầy đủ thông tin sản phẩm. Các trường có dấu (*) là bắt buộc.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
                <div className="tabs">
                    <div className="tabs-list">
                        <button
                            type="button"
                            className={`tab-button ${activeTab === "basic" ? "active" : ""}`}
                            onClick={() => setActiveTab("basic")}
                        >
                            Thông tin cơ bản
                        </button>
                        <button
                            type="button"
                            className={`tab-button ${activeTab === "specifications" ? "active" : ""}`}
                            onClick={() => setActiveTab("specifications")}
                        >
                            Thông số kỹ thuật
                        </button>
                        <button
                            type="button"
                            className={`tab-button ${activeTab === "images" ? "active" : ""}`}
                            onClick={() => setActiveTab("images")}
                        >
                            Hình ảnh sản phẩm
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === "basic" && (
                            <div className="card">
                                <div className="card-header">
                                    <h2 className="card-title">Thông tin cơ bản</h2>
                                </div>
                                <div className="card-content">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="title" className="form-label">
                                                Tên sản phẩm <span className="required">*</span>
                                            </label>
                                            <input
                                                id="title"
                                                name="title"
                                                className={`form-input ${formErrors.title ? 'error' : ''}`}
                                                placeholder="Nhập tên sản phẩm"
                                                value={productData.title}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {formErrors.title && <div className="form-error">{formErrors.title}</div>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="brand" className="form-label">
                                                Thương hiệu <span className="required">*</span>
                                            </label>
                                            <input
                                                id="brand"
                                                name="brand"
                                                className={`form-input ${formErrors.brand ? 'error' : ''}`}
                                                placeholder="VD: Apple, Samsung, Asus..."
                                                value={productData.brand}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {formErrors.brand && <div className="form-error">{formErrors.brand}</div>}
                                        </div>
                                    </div>

                                    <div className="form-row four-columns">
                                        <div className="form-group">
                                            <label htmlFor="topLevelCategory" className="form-label">
                                                Danh mục <span className="required">*</span>
                                            </label>
                                            <select
                                                id="topLevelCategory"
                                                name="topLevelCategory"
                                                className={`form-select ${formErrors.topLevelCategory ? 'error' : ''}`}
                                                value={productData.topLevelCategory}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Chọn danh mục</option>
                                                <option value="Laptop">Laptop</option>
                                                <option value="Điện thoại">Điện thoại</option>
                                                <option value="Máy tính bảng">Máy tính bảng</option>
                                                <option value="Phụ kiện">Phụ kiện</option>
                                                <option value="Màn hình">Màn hình</option>
                                            </select>
                                            {formErrors.topLevelCategory && <div className="form-error">{formErrors.topLevelCategory}</div>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="topLevelCategory" className="form-label">
                                                Danh mục phụ <span className="required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="topLevelCategory"
                                                name="topLevelCategory"
                                                className={`form-select ${formErrors.topLevelCategory ? 'error' : ''}`}
                                                value={productData.topLevelCategory}
                                                onChange={handleInputChange}
                                                placeholder="Nhập danh mục"
                                                required
                                            />
                                            {formErrors.topLevelCategory && <div className="form-error">{formErrors.topLevelCategory}</div>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="price" className="form-label">
                                                Giá bán (VNĐ) <span className="required">*</span>
                                            </label>
                                            <input
                                                id="price"
                                                name="price"
                                                type="number"
                                                className={`form-input ${formErrors.price ? 'error' : ''}`}
                                                placeholder="VD: 25990000"
                                                value={productData.price}
                                                onChange={handleInputChange}
                                                min="0"
                                                required
                                            />
                                            {formErrors.price && <div className="form-error">{formErrors.price}</div>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="quantity" className="form-label">
                                                Số lượng tồn kho <span className="required">*</span>
                                            </label>
                                            <input
                                                id="quantity"
                                                name="quantity"
                                                type="number"
                                                className={`form-input ${formErrors.quantity ? 'error' : ''}`}
                                                placeholder="VD: 10"
                                                value={productData.quantity}
                                                onChange={handleInputChange}
                                                min="0"
                                                required
                                            />
                                            {formErrors.quantity && <div className="form-error">{formErrors.quantity}</div>}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description" className="form-label">
                                            Mô tả sản phẩm <span className="required">*</span>
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            className={`form-textarea ${formErrors.description ? 'error' : ''}`}
                                            placeholder="Nhập mô tả chi tiết về sản phẩm"
                                            value={productData.description}
                                            onChange={handleInputChange}
                                            required
                                        ></textarea>
                                        {formErrors.description && <div className="form-error">{formErrors.description}</div>}
                                    </div>

                                    <div className="separator"></div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="color" className="form-label">
                                                Màu sắc
                                            </label>
                                            <input
                                                id="color"
                                                name="color"
                                                className="form-input"
                                                placeholder="VD: Đen, Trắng, Bạc..."
                                                value={productData.color}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="discountPersent" className="form-label">
                                                Phần trăm giảm giá
                                            </label>
                                            <input
                                                id="discountPersent"
                                                name="discountPersent"
                                                type="number"
                                                className="form-input"
                                                placeholder="VD: 10"
                                                min="0"
                                                max="100"
                                                value={productData.discountPersent}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="separator"></div>

                                    <div className="form-section">
                                        <h3 className="section-title">Kích thước sản phẩm</h3>
                                        <div className="sizes-table">
                                            <table>
                                                <thead>
                                                <tr>
                                                    <th>Kích thước</th>
                                                    <th>Số lượng</th>
                                                    <th>Thao tác</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {productData.sizes.map((size, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                className="form-input"
                                                                placeholder="VD: S, M, L, XL, 256GB..."
                                                                value={size.name}
                                                                onChange={(e) => handleSizeChange(index, "name", e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                className="form-input"
                                                                placeholder="Số lượng"
                                                                min="0"
                                                                value={size.quantity}
                                                                onChange={(e) => handleSizeChange(index, "quantity", e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="button icon-only ghost"
                                                                onClick={() => handleRemoveSize(index)}
                                                            >
                                                                <Trash2 className="icon-small danger" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <button type="button" className="button outline" onClick={handleAddSize}>
                                            <Plus className="icon-small" />
                                            Thêm kích thước
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "specifications" && (
                            <div className="card">
                                <div className="card-header">
                                    <h2 className="card-title">Thông số kỹ thuật</h2>
                                </div>
                                <div className="card-content">
                                    <div className="specs-table">
                                        <table>
                                            <thead>
                                            <tr>
                                                <th className="spec-name-col">Thông số</th>
                                                <th>Giá trị</th>
                                                <th className="action-col">Thao tác</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {specifications.map((spec, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <input
                                                            className="form-input"
                                                            value={spec.key}
                                                            onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                                                            placeholder="VD: CPU, RAM, Màn hình..."
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-input"
                                                            value={spec.value}
                                                            onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                                                            placeholder="VD: Intel Core i7, 16GB, 15.6 inch..."
                                                        />
                                                    </td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="button icon-only ghost"
                                                            onClick={() => handleRemoveSpecification(index)}
                                                        >
                                                            <Trash2 className="icon-small danger" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <button type="button" className="button outline" onClick={handleAddSpecification}>
                                        <Plus className="icon-small" />
                                        Thêm thông số
                                    </button>

                                    <div className="alert info">
                                        <Info className="icon-small" />
                                        <p className="alert-description">
                                            Thêm các thông số kỹ thuật chi tiết giúp khách hàng hiểu rõ hơn về sản phẩm và tăng khả năng mua
                                            hàng.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "images" && (
                            <div className="card">
                                <div className="card-header">
                                    <h2 className="card-title">Hình ảnh sản phẩm</h2>
                                </div>
                                <div className="card-content">
                                    <div className="image-gallery">
                                        {productImages.map((image, index) => (
                                            <div key={index} className="image-item">
                                                <div className="image-container">
                                                    <img
                                                        src={image ? image.preview : "/placeholder.svg"}
                                                        alt={`Product image ${index + 1}`}
                                                        className="product-image"
                                                    />
                                                    <div className="image-actions">
                                                        <button type="button" className="image-action-button">
                                                            <input
                                                                type="file"
                                                                className="file-input"
                                                                accept="image/*"
                                                                title="Tải lên hình ảnh"
                                                                onChange={(e) => handleImageUpload(e, index)}
                                                            />
                                                            <span className="action-icon-wrapper">
                                                                <ImagePlus className="icon-small" />
                                                            </span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="image-action-button danger"
                                                            onClick={() => handleRemoveImage(index)}
                                                        >
                                                            <X className="icon-small" />
                                                        </button>
                                                    </div>
                                                </div>
                                                {index === 0 && <span className="image-badge">Ảnh chính</span>}
                                            </div>
                                        ))}

                                        {productImages.length < 8 && (
                                            <button type="button" onClick={handleAddImage} className="add-image-button">
                                                <ImagePlus className="icon-large" />
                                                <span>Thêm hình ảnh</span>
                                            </button>
                                        )}
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddProduct;