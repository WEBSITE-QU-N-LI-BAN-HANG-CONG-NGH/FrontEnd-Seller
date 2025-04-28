"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Trash2, Save, ImagePlus, X, Info, Check, AlertCircle } from "lucide-react"
import "../../styles/product/add_product.css"


function AddProduct() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState("basic")
    const [productImages, setProductImages] = useState([
        "/placeholder.svg?height=200&width=200",
        "/placeholder.svg?height=200&width=200",
    ])
    const [specifications, setSpecifications] = useState([
        { key: "CPU", value: "" },
        { key: "RAM", value: "" },
        { key: "Ổ cứng", value: "" },
        { key: "Màn hình", value: "" },
        { key: "Card đồ họa", value: "" },
    ])

    const handleAddSpecification = () => {
        setSpecifications([...specifications, { key: "", value: "" }])
    }

    const handleRemoveSpecification = (index) => {
        const newSpecs = [...specifications]
        newSpecs.splice(index, 1)
        setSpecifications(newSpecs)
    }

    const handleSpecChange = (index, field, value) => {
        const newSpecs = [...specifications]
        newSpecs[index][field] = value
        setSpecifications(newSpecs)
    }

    const handleAddImage = () => {
        setProductImages([...productImages, "/placeholder.svg?height=200&width=200"])
    }

    const handleRemoveImage = (index) => {
        const newImages = [...productImages]
        newImages.splice(index, 1)
        setProductImages(newImages)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Giả lập việc lưu sản phẩm
        setTimeout(() => {
            setIsSubmitting(false)
            navigate("/dashboard/products")
        }, 1500)
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
                                    <p className="card-description">Nhập thông tin cơ bản của sản phẩm</p>
                                </div>
                                <div className="card-content">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="product-name" className="form-label">
                                                Tên sản phẩm <span className="required">*</span>
                                            </label>
                                            <input id="product-name" className="form-input" placeholder="Nhập tên sản phẩm" required />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="product-sku" className="form-label">
                                                Mã sản phẩm (SKU) <span className="required">*</span>
                                            </label>
                                            <input id="product-sku" className="form-input" placeholder="VD: PROD-001" required />
                                        </div>
                                    </div>

                                    <div className="form-row three-columns">
                                        <div className="form-group">
                                            <label htmlFor="product-category" className="form-label">
                                                Danh mục <span className="required">*</span>
                                            </label>
                                            <select id="product-category" className="form-select" required>
                                                <option value="">Chọn danh mục</option>
                                                <option value="laptop">Laptop</option>
                                                <option value="phone">Điện thoại</option>
                                                <option value="tablet">Máy tính bảng</option>
                                                <option value="accessory">Phụ kiện</option>
                                                <option value="monitor">Màn hình</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="product-price" className="form-label">
                                                Giá bán (VNĐ) <span className="required">*</span>
                                            </label>
                                            <input
                                                id="product-price"
                                                type="number"
                                                className="form-input"
                                                placeholder="VD: 25990000"
                                                min="0"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="product-stock" className="form-label">
                                                Số lượng tồn kho <span className="required">*</span>
                                            </label>
                                            <input
                                                id="product-stock"
                                                type="number"
                                                className="form-input"
                                                placeholder="VD: 10"
                                                min="0"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="product-description" className="form-label">
                                            Mô tả sản phẩm <span className="required">*</span>
                                        </label>
                                        <textarea
                                            id="product-description"
                                            className="form-textarea"
                                            placeholder="Nhập mô tả chi tiết về sản phẩm"
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="separator"></div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="product-brand" className="form-label">
                                                Thương hiệu
                                            </label>
                                            <input id="product-brand" className="form-input" placeholder="VD: Apple, Samsung, Asus..." />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="product-warranty" className="form-label">
                                                Bảo hành
                                            </label>
                                            <input id="product-warranty" className="form-input" placeholder="VD: 12 tháng" />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="product-origin" className="form-label">
                                                Xuất xứ
                                            </label>
                                            <input id="product-origin" className="form-input" placeholder="VD: Việt Nam, Trung Quốc, Mỹ..." />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="product-weight" className="form-label">
                                                Trọng lượng (gram)
                                            </label>
                                            <input id="product-weight" type="number" className="form-input" placeholder="VD: 1500" min="0" />
                                        </div>
                                    </div>

                                    <div className="separator"></div>

                                    <div className="toggle-options">
                                        <div className="toggle-group">
                                            <div className="toggle-info">
                                                <label htmlFor="product-featured" className="toggle-label">
                                                    Sản phẩm nổi bật
                                                </label>
                                                <p className="toggle-description">Sản phẩm sẽ được hiển thị ở trang chủ</p>
                                            </div>
                                            <label className="toggle">
                                                <input type="checkbox" id="product-featured" />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>

                                        <div className="toggle-group">
                                            <div className="toggle-info">
                                                <label htmlFor="product-active" className="toggle-label">
                                                    Trạng thái
                                                </label>
                                                <p className="toggle-description">Sản phẩm sẽ được hiển thị trên website</p>
                                            </div>
                                            <label className="toggle">
                                                <input type="checkbox" id="product-active" defaultChecked />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "specifications" && (
                            <div className="card">
                                <div className="card-header">
                                    <h2 className="card-title">Thông số kỹ thuật</h2>
                                    <p className="card-description">Thêm thông số kỹ thuật chi tiết của sản phẩm</p>
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

                                    <div className="specs-suggestion">
                                        <h3 className="suggestion-title">Gợi ý thông số kỹ thuật theo danh mục:</h3>
                                        <div className="suggestion-grid">
                                            <div className="suggestion-column">
                                                <h4 className="suggestion-category">Laptop:</h4>
                                                <ul className="suggestion-list">
                                                    <li>CPU: Intel Core i5-12500H, AMD Ryzen 7 5800H...</li>
                                                    <li>RAM: 8GB, 16GB DDR4 3200MHz...</li>
                                                    <li>Ổ cứng: SSD 512GB PCIe NVMe...</li>
                                                    <li>Màn hình: 15.6 inch Full HD IPS...</li>
                                                    <li>Card đồ họa: NVIDIA GeForce RTX 3050 4GB...</li>
                                                </ul>
                                            </div>
                                            <div className="suggestion-column">
                                                <h4 className="suggestion-category">Điện thoại:</h4>
                                                <ul className="suggestion-list">
                                                    <li>Màn hình: 6.1 inch OLED, 120Hz...</li>
                                                    <li>Chip: Apple A15 Bionic, Snapdragon 8 Gen 1...</li>
                                                    <li>RAM: 6GB, 8GB LPDDR5...</li>
                                                    <li>Bộ nhớ trong: 128GB, 256GB...</li>
                                                    <li>Camera: 48MP, f/1.8, OIS...</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "images" && (
                            <div className="card">
                                <div className="card-header">
                                    <h2 className="card-title">Hình ảnh sản phẩm</h2>
                                    <p className="card-description">Tải lên hình ảnh sản phẩm (tối đa 8 hình ảnh)</p>
                                </div>
                                <div className="card-content">
                                    <div className="image-gallery">
                                        {productImages.map((image, index) => (
                                            <div key={index} className="image-item">
                                                <div className="image-container">
                                                    <img
                                                        src={image || "/placeholder.svg"}
                                                        alt={`Product image ${index + 1}`}
                                                        className="product-image"
                                                    />
                                                    <div className="image-actions">
                                                        <button type="button" className="image-action-button">
                                                            <input type="file" className="file-input" accept="image/*" title="Tải lên hình ảnh" />
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

                                    <div className="alert info">
                                        <Info className="icon-small" />
                                        <div className="alert-content">
                                            <ul className="info-list">
                                                <li>Hình ảnh đầu tiên sẽ được sử dụng làm ảnh chính của sản phẩm</li>
                                                <li>Kích thước hình ảnh tối ưu: 800x800 pixel</li>
                                                <li>Định dạng hỗ trợ: JPG, PNG, WEBP</li>
                                                <li>Dung lượng tối đa: 2MB mỗi hình ảnh</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="button outline" onClick={() => navigate("/dashboard/products")}>
                        Hủy
                    </button>
                    <button type="submit" className="button primary" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>Đang lưu...</>
                        ) : (
                            <>
                                <Check className="icon-small" />
                                Lưu sản phẩm
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddProduct
