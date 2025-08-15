import React, { useState } from 'react';

export default function Header({ user, onLogout, currentPage = 'home' }) {
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleEditProfile = () => {
        alert('Chức năng chỉnh sửa thông tin đang được phát triển.');
        setShowUserMenu(false);
    };

    const handleLogout = () => {
        onLogout();
        setShowUserMenu(false);
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
                        href='#rewards'
                        className={`nav-link ${
                            currentPage === 'rewards' ? 'active' : ''
                        }`}
                    >
                        REWARDS
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
                        LIÊN HỆ
                    </a>
                </nav>

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
