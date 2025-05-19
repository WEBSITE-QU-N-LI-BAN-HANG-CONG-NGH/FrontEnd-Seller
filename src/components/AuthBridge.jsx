// src/components/AuthBridge.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/Api.js';
import LoadingSpinner from './common/LoadingSpinner';

// Key thống nhất để lưu token giữa customer và seller
const TOKEN_KEY = 'jwt'; // Đảm bảo sử dụng 'jwt' thay vì 'accessToken'
// Debug mode - tắt chuyển hướng
const DEBUG_MODE = true;

const AuthBridge = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const [authError, setAuthError] = useState(null);
    const [debugInfo, setDebugInfo] = useState({
        token: null,
        tokenPayload: null,
        apiResponses: [],
        errors: []
    });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log('Bắt đầu kiểm tra xác thực seller...');
                const debugData = {
                    token: null,
                    tokenPayload: null,
                    apiResponses: [],
                    errors: []
                };

                // Bước 1: Kiểm tra token từ URL (khi được redirect từ customer)
                const params = new URLSearchParams(window.location.search);
                const tokenFromUrl = params.get('token');

                if (tokenFromUrl) {
                    console.log('Đã nhận token từ URL, lưu vào localStorage');
                    localStorage.setItem(TOKEN_KEY, tokenFromUrl);
                    debugData.notes = [...(debugData.notes || []), 'Nhận token từ URL'];

                    // Xóa token khỏi URL để tránh lộ thông tin nhạy cảm
                    window.history.replaceState({}, document.title, window.location.pathname);
                }

                // Bước 2: Kiểm tra token trong localStorage
                const token = localStorage.getItem(TOKEN_KEY);
                debugData.token = token ? `${token.substring(0, 15)}...` : null;

                if (!token) {
                    console.log('Không tìm thấy token trong localStorage');
                    debugData.errors.push('Không tìm thấy token trong localStorage');

                    if (!DEBUG_MODE) {
                        redirectToCustomerLogin();
                        return;
                    } else {
                        console.log('DEBUG MODE: Bỏ qua việc chuyển hướng, tiếp tục để debug');
                    }
                }

                console.log('Đã tìm thấy token, kiểm tra tính hợp lệ...');

                // Phân tích token JWT để debug
                if (token) {
                    try {
                        const parts = token.split('.');
                        if (parts.length === 3) {
                            const payload = JSON.parse(atob(parts[1]));
                            console.log('JWT payload:', payload);
                            debugData.tokenPayload = payload;

                            // Kiểm tra trực tiếp payload có role SELLER không
                            if (payload.roles && Array.isArray(payload.roles) &&
                                payload.roles.includes("SELLER")) {
                                console.log('Token hợp lệ và có quyền SELLER, bỏ qua gọi API');

                                // Nếu token hợp lệ và có quyền SELLER, không cần gọi API nữa
                                setDebugInfo({
                                    ...debugData,
                                    tokenAnalysis: {
                                        isSeller: true,
                                        method: 'JWT direct check'
                                    }
                                });

                                setIsAuthChecking(false);
                                return; // Thoát sớm, không gọi API
                            }
                        }
                    } catch (e) {
                        console.error('Lỗi khi phân tích JWT:', e);
                        debugData.errors.push(`Lỗi khi phân tích JWT: ${e.message}`);
                    }
                }

                // Bước 3: Kiểm tra quyền seller, chỉ gọi một endpoint duy nhất
                if (token) {
                    try {
                        // Đặt token vào header cho request
                        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                        // Chỉ gọi một API endpoint thay vì nhiều endpoint
                        try {
                            console.log('Gọi API xác thực seller');
                            const response = await api.get('/seller/verify-role');
                            console.log('Phản hồi từ verify-role:', response.data);

                            debugData.apiResponses.push({
                                endpoint: '/seller/verify-role',
                                status: response.status,
                                data: response.data
                            });

                            // Kiểm tra xem có phải seller không
                            const isSeller = checkIfSeller(response.data);
                            debugData.isSeller = isSeller;

                            if (!isSeller && !DEBUG_MODE) {
                                setAuthError('Bạn không có quyền seller để truy cập trang quản lý');
                                redirectToCustomerLogin();
                                return;
                            }
                        } catch (error) {
                            console.error('Lỗi khi gọi API xác thực:', error);
                            debugData.errors.push(`Lỗi khi gọi API xác thực: ${error.message}`);

                            if (error.response) {
                                debugData.apiResponses.push({
                                    endpoint: '/seller/verify-role',
                                    status: error.response.status,
                                    error: error.response.data
                                });
                            }

                            // Nếu lỗi 429 (rate limit) thì xác thực trực tiếp từ JWT
                            if (error.response && error.response.status === 429) {
                                console.log('Bị rate limit, kiểm tra JWT trực tiếp');
                                if (debugData.tokenPayload) {
                                    const isSeller = isSellerFromToken(token);
                                    console.log('Xác thực quyền seller từ JWT payload:', isSeller);
                                    debugData.tokenAnalysis = {
                                        isSeller,
                                        method: 'JWT direct check (rate limited)'
                                    };

                                    // Nếu không phải seller và không ở DEBUG_MODE
                                    if (!isSeller && !DEBUG_MODE) {
                                        setAuthError('Bạn không có quyền seller để truy cập trang quản lý');
                                        redirectToCustomerLogin();
                                        return;
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Lỗi tổng quát khi kiểm tra quyền:', error);
                        debugData.errors.push(`Lỗi tổng quát: ${error.message}`);
                    }
                }

                // Cập nhật thông tin debug
                setDebugInfo(debugData);

                // Trong DEBUG_MODE, luôn cho phép xem giao diện, bỏ qua lỗi xác thực
                if (DEBUG_MODE) {
                    console.log('DEBUG MODE: Bỏ qua kiểm tra xác thực, hiển thị ứng dụng');
                    setIsAuthChecking(false);
                    return;
                }

                // Logic bình thường (khi không trong DEBUG_MODE)
                setIsAuthChecking(false);

            } catch (error) {
                console.error('Lỗi kiểm tra xác thực:', error);
                setAuthError('Đã xảy ra lỗi khi kiểm tra xác thực.');
                const updatedDebugInfo = {
                    ...debugInfo,
                    errors: [...debugInfo.errors, `Lỗi tổng quát: ${error.message}`]
                };
                setDebugInfo(updatedDebugInfo);

                if (!DEBUG_MODE) {
                    setTimeout(() => redirectToCustomerLogin(), 3000);
                } else {
                    setIsAuthChecking(false);
                }
            }
        };

        checkAuth();
    }, [navigate]);

    // Hàm kiểm tra từ response API có phải seller không
    const checkIfSeller = (responseData) => {
        // Kiểm tra nhiều cấu trúc dữ liệu có thể có
        return (responseData?.data?.isSeller) ||
            (responseData?.isSeller) ||
            (responseData?.role === 'SELLER') ||
            (responseData?.data?.role === 'SELLER') ||
            (Array.isArray(responseData?.roles) && responseData.roles.includes('SELLER')) ||
            (Array.isArray(responseData?.data?.roles) && responseData.data.roles.includes('SELLER'));
    };

    // Hàm kiểm tra quyền seller từ JWT payload
    const isSellerFromToken = (token) => {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return false;

            const payload = JSON.parse(atob(parts[1]));
            console.log('JWT payload:', payload);

            // Kiểm tra vai trò từ payload
            if (payload.roles && Array.isArray(payload.roles)) {
                return payload.roles.includes('SELLER') || payload.roles.includes('ROLE_SELLER');
            }

            // Trường hợp role là string
            return payload.role === 'SELLER' || payload.role === 'ROLE_SELLER';
        } catch (e) {
            console.error('Lỗi khi phân tích JWT:', e);
            return false;
        }
    };

    // Hàm chuyển hướng về trang đăng nhập của customer
    const redirectToCustomerLogin = () => {
        if (DEBUG_MODE) {
            console.log('DEBUG MODE: Bỏ qua việc chuyển hướng tới trang đăng nhập customer');
            return;
        }

        console.log(`Chuyển hướng đến: http://localhost:5173/login`);
        // Thêm tham số để customer app biết đây là redirect từ seller app
        window.location.href = `http://localhost:5173/login?redirect=seller`;
    };

    if (isAuthChecking) {
        return <LoadingSpinner />;
    }

    if (authError && !DEBUG_MODE) {
        return (
            <div className="auth-error-container">
                <div className="auth-error">
                    <h2>Thông báo xác thực</h2>
                    <p>{authError}</p>
                    <p>Đang chuyển hướng về trang đăng nhập...</p>
                </div>
            </div>
        );
    }

    // Hiển thị thông tin debug nếu có lỗi trong DEBUG_MODE
    if (DEBUG_MODE && (authError || debugInfo.errors.length > 0)) {
        return (
            <div style={{padding: '20px', fontFamily: 'monospace', backgroundColor: '#f5f5f5'}}>
                <h2>Debug Mode - Thông tin xác thực</h2>
                <p style={{color: 'red'}}>⚠️ Phát hiện lỗi xác thực, nhưng đang ở chế độ DEBUG_MODE nên không chuyển hướng</p>

                {authError && (
                    <div style={{marginBottom: '20px'}}>
                        <h3>Lỗi xác thực:</h3>
                        <p style={{color: 'red'}}>{authError}</p>
                    </div>
                )}

                <h3>Thông tin Token:</h3>
                <pre style={{background: '#eee', padding: '10px'}}>
                    {debugInfo.token ?
                        `Token (Phần đầu): ${debugInfo.token}` :
                        'Không tìm thấy token'}
                </pre>

                {debugInfo.tokenPayload && (
                    <div>
                        <h3>JWT Payload:</h3>
                        <pre style={{background: '#eee', padding: '10px'}}>
                            {JSON.stringify(debugInfo.tokenPayload, null, 2)}
                        </pre>

                        {debugInfo.tokenAnalysis && (
                            <div>
                                <p style={{color: debugInfo.tokenAnalysis.isSeller ? 'green' : 'red'}}>
                                    <strong>Phân tích JWT:</strong> {debugInfo.tokenAnalysis.isSeller ? '✅ Có quyền SELLER' : '❌ Không có quyền SELLER'}
                                </p>
                                <p><strong>Phương thức kiểm tra:</strong> {debugInfo.tokenAnalysis.method}</p>
                            </div>
                        )}
                    </div>
                )}

                {debugInfo.errors.length > 0 && (
                    <div>
                        <h3>Lỗi gặp phải:</h3>
                        <ul style={{color: 'red'}}>
                            {debugInfo.errors.map((err, index) => (
                                <li key={index}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {debugInfo.apiResponses.length > 0 && (
                    <div>
                        <h3>Phản hồi API:</h3>
                        {debugInfo.apiResponses.map((resp, index) => (
                            <div key={index} style={{marginBottom: '15px'}}>
                                <h4>{resp.endpoint} - Status: {resp.status}</h4>
                                <pre style={{background: '#eee', padding: '10px'}}>
                                    {JSON.stringify(resp.data || resp.error, null, 2)}
                                </pre>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{marginTop: '30px'}}>
                    <button
                        onClick={() => {
                            localStorage.removeItem(TOKEN_KEY);
                            window.location.reload();
                        }}
                        style={{padding: '10px 15px', marginRight: '10px', backgroundColor: '#ff4d4f', color: 'white', border: 'none'}}
                    >
                        Xóa token và thử lại
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{padding: '10px 15px', marginRight: '10px', backgroundColor: '#1890ff', color: 'white', border: 'none'}}
                    >
                        Bỏ qua và vào Dashboard
                    </button>
                    <button
                        onClick={() => window.location.href = 'http://localhost:5173/login?redirect=seller'}
                        style={{padding: '10px 15px', border: '1px solid #d9d9d9'}}
                    >
                        Đi tới trang đăng nhập Customer
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

export default AuthBridge;