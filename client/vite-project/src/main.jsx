import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Import các component gốc của bạn
import StoreComponent from '@components/admin/StoreComponent.jsx';
import BrandComponent from '@components/admin/BrandComponent.jsx';
import '@styles/pages/_admin.scss';
import CategoryComponent from '@components/admin/CategoryComponent.jsx';
import ProdetailComponent from '@components/admin/ProdetailComponent.jsx';
import BannerComponent from '@components/admin/BannerComponent.jsx';
import UserComponent from '@components/admin/UserComponent.jsx';
import ProductComponent from '@components/admin/ProductComponent.jsx';
import SizeComponent from '@components/admin/SizeComponent.jsx';
import OrderComponent from '@components/admin/OrderComponent.jsx';
import ImageComponent from '@components/admin/ImageComponent.jsx';
import LoginAdmin from '@components/admin/LoginAdmin.jsx';
import RegisterComponent from './components/customer/RegisterComponent';
import HomePage from '@components/customer/HomePage.jsx';
import ProductPage from '@components/customer/ProductPage.jsx';

// ✅ THÊM STYLED COMPONENT WRAPPER
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

export default function AuthContainer({ onLogin }) {
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
        return <RegisterComponent onRegisterSuccess={handleRegisterSuccess} />;
    }

    return (
        <LoginAdmin
            onLogin={onLogin}
            onSwitchToRegister={handleSwitchToRegister}
            successMessage={successMessage}
            onClearMessage={handleClearMessage}
        />
    );
}

function App() {
    const [currentPage, setCurrentPage] = useState('Order');
    const [user, setUser] = useState(null);

    // Kiểm tra token và user khi load lại trang
    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        const userData = localStorage.getItem('admin_user');
        if (token && userData) {
            try {
                const userObj = JSON.parse(userData);
                if (userObj.role === 1 || userObj.role === 2) {
                    setUser(userObj);
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

    // Hàm xử lý khi đăng nhập thành công
    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('admin_user', JSON.stringify(userData));

        if (userData.role === 2) {
            setCurrentPage('Quản lý đơn hàng');
        }
    };

    // Hàm đăng xuất
    const handleLogout = () => {
        const roleText = user?.role === 1 ? 'Khách hàng' : 'admin';
        if (confirm('bạn có chắc muốn đăng xuất?')) {
            setUser(null);
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            setCurrentPage('Quản lý đơn hàng');
        }
    };
    //Route từ login sang Register
    if (!user) {
        return <AuthContainer onLogin={handleLogin} />;
    }

    if (user.role === 1) {
        return <CustomerRouter user={user} onLogout={handleLogout} />;
    }

    if (user.role === 2) {
        const renderPage = () => {
            // ✅ CẬP NHẬT COMPONENT NAMES THEO TÊN MỚI
            switch (currentPage) {
                case 'Quản lý đơn hàng':
                    return (
                        <StyledComponentWrapper>
                            <OrderComponent />
                        </StyledComponentWrapper>
                    );
                case 'Quản lý cửa hàng':
                    return (
                        <StyledComponentWrapper>
                            <StoreComponent />
                        </StyledComponentWrapper>
                    );
                case 'Quản lý thương hiệu':
                    return (
                        <StyledComponentWrapper>
                            <BrandComponent />
                        </StyledComponentWrapper>
                    );
                case 'Quản lý danh mục':
                    return (
                        <StyledComponentWrapper>
                            <CategoryComponent />
                        </StyledComponentWrapper>
                    );
                case 'Quản lý sản phẩm':
                    return (
                        <StyledComponentWrapper>
                            <ProductComponent />
                        </StyledComponentWrapper>
                    );
                case 'Quản lý người dùng':
                    return (
                        <StyledComponentWrapper>
                            <UserComponent />
                        </StyledComponentWrapper>
                    );
                case 'Quản lý kích thước':
                    return (
                        <StyledComponentWrapper>
                            <SizeComponent />
                        </StyledComponentWrapper>
                    );
                case 'Quản lý banner':
                    return (
                        <StyledComponentWrapper>
                            <BannerComponent />
                        </StyledComponentWrapper>
                    );
                case 'Quản lý chi tiết sản phẩm':
                    return (
                        <StyledComponentWrapper>
                            <ProdetailComponent />
                        </StyledComponentWrapper>
                    );
                case 'Quản lý hình ảnh':
                    return (
                        <StyledComponentWrapper
                            title='Quản lý hình ảnh'
                            description='Upload và quản lý ảnh'
                        >
                            <ImageComponent />
                        </StyledComponentWrapper>
                    );
                default:
                    return (
                        <StyledComponentWrapper>
                            <OrderComponent />
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
}

function CustomerRouter({ user, onLogout }) {
    const [currentPage, setCurrentPage] = useState('home');

    // ✅ LISTEN TO URL HASH CHANGES
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '') || 'home';
            setCurrentPage(hash);
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Set initial page

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    // ✅ RENDER PAGES BASED ON HASH
    switch (currentPage) {
        case 'home':
            return <HomePage user={user} onLogout={onLogout} />;
        case 'menu':
            return <ProductPage user={user} onLogout={onLogout} />;
        default:
            return <HomePage user={user} onLogout={onLogout} />;
    }
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);
