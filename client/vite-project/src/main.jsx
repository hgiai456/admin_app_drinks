import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Import các component gốc của bạn
import StoreManagement from '@pages/admin/StoreManagement.jsx';
import BrandManagement from '@pages/admin/BrandManagement.jsx';
import CategoryManagement from '@pages/admin/CategoryManagement.jsx';
import ProdetailManagement from '@pages/admin/ProdetailManagement.jsx';
import BannerManagement from '@pages/admin/BannerManagement.jsx';
import UserManagement from '@pages/admin/UserManagement.jsx';
import ProductManagement from '@pages/admin/ProductManagement.jsx';
import SizeManagement from '@pages/admin/SizeManagement.jsx';
import OrderManagement from '@pages/admin/OrderManagement.jsx';
import ImageManagement from '@pages/admin/ImageManagement.jsx';
import LoginAdmin from '@pages/admin/LoginAdmin.jsx';

import '@styles/pages/_admin.scss';
import ProductPage from '@pages/customer/ProductPage.jsx';
import ProductDetailPage from '@pages/customer/ProductDetailPage.jsx';
import CartPage from '@pages/customer/CartPage.jsx';
import CheckoutPage from '@pages/customer/CheckoutPage.jsx';
import PaymentResult from '@pages/customer/PaymentResult.jsx';
import OrderHistory from '@pages/customer/OrderHistory.jsx';
import Layout from '@components/common/Layout.jsx';
import HomePage from '@pages/customer/HomePage.jsx';
import RegisterPage from '@pages/customer/RegisterPage.jsx';

// THÊM STYLED COMPONENT WRAPPER
function StyledComponentWrapper({ children, title, description }) {
    return (
        <div className='component-wrapper'>
            {title && (
                <div className='component-header'>
                    <h2>{title}</h2>
                    {description && <p>{description}</p>}
                </div>
            )}
            {children}
        </div>
    );
}

function Sidebar({ currentPage, setCurrentPage, onLogout, admin }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const pages = [
        { name: 'Quản lý đơn hàng', icon: '📋' },
        { name: 'Quản lý cửa hàng', icon: '🏪' },
        { name: 'Quản lý thương hiệu', icon: '🏷️' },
        { name: 'Quản lý danh mục', icon: '📁' },
        { name: 'Quản lý sản phẩm', icon: '🛍️' },
        { name: 'Quản lý người dùng', icon: '👥' },
        { name: 'Quản lý kích thước', icon: '📏' },
        { name: 'Quản lý banner', icon: '🎨' },
        { name: 'Quản lý chi tiết sản phẩm', icon: '🛍️' },
        { name: 'Quản lý hình ảnh', icon: '🖼️' }
    ];
    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Sidebar Header */}
            <div className='sidebar-header'>
                <div className='sidebar-brand'>
                    {/* ✅ LOGO CONTAINER - CENTERED */}
                    <div className='brand-logo'>
                        <img
                            src='https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751092040674-logo.png?alt=media&token=4b72bf76-9c9c-4257-9290-808098ceac2f'
                            alt='Logo'
                            className='sidebar-logo'
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display =
                                    'block';
                            }}
                        />
                        <span className='brand-icon'>🍹</span>
                    </div>

                    {/* ✅ BRAND TEXT - BELOW LOGO */}
                    {!isCollapsed && (
                        <div className='brand-content'>
                            <span className='brand-text'>Admin Panel</span>
                            <span className='brand-subtitle'>
                                Management System
                            </span>
                        </div>
                    )}
                </div>

                {/* ✅ TOGGLE BUTTON */}
                <button
                    className='sidebar-toggle'
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? '➡️' : '⬅️'}
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className='sidebar-nav'>
                {pages.map((page) => (
                    <button
                        key={page.name}
                        onClick={() => setCurrentPage(page.name)}
                        className={`nav-item ${
                            currentPage === page.name ? 'active' : ''
                        }`}
                        data-page={page.name}
                        style={{ '--accent-color': page.color }}
                        title={isCollapsed ? page.name : ''}
                    >
                        <span className='nav-icon'>{page.icon}</span>
                        {!isCollapsed && (
                            <span className='nav-text'>{page.name}</span>
                        )}
                        {currentPage === page.name && (
                            <div className='nav-indicator' />
                        )}
                    </button>
                ))}
            </nav>

            {/* Sidebar Footer */}
            <div className='sidebar-footer'>
                {!isCollapsed && (
                    <>
                        <div className='admin-info'>
                            <div className='admin-avatar'>👨‍💼</div>
                            <div className='admin-details'>
                                <span className='admin-name'>Admin</span>
                                <span className='admin-role'>Super User</span>
                            </div>
                        </div>

                        <button
                            className='logout-btn-sidebar'
                            onClick={onLogout}
                            title='Đăng xuất khỏi hệ thống'
                        >
                            <span className='logout-text'>Đăng xuất</span>
                            <div className='logout-arrow'>→</div>
                        </button>
                    </>
                )}
                {isCollapsed && (
                    <button
                        className='logout-btn-collapsed'
                        onClick={onLogout}
                        title='Đăng xuất'
                    >
                        <span className='logout-icon'>🚪</span>
                    </button>
                )}
            </div>
        </aside>
    );
}

function Header({ currentPage }) {
    // ✅ DANH SÁCH CÁC COMPONENT MUỐN ẨN HEADER
    const hideHeaderPages = [
        'Quản lý đơn hàng',
        'Quản lý sản phẩm',
        'Quản lý chi tiết sản phẩm',
        'Quản lý cửa hàng',
        'Quản lý thương hiệu',
        'Quản lý danh mục',
        'Quản lý người dùng'
        // Thêm các trang khác nếu cần
    ];

    if (hideHeaderPages.includes(currentPage)) {
        return null; // Ẩn header cho các trang này
    }

    // ✅ HIỂN THỊ HEADER CHO CÁC TRANG KHÁC (nếu có)
    const getCurrentPageInfo = () => {
        const pageMap = {
            // ... các trang khác không bị ẩn header
        };
        return pageMap[currentPage] || { title: currentPage, subtitle: '' };
    };

    const pageInfo = getCurrentPageInfo();
    return (
        <header className='main-header'>
            <div className='header-content'></div>
        </header>
    );
}

// ✅ MAIN LAYOUT COMPONENT
function AdminLayout({
    children,
    currentPage,
    setCurrentPage,
    onLogout,
    admin
}) {
    return (
        <div className='admin-layout'>
            <Sidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onLogout={onLogout}
                admin={admin}
            />

            <div className='main-content'>
                <Header currentPage={currentPage} />

                <main className='content-area'>
                    <div className='content-wrapper'>{children}</div>
                </main>
            </div>
        </div>
    );
}

export default function AuthContainer({ onLogin, onGuestMode }) {
    const [currentView, setCurrentView] = useState('login');
    const [successMessage, setSuccessMessage] = useState('');
    //Chuyển sang Register
    const handleSwitchToRegister = () => {
        setCurrentView('register');
        setSuccessMessage('');
    };
    //Xử lý khi đăng ký thành công hoặc click "Đăng nhập ngay"
    const handleRegisterSuccess = (user) => {
        if (user) {
            setSuccessMessage('Đăng ký thành công', user);
            setCurrentView('login');
        } else {
            setCurrentView('login');
            setSuccessMessage('');
        }
    };
    const handleClearMessage = () => {
        setSuccessMessage('');
    };

    if (currentView === 'register') {
        return <RegisterPage onRegisterSuccess={handleRegisterSuccess} />;
    }

    return (
        <LoginAdmin
            onLogin={onLogin}
            onGuestMode={onGuestMode}
            onSwitchToRegister={handleSwitchToRegister}
            successMessage={successMessage}
            onClearMessage={handleClearMessage}
        />
    );
}

function App() {
    const [currentPage, setCurrentPage] = useState('Order');
    const [user, setUser] = useState(null);
    const [isGuestMode, setIsGuestMode] = useState(true);

    // Kiểm tra token và user khi load lại trang
    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        const userData = localStorage.getItem('admin_user');
        if (token && userData) {
            try {
                const userObj = JSON.parse(userData);
                if (userObj.role === 1 || userObj.role === 2) {
                    setUser(userObj);
                    setIsGuestMode(false);
                } else {
                    console.warn('⚠️ Invalid role: ', userObj.role);
                    // Xóa token không hợp lệ
                    localStorage.removeItem('admin_token');
                    localStorage.removeItem('admin_user');
                }
            } catch (e) {
                // Nếu lỗi parse, xóa luôn token/user
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
            }
        }
    }, []);
    // ✅ HÀM XỬ LÝ KHI MUỐN ĐĂNG NHẬP TỪ GUEST MODE
    const handleGuestToLogin = () => {
        setIsGuestMode(false);
        setUser(null);
    };
    // Hàm xử lý khi đăng nhập thành công
    const handleLogin = (userData) => {
        setUser(userData);
        setIsGuestMode(false);
        localStorage.setItem('admin_user', JSON.stringify(userData));

        if (userData.role === 2) {
            setCurrentPage('Quản lý đơn hàng');
        }
    };
    const handleGuestMode = () => {
        setIsGuestMode(true);
        setUser(null);
    };
    // Hàm đăng xuất
    const handleLogout = () => {
        const roleText = user?.role === 1 ? 'Khách hàng' : 'admin';
        if (confirm('bạn có chắc muốn đăng xuất?')) {
            setUser(null);
            setIsGuestMode(true);
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            setCurrentPage('Quản lý đơn hàng');
        }
    };
    //Route từ login sang Register
    if (!user && !isGuestMode) {
        return (
            <AuthContainer
                onLogin={handleLogin}
                onGuestMode={() => setIsGuestMode(true)}
            />
        );
    }
    if (isGuestMode || (user && user.role === 1)) {
        return (
            <CustomerRouter
                user={user}
                onLogout={handleLogout}
                isGuest={isGuestMode}
                onLogin={handleGuestToLogin}
            />
        );
    }

    if (user.role === 2) {
        const renderPage = () => {
            // ✅ CẬP NHẬT COMPONENT NAMES THEO TÊN MỚI
            switch (currentPage) {
                case 'Quản lý đơn hàng':
                    return (
                        <StyledComponentWrapper>
                            <OrderManagement />
                        </StyledComponentWrapper>
                    );
                case 'Quản lý cửa hàng':
                    return (
                        <StyledComponentWrapper>
                            <StoreManagement />
                        </StyledComponentWrapper>
                    );
                case 'Quản lý thương hiệu':
                    return (
                        <StyledComponentWrapper>
                            <BrandManagement />
                        </StyledComponentWrapper>
                    );
                case 'Quản lý danh mục':
                    return (
                        <StyledComponentWrapper>
                            <CategoryManagement />
                        </StyledComponentWrapper>
                    );
                case 'Quản lý sản phẩm':
                    return (
                        <StyledComponentWrapper>
                            <ProductManagement />
                        </StyledComponentWrapper>
                    );
                case 'Quản lý người dùng':
                    return (
                        <StyledComponentWrapper>
                            <UserManagement />
                        </StyledComponentWrapper>
                    );
                case 'Quản lý kích thước':
                    return (
                        <StyledComponentWrapper>
                            <SizeManagement />
                        </StyledComponentWrapper>
                    );
                case 'Quản lý banner':
                    return (
                        <StyledComponentWrapper>
                            <BannerManagement />
                        </StyledComponentWrapper>
                    );
                case 'Quản lý chi tiết sản phẩm':
                    return (
                        <StyledComponentWrapper>
                            <ProdetailManagement />
                        </StyledComponentWrapper>
                    );
                case 'Quản lý hình ảnh':
                    return (
                        <StyledComponentWrapper
                            title='Quản lý hình ảnh'
                            description='Upload và quản lý ảnh'
                        >
                            <ImageManagement />
                        </StyledComponentWrapper>
                    );
                default:
                    return (
                        <StyledComponentWrapper>
                            <OrderManagement />
                        </StyledComponentWrapper>
                    );
            }
        };

        return (
            <AdminLayout
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onLogout={handleLogout}
            >
                {renderPage()}
            </AdminLayout>
        );
    }

    // ✅ FALLBACK - KHÔNG BAO GIỜ XẢY RA NHƯNG AN TOÀN
    return (
        <CustomerRouter
            user={null}
            onLogout={handleLogout}
            isGuest={true}
            onLogin={handleGuestToLogin}
        />
    );
}

function CustomerRouter({ user, onLogout, isGuest = false, onLogin }) {
    const [currentPage, setCurrentPage] = useState(() => {
        const hash = window.location.hash.replace('#', '');
        return hash.split('?')[0] || 'home';
    });

    const getHashRoute = () => {
        const hash = window.location.hash.replace('#', '');
        // Tách route và query params
        const [route, queryString] = hash.split('?');
        return route || 'home';
    }

    useEffect(() => {
    const onHashChange = () => {
        const hash = window.location.hash.replace('#', '');
        setCurrentPage(hash.split('?')[0] || 'home');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
}, []);
    const [currentRoute, setCurrentRoute] = useState(getHashRoute());
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '') || 'home';
            console.log('🔄 Hash changed to:', hash);

            if (hash.startsWith('product/')) {
                console.log('📍 Setting page to product-detail');
                setCurrentPage('product-detail');
            } else {
                console.log('📍 Setting page to:', hash);
                setCurrentPage(hash);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Set initial page

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);
    
    useEffect(() => {
        const handleHashChange = () => {
            setCurrentRoute(getHashRoute());
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // ✅ HÀM XỬ LÝ ĐĂNG NHẬP (TỪ GUEST MODE)
    const handleLoginFromGuest = () => {
        console.log('🔄 Switching from guest to login mode');
        if (onLogin) {
            onLogin(); // ✅ CHUYỂN SANG LOGIN FORM
        } else {
            console.warn('⚠️ No onLogin handler in CustomerRouter');
        }
    };

    // ✅ HÀM XỬ LÝ ĐĂNG KÝ (TỪ GUEST MODE)
    const handleRegisterFromGuest = () => {
        console.log('🔄 Switching from guest to register mode');
        if (onLogin) {
            onLogin(); // ✅ CHUYỂN SANG LOGIN FORM, SAU ĐÓ CÓ THỂ CHUYỂN REGISTER
        } else {
            console.warn('⚠️ No onLogin handler in CustomerRouter');
        }
    };

    // ✅ HELPER FUNCTION ĐỂ LẤY PRODUCT ID TỪ HASH
    const getProductIdFromHash = () => {
        const hash = window.location.hash.replace('#', '');
        if (hash.startsWith('product/')) {
            const productId = hash.split('/')[1];
            console.log('✅ Product ID extracted:', productId);
            return productId;
        }
        return null;
    };

    // ✅ RENDER PAGES BASED ON HASH
    switch (currentPage) {
        case 'home':
            return (
                <HomePage
                    user={user}
                    onLogout={onLogout}
                    isGuest={isGuest}
                    onLogin={handleLoginFromGuest}
                    onRegister={handleRegisterFromGuest}
                />
            );
        case 'orders': return (
            <Layout user={user} onLogout={onLogout} isGuest={isGuest} onLogin={handleLoginFromGuest} >
                <OrderHistory user={user} />
            </Layout>
        );
        case 'menu':
            return (
                <ProductPage
                    user={user}
                    onLogout={onLogout}
                    isGuest={isGuest}
                    onLogin={handleLoginFromGuest}
                    onRegister={handleRegisterFromGuest}
                />
            );
        case 'product-detail':
            const productId = getProductIdFromHash();
            return productId ? (
                <ProductDetailPage
                    user={user}
                    onLogout={onLogout}
                    productId={productId}
                    isGuest={isGuest}
                    onLogin={handleLoginFromGuest}
                    onRegister={handleRegisterFromGuest}
                />
            ) : (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>❌ Lỗi</h2>
                    <p>Không tìm thấy ID sản phẩm</p>
                    <button onClick={() => (window.location.hash = 'home')}>
                        ← Về trang chủ
                    </button>
                </div>
            );
        case 'cart':
            return (
                <CartPage
                    user={user}
                    onLogout={onLogout}
                    isGuest={isGuest}
                    onLogin={handleLoginFromGuest}
                />
            );
        case 'checkout':
            return (
                <CheckoutPage
                    user={user}
                    onLogout={onLogout}
                    isGuest={isGuest}
                    onLogin={handleLoginFromGuest}
                />
            );
        case 'payment-result':
            return (
            <PaymentResult 
                user={user} 
                onLogout={onLogout} 
            />
        );
        default:
            console.log('⚠️ Unknown page, fallback to home');
            return (
                <HomePage
                    user={user}
                    onLogout={onLogout}
                    isGuest={isGuest}
                    onLogin={handleLoginFromGuest}
                    onRegister={handleRegisterFromGuest}
                />
            );
    }
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);
