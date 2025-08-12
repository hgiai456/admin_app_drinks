import React, { useState, useEffect } from 'react';
import { BannerAPI } from '@api/bannerapi';
import '@styles/pages/_homepage.scss';

export default function HomePage() {
    const [banners, setBanners] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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
                        title: 'KATINAT Coffee & Tea House',
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
            {/* ✅ HEADER */}
            <header className='homepage-header'>
                <div className='header-container'>
                    <div className='logo-section'>
                        <img
                            src='https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751092040674-logo.png?alt=media&token=4b72bf76-9c9c-4257-9290-808098ceac2f'
                            alt='HG COFFEE'
                            className='logo'
                        />
                        <h1 className='brand-name'>KATINAT</h1>
                        <span className='brand-subtitle'>
                            COFFEE & TEA HOUSE
                        </span>
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
                            KATINAT REWARD CLUB
                        </a>
                        <a href='#news' className='nav-link'>
                            TIN TỨC & SỰ KIỆN
                        </a>
                        <a href='#contact' className='nav-link'>
                            VỀ HG COFFEE
                        </a>
                    </nav>
                </div>
            </header>

            {/* ✅ HERO SLIDER */}
            <section className='hero-slider'>
                <div className='slider-container'>
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id || index}
                            className={`slide ${
                                index === currentSlide ? 'active' : ''
                            }`}
                        >
                            <div className='slide-content'>
                                <div className='slide-text'>
                                    <h2 className='slide-title'>
                                        {banner.title || 'TÍNH NĂNG MỚI'}
                                        <span className='highlight-badge'>
                                            MỚI
                                        </span>
                                    </h2>
                                    <h3 className='slide-subtitle'>
                                        {banner.subtitle || 'ĐƠN NHÓM KATIES'}
                                    </h3>
                                    <p className='slide-description'>
                                        {banner.description ||
                                            'CÀNG ĐÔNG CÀNG VUI'}
                                    </p>
                                    <div className='slide-buttons'>
                                        <button className='btn-primary'>
                                            <span className='btn-icon'>🎁</span>
                                            {banner.buttonText ||
                                                'ƯU ĐÃI ĐÃ TẶNG'}
                                        </button>
                                        <button className='btn-secondary'>
                                            <span className='btn-icon'>👥</span>
                                            ƯU ĐÃI THEO SỐ LƯỢNG KATIES
                                        </button>
                                    </div>
                                </div>
                                <div className='slide-image'>
                                    <img
                                        src={
                                            banner.image ||
                                            '/default-banner.jpg'
                                        }
                                        alt={banner.title || 'Banner'}
                                        onError={(e) => {
                                            e.target.src =
                                                'https://via.placeholder.com/600x400/17a2b8/ffffff?text=KATINAT';
                                        }}
                                    />
                                    <div className='floating-elements'>
                                        <div className='coffee-cup cup-1'>
                                            ☕
                                        </div>
                                        <div className='coffee-cup cup-2'>
                                            🥤
                                        </div>
                                        <div className='coffee-cup cup-3'>
                                            🧋
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ✅ SLIDER CONTROLS */}
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

                        <div className='slider-dots'>
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    className={`dot ${
                                        index === currentSlide ? 'active' : ''
                                    }`}
                                    onClick={() => goToSlide(index)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* ✅ FEATURES SECTION */}
            <section className='features-section'>
                <div className='container'>
                    <h2 className='section-title'>Tại sao chọn KATINAT?</h2>
                    <div className='features-grid'>
                        <div className='feature-card'>
                            <div className='feature-icon'>☕</div>
                            <h3>Chất lượng cao</h3>
                            <p>Nguyên liệu tươi ngon, được chọn lọc kỹ càng</p>
                        </div>
                        <div className='feature-card'>
                            <div className='feature-icon'>🏪</div>
                            <h3>Không gian ấm cúng</h3>
                            <p>Thiết kế hiện đại, thoải mái và thân thiện</p>
                        </div>
                        <div className='feature-card'>
                            <div className='feature-icon'>👥</div>
                            <h3>Phục vụ tận tâm</h3>
                            <p>Đội ngũ nhân viên chuyên nghiệp, chu đáo</p>
                        </div>
                        <div className='feature-card'>
                            <div className='feature-icon'>🎁</div>
                            <h3>Ưu đãi hấp dẫn</h3>
                            <p>Chương trình khuyến mãi và tích điểm liên tục</p>
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
                            <p>Nơi kết nối những tâm hồn yêu cà phê</p>
                        </div>
                        <div className='footer-section'>
                            <h4>Liên hệ</h4>
                            <p>📞 1900 6936</p>
                            <p>📧 info@katinat.vn</p>
                        </div>
                        <div className='footer-section'>
                            <h4>Theo dõi chúng tôi</h4>
                            <div className='social-links'>
                                <a href='#' className='social-link'>
                                    Facebook
                                </a>
                                <a href='#' className='social-link'>
                                    Instagram
                                </a>
                                <a href='#' className='social-link'>
                                    Zalo
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className='footer-bottom'>
                        <p>&copy; 2024 HG COFFEE. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
