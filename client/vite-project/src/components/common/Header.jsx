import { useState, useEffect } from 'react';
import CartAPI from '@api/cartapi.js';
import CartButton from '@components/customer/CartButton';
import '@styles/pages/_header.scss';

export default function Header({
    user,
    onLogout,
    currentPage = 'home',
    onCartCountChange
}) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);

    // ✅ LOAD CART ITEM COUNT
    useEffect(() => {
        loadCartCount();
    }, [user]);

    useEffect(() => {
        const handleCartRefresh = () => {
            loadCartCount();
        };

        // Listen to custom event
        window.addEventListener('refreshCartCount', handleCartRefresh);

        return () => {
            window.removeEventListener('refreshCartCount', handleCartRefresh);
        };
    }, [user]);
    const handleEditProfile = () => {
        alert('Chức năng chỉnh sửa thông tin đang được phát triển.');
        setShowUserMenu(false);
    };

    const handleLogout = () => {
        onLogout();
        setShowUserMenu(false);
    };

    const loadCartCount = async () => {
        if (!user?.id) {
            setCartItemCount(0);
            return;
        }
        setCartLoading(true);
        try {
            const count = await CartAPI.getCartItemCount(user.id);
            setCartItemCount(count);
        } catch (error) {
            console.error('❌ Error loading cart count:', error);
            setCartItemCount(0);
        } finally {
            setCartLoading(false);
        }
    };

    const handleNavigation = (hash) => {
        window.location.hash = hash;
        setIsMenuOpen(false);
    };

    const handleCartClick = () => {
        handleNavigation('cart');
        loadCartCount();
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className='homepage-header'>
            <div className='header-container'>
                <div className='logo-section'>
                    <div className='logo-container'>
                        <img
                            src='https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751092040674-logo.png?alt=media&token=4b72bf76-9c9c-4257-9290-808098ceac2f'
                            alt='HG COFFEE'
                            className='logo'
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                    <div className='brand-info'>
                        <h1 className='brand-name'>HG COFFEE</h1>
                        <span className='brand-subtitle'>
                            COFFEE & TEA HOUSE
                        </span>
                    </div>
                </div>

                <nav className='main-nav'>
                    <a
                        href='#home'
                        className={`nav-link ${
                            currentPage === 'home' ? 'active' : ''
                        }`}
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.hash = 'home';
                        }}
                    >
                        TRANG CHỦ
                    </a>
                    <a
                        href='#menu'
                        className={`nav-link ${
                            currentPage === 'menu' ? 'active' : ''
                        }`}
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.hash = 'menu';
                        }}
                    >
                        MENU
                    </a>
                    <a
                        href='#store'
                        className={`nav-link ${
                            currentPage === 'store' ? 'active' : ''
                        }`}
                    >
                        CỬA HÀNG
                    </a>

                    <a
                        href='#news'
                        className={`nav-link ${
                            currentPage === 'news' ? 'active' : ''
                        }`}
                    >
                        TIN TỨC
                    </a>
                    <a
                        href='#contact'
                        className={`nav-link ${
                            currentPage === 'contact' ? 'active' : ''
                        }`}
                    >
                        VỀ CHÚNG TÔI
                    </a>
                </nav>
                <div className='header-actions'>
                    <CartButton
                        cartItemCount={cartItemCount}
                        currentPage={currentPage}
                        onCartClick={handleCartClick}
                        variant='default' // hoặc "minimal", "outlined"
                        onRefreshCount={loadCartCount}
                        cartLoading={cartLoading}
                    />
                </div>

                {/* ✅ USER MENU */}
                <div className='user-section'>
                    <div
                        className='user-dropdown'
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        <div className='user-avatar'>
                            <span>
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div className='user-info'>
                            <span className='user-name'>
                                {user?.username || 'User'}
                            </span>
                            <span className='user-role'>Khách hàng</span>
                        </div>
                        <div className='dropdown-arrow'>▼</div>
                    </div>

                    {showUserMenu && (
                        <div className='user-menu'>
                            <button
                                className='menu-item'
                                onClick={handleEditProfile}
                            >
                                <span className='menu-icon'>👤</span>
                                <span>Chỉnh sửa thông tin</span>
                            </button>
                            <button
                                className='menu-item logout'
                                onClick={handleLogout}
                            >
                                <span className='menu-icon'>🚪</span>
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
