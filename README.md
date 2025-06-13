# Trang Quản Lý Bán Hàng (Seller) - TechShop

Đây là dự án Frontend dành cho người bán (Seller) của hệ thống website thương mại điện tử **TechShop**. Giao diện này được xây dựng để cung cấp cho người bán một bộ công cụ mạnh mẽ để quản lý sản phẩm, theo dõi đơn hàng, xem thống kê kinh doanh và quản lý thông tin cửa hàng của họ một cách hiệu quả.

Dự án được phát triển bằng **React** và **Vite**, đảm bảo hiệu suất cao, thời gian tải nhanh và trải nghiệm phát triển mượt mà.

## 🚀 Công Nghệ Sử Dụng

- **Framework/Library:**
  - **React 19:** Thư viện giao diện người dùng mạnh mẽ và phổ biến.
  - **React Router DOM v7:** Quản lý định tuyến và điều hướng trong ứng dụng.
  - **Redux & Redux Thunk:** Quản lý trạng thái toàn cục của ứng dụng một cách nhất quán.
- **Build Tool:**
  - **Vite:** Công cụ build thế hệ mới cho hiệu suất phát triển vượt trội với Hot Module Replacement (HMR) cực nhanh.
- **API & Giao tiếp:**
  - **Axios:** Thư viện HTTP client để thực hiện các yêu cầu API đến backend.
- **Styling:**
  - **CSS Thuần:** Sử dụng CSS thuần với cấu trúc file được tổ chức theo từng module/component để dễ dàng bảo trì.
- **Icons:**
  - **Lucide React:** Bộ thư viện icon đẹp, nhẹ và dễ tùy biến.
- **Linting:**
  - **ESLint:** Đảm bảo chất lượng mã nguồn và tuân thủ các quy tắc code chung.

## 📋 Yêu Cầu Hệ Thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt các phần mềm sau:
- [Node.js](https://nodejs.org/) (phiên bản 18.x trở lên)
- [npm](https://www.npmjs.com/) hoặc [yarn](https://yarnpkg.com/)

Quan trọng: Dự án này là một phần của một hệ thống lớn hơn. Để có thể chạy đầy đủ chức năng, bạn cần đảm bảo các dịch vụ sau cũng đang chạy:
1.  **Backend Service:** Đang chạy trên `http://localhost:8080`.
2.  **Customer Frontend:** Đang chạy trên `http://localhost:5173` (để xử lý việc đăng nhập và chuyển hướng).

## ⚙️ Cài Đặt & Khởi Chạy

**1. Clone Repository**

```bash
git clone https://github.com/WEBSITE-QU-N-LI-BAN-HANG-CONG-NGH/FrontEnd-Seller
cd FrontEnd-Seller
```

**2. Cài đặt các Dependencies**

Sử dụng `npm` hoặc `yarn` để cài đặt các gói cần thiết từ tệp `package.json`.

```bash
npm install
```
# hoặc
```bash
yarn install
```

**3. Chạy Dự án ở Chế độ Development**

Lệnh này sẽ khởi động server development trên cổng `5174`.

```bash
npm run dev
```

Bây giờ, bạn có thể truy cập trang quản lý tại `http://localhost:5174`.

### Luồng Đăng nhập

Do trang Seller không có giao diện đăng nhập riêng, luồng xác thực hoạt động như sau:
1.  Người dùng truy cập trang **Customer** (`http://localhost:5173`) và đăng nhập bằng tài khoản có vai trò `SELLER`.
2.  Sau khi đăng nhập thành công, trang Customer sẽ tự động chuyển hướng người dùng đến trang Seller (`http://localhost:5174`) kèm theo một JWT token trong URL.
3.  Trang Seller sẽ nhận token này, lưu vào `localStorage` và tiến hành xác thực để cho phép người dùng truy cập.

## Scripts Có Sẵn

- `npm run dev`: Chạy ứng dụng ở chế độ development.
- `npm run build`: Build ứng dụng cho môi trường production. Các tệp tĩnh sẽ được tạo trong thư mục `dist`.
- `npm run lint`: Chạy ESLint để kiểm tra lỗi và định dạng mã nguồn.
- `npm run preview`: Chạy một server tĩnh để xem trước bản build production.

## 📁 Cấu Trúc Thư Mục

Dự án được cấu trúc một cách logic để dễ dàng tìm kiếm, phát triển và bảo trì:

```
/src
|-- /components       # Các component tái sử dụng (Layout, Modal, Spinner...)
|   |-- /common
|   |-- /features
|   |-- /layout
|-- /config           # Cấu hình API (Axios instance)
|-- /context          # React Context (nếu có)
|-- /hooks            # Các custom hooks (useAuth, useProduct, useOrder...)
|-- /pages            # Các trang chính của ứng dụng (Dashboard, Product, Order...)
|   |-- /dashboard
|   |-- /order
|   |-- /product
|   |-- /profile
|-- /services         # Các hàm gọi API được tách riêng (productService, orderService...)
|-- /state            # Cấu hình Redux (Actions, Reducers, Store)
|   |-- /auth
|-- /styles           # Các tệp CSS toàn cục và theo từng trang/component
|-- /utils            # Các hàm tiện ích (format, validators, jwtHelper...)
|-- App.jsx           # Component App chính, xử lý routing
|-- main.jsx          # Điểm vào của ứng dụng
```

## ✨ Tính Năng Nổi Bật

- **📊 Dashboard & Thống kê:**
  - Bảng điều khiển tổng quan với các chỉ số quan trọng: tổng doanh thu, tổng đơn hàng, số lượng sản phẩm và khách hàng.
  - Biểu đồ trực quan hóa doanh thu theo tháng, theo ngày và theo từng danh mục sản phẩm.
- **📦 Quản lý Sản phẩm (CRUD):**
  - Xem danh sách sản phẩm với bộ lọc đa dạng (danh mục, giá, trạng thái) và phân trang.
  - Thêm, sửa, xóa sản phẩm một cách dễ dàng.
  - Tải lên và quản lý nhiều hình ảnh cho mỗi sản phẩm.
  - Quản lý chi tiết các phiên bản (kích thước, màu sắc) và thông số kỹ thuật.
- **🛒 Quản lý Đơn hàng:**
  - Theo dõi danh sách đơn hàng theo thời gian thực.
  - Lọc và tìm kiếm đơn hàng theo mã, khách hàng, trạng thái và ngày đặt.
  - Xem chi tiết từng đơn hàng, bao gồm thông tin khách hàng, địa chỉ giao hàng, và các sản phẩm đã đặt.
  - Cập nhật trạng thái đơn hàng (ví dụ: Chờ xác nhận → Đã xác nhận → Đang giao hàng).
- **👤 Quản lý Hồ sơ & Cửa hàng:**
  - Cập nhật thông tin cá nhân của người bán.
  - Quản lý thông tin công khai của cửa hàng: tên, logo, mô tả, website.
  - Chức năng đổi mật khẩu an toàn.
