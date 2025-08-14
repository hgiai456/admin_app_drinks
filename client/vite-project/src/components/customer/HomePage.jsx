import React, { useState, useEffect } from 'react';
import { BannerAPI } from '@api/bannerapi';
import '@styles/pages/_homepage.scss';

export default function HomePage({ user, onLogout }) {
    const [banners, setBanners] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    //Fetch banner tu API
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setLoading(true);
                const data = await BannerAPI.getAll();
                setBanners(data || []);
                setError('');
            } catch (error) {
                console.error('Error fetching banners: ', error);
                setError('Không thể tải banner');
                // Fallback banners
                setBanners([
                    {
                        id: 1,
                        title: 'HG Coffee',
                        subtitle: 'Khám phá hương vị đặc biệt',
                        description:
                            'Trải nghiệm không gian thư giãn với những thức uống chất lượng cao',
                        image: 'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751092040674-logo.png?alt=media&token=4b72bf76-9c9c-4257-9290-808098ceac2f',
                        buttonText: 'Khám phá ngay'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 3000); // Change slide eveery 5 seconds
        return () => clearInterval(interval);
    }, [banners.length]);

    //Manual slide navigation
    const goToSlide = (index) => {
        setCurrentSlide(index);
    };
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };
    const handleEditProfile = () => {
        alert('Chức năng chỉnh sửa thông tin đăng được phát triển.');
        setShowUserMenu(false);
    };
    const handleLogout = () => {
        onLogout();
        setShowUserMenu(false);
    };
    if (loading) {
        return (
            <div className='homepage-loading'>
                <div className='loading-spinner'>☕</div>
                <p>Đang tải...</p>
            </div>
        );
    }

    return (
        <div className='homepage'>
            {/* ✅ ENHANCED HEADER */}
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
                                    e.target.nextElementSibling.style.display =
                                        'flex';
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
                        <a href='#home' className='nav-link active'>
                            TRANG CHỦ
                        </a>
                        <a href='#menu' className='nav-link'>
                            MENU
                        </a>
                        <a href='#store' className='nav-link'>
                            CỬA HÀNG
                        </a>
                        <a href='#rewards' className='nav-link'>
                            REWARDS
                        </a>
                        <a href='#news' className='nav-link'>
                            TIN TỨC
                        </a>
                        <a href='#contact' className='nav-link'>
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
                                    {user?.username?.charAt(0).toUpperCase() ||
                                        'U'}
                                </span>
                            </div>
                            <div className='user-info'>
                                <span className='user-name'>
                                    {user?.name || 'User'}
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

            {/* ✅ FIXED FULL-WIDTH HERO SLIDER */}
            <section className='hero-slider'>
                <div className='slider-container'>
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id || index}
                            className={`slide ${
                                index === currentSlide ? 'active' : ''
                            }`}
                        >
                            <div className='slide-background'>
                                <img
                                    src={banner.image}
                                    alt={banner.title || 'Banner'}
                                    onError={(e) => {
                                        const fallbackImages = [
                                            'https://images.unsplash.com/photo-1507226983735-a4af7b65e7c3?w=1400&h=700&q=80&fit=crop',
                                            'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1400&h=700&q=80&fit=crop',
                                            'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1400&h=700&q=80&fit=crop'
                                        ];
                                        e.target.src =
                                            fallbackImages[
                                                index % fallbackImages.length
                                            ];
                                    }}
                                />
                                <div className='slide-overlay'></div>
                            </div>

                            <div className='slide-content'>
                                <div className='content-wrapper'>
                                    <div className='slide-text'>
                                        <div className='slide-badge'>
                                            <span>🔥 HOT</span>
                                        </div>
                                        <h2 className='slide-title'>
                                            {banner.title || 'HG COFFEE'}
                                        </h2>
                                        <h3 className='slide-subtitle'>
                                            {banner.subtitle ||
                                                'Khám phá hương vị đặc biệt'}
                                        </h3>
                                        <p className='slide-description'>
                                            {banner.description ||
                                                'Trải nghiệm không gian thư giãn với những thức uống chất lượng cao'}
                                        </p>
                                        <div className='slide-buttons'>
                                            <button className='btn-primary'>
                                                <span className='btn-icon'>
                                                    🎯
                                                </span>
                                                <span>
                                                    {banner.buttonText ||
                                                        'Khám phá ngay'}
                                                </span>
                                            </button>
                                            <button className='btn-secondary'>
                                                <span className='btn-icon'>
                                                    📍
                                                </span>
                                                <span>Tìm cửa hàng</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className='slide-visual'>
                                        <div className='product-showcase'>
                                            {/* <div className='floating-cup cup-1'>
                                                ☕
                                            </div>
                                            <div className='floating-cup cup-2'>
                                                🥤
                                            </div>
                                            <div className='floating-cup cup-3'>
                                                🧋
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ✅ ENHANCED SLIDER CONTROLS */}
                {banners.length > 1 && (
                    <>
                        <button
                            className='slider-btn prev-btn'
                            onClick={prevSlide}
                        >
                            <span>‹</span>
                        </button>
                        <button
                            className='slider-btn next-btn'
                            onClick={nextSlide}
                        >
                            <span>›</span>
                        </button>

                        <div className='slider-pagination'>
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    className={`pagination-dot ${
                                        index === currentSlide ? 'active' : ''
                                    }`}
                                    onClick={() => goToSlide(index)}
                                >
                                    <span className='dot-number'>
                                        {index + 1}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className='slider-progress'>
                            <div
                                className='progress-bar'
                                style={{
                                    width: `${
                                        ((currentSlide + 1) / banners.length) *
                                        100
                                    }%`
                                }}
                            />
                        </div>
                    </>
                )}
            </section>

            {/* ✅ FEATURES SECTION */}
            <section className='features-section'>
                <div className='container'>
                    <div className='section-header'>
                        <h2 className='section-title'>
                            Tại sao chọn HG COFFEE?
                        </h2>
                        <p className='section-subtitle'>
                            Những lý do khiến khách hàng tin tưởng và yêu thích
                            chúng tôi
                        </p>
                    </div>
                    <div className='features-grid'>
                        <div className='feature-card'>
                            <div className='feature-icon'>☕</div>
                            <h3>Chất lượng cao</h3>
                            <p>
                                Nguyên liệu tươi ngon, được chọn lọc kỹ càng từ
                                những vùng cà phê nổi tiếng
                            </p>
                        </div>
                        <div className='feature-card'>
                            <div className='feature-icon'>🏪</div>
                            <h3>Không gian ấm cúng</h3>
                            <p>
                                Thiết kế hiện đại, thoải mái và thân thiện cho
                                cả work và relax
                            </p>
                        </div>
                        <div className='feature-card'>
                            <div className='feature-icon'>👥</div>
                            <h3>Phục vụ tận tâm</h3>
                            <p>
                                Đội ngũ nhân viên chuyên nghiệp, chu đáo và
                                nhiệt tình
                            </p>
                        </div>
                        <div className='feature-card'>
                            <div className='feature-icon'>🎁</div>
                            <h3>Ưu đãi hấp dẫn</h3>
                            <p>
                                Chương trình khuyến mãi và tích điểm thành viên
                                liên tục
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ✅ FOOTER */}
            <footer className='homepage-footer'>
                <div className='container'>
                    <div className='footer-content'>
                        <div className='footer-section'>
                            <h4>HG Coffee & Tea House</h4>
                            <p>Nơi kết nối những tâm hồn yêu cà phê và trà</p>
                            <p>Hơn 10 năm đồng hành cùng khách hàng</p>
                        </div>
                        <div className='footer-section'>
                            <h4>Liên hệ</h4>
                            <p>📞 1900 6936</p>
                            <p>📧 info@hgcoffee.vn</p>
                            <p>📍 123 Nguyễn Huệ, Q1, TP.HCM</p>
                        </div>
                        <div className='footer-section'>
                            <h4>Giờ mở cửa</h4>
                            <p>🕐 Thứ 2 - CN: 7:00 - 22:00</p>
                            <p>🎉 Lễ Tết: 8:00 - 20:00</p>
                        </div>
                        <div className='footer-section'>
                            <h4>Theo dõi chúng tôi</h4>
                            <div className='social-links'>
                                <a href='#' className='social-link'>
                                    📘 Facebook
                                </a>
                                <a href='#' className='social-link'>
                                    📷 Instagram
                                </a>
                                <a href='#' className='social-link'>
                                    💬 Zalo
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className='footer-bottom'>
                        <p>
                            &copy; 2024 HG COFFEE. All rights reserved. Made
                            with ❤️ in Vietnam
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
