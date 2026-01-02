import React, { useState, useEffect } from 'react';
import  BannerService from '@services/banner.service.js';
import ProductService from '@services/product.service.js'; // Import đúng
import '@styles/pages/_homepage.scss';
import CategoryService from '@services/category.service.js';
import CartService from '@services/cart.service.js'; // Import CartAPI
import Footer from '@components/common/Footer.jsx';
import Header from '@components/common/Header.jsx';
import { triggerCartRefresh } from '@components/common/UtilityFunction';

export default function HomePage({
    user,
    onLogout,
    isGuest = false,
    onLogin,
    onRegister
}) {
    const [banners, setBanners] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const headerRef = React.useRef(); // ✅ Ref để trigger refresh cart count

    // ✅ PAGINATION STATES
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState('');

    // ✅ FILTER STATES
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [addingToCart, setAddingToCart] = useState({}); // ✅ Track adding state per product
    const [message, setMessage] = useState(''); // ✅ Message state
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await CategoryService.getAll();
                console.log('📦 Categories API response:', response);

                // ✅ Xử lý response structure
                let categoriesData = [];
                if (response && response.data && Array.isArray(response.data)) {
                    categoriesData = response.data;
                } else if (Array.isArray(response)) {
                    categoriesData = response;
                }

                console.log('✅ Categories data:', categoriesData);
                setCategories(categoriesData || []);
            } catch (error) {
                console.error('❌ Error fetching categories:', error);
                // ✅ Fallback categories từ API data bạn cung cấp
                setCategories([
                    { id: 1, name: 'Cà phê' },
                    { id: 2, name: 'Trà' },
                    { id: 3, name: 'Bánh mì' },
                    { id: 4, name: 'Đá xay' },
                    { id: 8, name: 'Latte' },
                    { id: 10, name: 'Trà sữa' }
                ]);
            }
        };
        fetchCategories();
    }, []);

    // ✅ FETCH PRODUCTS WITH PAGINATION
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setProductsLoading(true);
                console.log(
                    `🔄 Fetching products - page: ${page}, search: "${search}"`
                );
                let response;
                if (selectedCategory === 'all') {
                    response = await ProductService.getPaging({
                        page: page || 1,
                        search: search || ''
                    });
                } else {
                    // ✅ LẤY SẢN PHẨM THEO CATEGORY
                    response = await ProductService.getByCategory(
                        selectedCategory,
                        {
                            page: page || 1,
                            search: search || ''
                        }
                    );
                }

                console.log('📦 Raw API response:', response);

                // ✅ XỬ LÝ RESPONSE DATA
                if (!response || !response.data) {
                    setProducts([]);
                    setTotalPage(1);
                    setTotalItems(0);
                    return;
                }

                const productsData = response.data || [];
                const pagination = response.pagination || {};

                // ✅ TRANSFORM DATA - XỬ LÝ PRICE VÀ BRAND NULL
                const transformedProducts = productsData.map((product) => ({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    image: product.image,
                    category_id: product.category_id,
                    brand_id: product.brand_id || null, // ✅ Handle null brand
                    // ✅ LẤY PRICE TỪ product_details[0].price
                    price:
                        product.product_details &&
                        product.product_details.length > 0
                            ? product.product_details[0].price
                            : 0,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt
                }));

                console.log('✅ Transformed products:', transformedProducts);

                // ✅ SET STATES
                setProducts(transformedProducts);
                setPage(pagination.currentPage || page || 1);
                setTotalPage(pagination.totalPage || 1);
                setTotalItems(pagination.totalItems || 0);
            } catch (error) {
                console.error('❌ Error fetching products:', error);
                setError('Không thể tải danh sách sản phẩm');

                // ✅ Fallback data
                setProducts([
                    {
                        id: 1,
                        name: 'Cà phê đen đá',
                        description:
                            'Cà phê truyền thống Việt Nam, đậm đà hương vị',
                        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&q=80&fit=crop',
                        category_id: 1,
                        brand_id: null, // ✅ Brand có thể null
                        price: 25000
                    },
                    {
                        id: 2,
                        name: 'Cappuccino',
                        description: 'Cà phê Ý với lớp foam sữa mịn màng',
                        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=300&q=80&fit=crop',
                        category_id: 1,
                        brand_id: 1,
                        price: 45000
                    }
                ]);
                setTotalPage(1);
                setTotalItems(2);
            } finally {
                setProductsLoading(false);
            }
        };
        fetchProducts();
    }, [page, search, selectedCategory]);

    // ✅ FILTER PRODUCTS BY CATEGORY
    useEffect(() => {
        if (selectedCategory === 'all') {
            setFilteredProducts(products);
        } else {
            const categoryId = parseInt(selectedCategory);
            const filtered = products.filter((product) => {
                return product.category_id === categoryId;
            });
            setFilteredProducts(filtered);
        }
    }, [products, selectedCategory]);

    // ✅ Fetch banners
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setLoading(true);
                const response = await BannerService.getAll();
                
                console.log('📦 Banner API response:', response);
                
                // ✅ XỬ LÝ RESPONSE STRUCTURE
                let bannersData = [];
                
                if (response && response.success && Array.isArray(response.data)) {
                    // Case 1: { success: true, data: [...] }
                    bannersData = response.data;
                } else if (response && Array.isArray(response.data)) {
                    // Case 2: { data: [...] }
                    bannersData = response.data;
                } else if (Array.isArray(response)) {
                    // Case 3: Direct array [...]
                    bannersData = response;
                }
                
                console.log('✅ Banners data:', bannersData);
                
                // ✅ ĐẢM BẢO LÀ ARRAY
                setBanners(Array.isArray(bannersData) ? bannersData : []);
                setError('');
            } catch (error) {
                console.error('❌ Error fetching banners:', error);
                setError('Không thể tải banner');
                // ✅ Fallback banners
                setBanners([
                    {
                        id: 1,
                        name: 'HG Coffee',
                        title: 'HG Coffee',
                        subtitle: 'Khám phá hương vị đặc biệt',
                        description: 'Trải nghiệm không gian thư giãn với những thức uống chất lượng cao',
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
        }, 3000);
        return () => clearInterval(interval);
    }, [banners.length]);

    // ✅ EVENT HANDLERS
    const goToSlide = (index) => setCurrentSlide(index);
    const nextSlide = () =>
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    const prevSlide = () =>
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

    const handleAddToCart = async (product) => {
        // ✅ KIỂM TRA GUEST MODE

        try {
            setAddingToCart((prev) => ({ ...prev, [product.id]: true }));
            setMessage('');
            const userId = user?.id || null;

            // ✅ Lấy hoặc tạo giỏ hàng
            const cart = await CartService.getOrCreateCart(userId);

            // ✅ Tìm sản phẩm chi tiết đầu tiên có số lượng > 0
            const productDetails = await ProductService.getById(product.id);

            if (
                !productDetails ||
                !productDetails.sizes ||
                productDetails.sizes.length === 0
            ) {
                setMessage('❌ Sản phẩm không có thông tin chi tiết');
                return;
            }

            // ✅ Lấy size đầu tiên có quantity > 0
            const availableSize = productDetails.sizes.find(
                (size) => size.quantity > 0
            );

            if (!availableSize) {
                setMessage('❌ Sản phẩm đã hết hàng');
                return;
            }

            // ✅ Thêm vào giỏ hàng với quantity = 1
            await CartService.addToCart(cart.id, availableSize.id, 1);

            setMessage(`✅ Đã thêm "${product.name}" vào giỏ hàng`);

            // ✅ THÔNG BÁO KHÁC NHAU CHO USER VÀ GUEST
            if (isGuest) {
                setMessage(
                    `✅ Đã thêm "${product.name}" vào giỏ hàng (khách vãng lai)`
                );
            } else {
                setMessage(`✅ Đã thêm "${product.name}" vào giỏ hàng`);
            }
            triggerCartRefresh();
            // ✅ Auto clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('❌ Error adding to cart:', error);
            setMessage('❌ Lỗi khi thêm vào giỏ hàng: ' + error.message);
        } finally {
            setAddingToCart((prev) => ({ ...prev, [product.id]: false }));
        }
    };
    const handleViewProduct = (product) => {
        window.location.hash = `product/${product.id}`;
    };

    // ✅ PAGINATION HANDLERS
    const handlePageChange = (newPage) => {
        if (
            newPage >= 1 &&
            newPage <= totalPage &&
            newPage !== page &&
            !productsLoading
        ) {
            setPage(newPage);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const searchTerm = formData.get('search') || '';
        setSearch(searchTerm);
        setPage(1); // Reset về trang 1 khi search
    };

    // ✅ FILTER HANDLERS
    const handleCategoryFilter = (categoryId) => {
        setSelectedCategory(categoryId);
        setPage(1);
        setSearch('');
    };

    // ✅ UTILITY FUNCTIONS
    const formatPrice = (price) => {
        if (!price || price === 0) return 'Liên hệ';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find((c) => c.id === categoryId);
        if (category) {
            return `${getCategoryIcon(categoryId)} ${category.name}`;
        }

        // Fallback với icon
        const categoryMap = {
            1: '☕ Cà phê',
            2: '🍵 Trà',
            3: '🥖 Bánh mì',
            4: '🧊 Đá xay',
            8: '☕ Latte',
            10: '🧋 Trà sữa'
        };
        return categoryMap[categoryId] || '🍽️ Thức uống';
    };

    // ✅ THÊM hàm lấy icon cho category
    const getCategoryIcon = (categoryId) => {
        const iconMap = {
            1: '☕', // Cà phê
            2: '🍵', // Trà
            3: '🥖', // Bánh mì
            4: '🧊', // Đá xay
            8: '☕', // Latte
            10: '🧋' // Trà sữa
        };
        return iconMap[categoryId] || '🍽️';
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
            <Header
                user={user}
                onLogout={onLogout}
                currentPage='home'
                isGuest={isGuest}
                onLogin={onLogin}
                onRegister={onRegister}
            />

            {/* ✅ MESSAGE NOTIFICATION */}
            {message && (
                <div
                    className={`message-notification ${
                        message.includes('✅') ? 'success' : 'error'
                    }`}
                >
                    {message}
                    <button
                        onClick={() => setMessage('')}
                        className='close-message'
                    >
                        ×
                    </button>
                </div>
            )}

            {/* ✅ HERO SLIDER (giữ nguyên) */}
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
                                        <div className='product-showcase'></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Slider controls */}
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

            {/* ✅ SỬA PRODUCTS SECTION - GENERATE FILTER BUTTONS TỪ API */}

            {/* ✅ PRODUCTS SECTION - CẢI THIỆN FILTER */}
            <section className='products-section'>
                <div className='container'>
                    <div className='section-header'>
                        <h2 className='section-title'>MENU SẢN PHẨM</h2>
                        <p className='section-subtitle'>
                            Khám phá những thức uống được yêu thích nhất tại HG
                            Coffee
                        </p>

                        {/* ✅ SEARCH BAR - CẢI THIỆN */}
                        <div className='search-bar'>
                            <div className='search-info'>
                                {selectedCategory === 'all' ? (
                                    <>
                                        Tổng <strong>{totalItems}</strong> sản
                                        phẩm - Trang <strong>{page}</strong>/
                                        {totalPage}
                                    </>
                                ) : (
                                    <>
                                        Danh mục{' '}
                                        <strong>
                                            {getCategoryName(
                                                parseInt(selectedCategory)
                                            ).replace(/^[^\s]+\s/, '')}
                                        </strong>
                                        :<strong> {totalItems}</strong> sản phẩm
                                        {totalPage > 1 && (
                                            <>
                                                {' '}
                                                - Trang <strong>{page}</strong>/
                                                {totalPage}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                            <form
                                className='search-form'
                                onSubmit={handleSearchSubmit}
                            >
                                <input
                                    name='search'
                                    className='search-input'
                                    placeholder={
                                        selectedCategory === 'all'
                                            ? 'Tìm kiếm sản phẩm...'
                                            : `Tìm trong ${getCategoryName(
                                                  parseInt(selectedCategory)
                                              ).replace(/^[^\s]+\s/, '')}...`
                                    }
                                    defaultValue={search}
                                />
                                <button type='submit' className='btn-search'>
                                    🔍 Tìm kiếm
                                </button>
                                {search && (
                                    <button
                                        type='button'
                                        className='btn-clear-search'
                                        onClick={() => {
                                            setSearch('');
                                            setPage(1);
                                        }}
                                        title='Xóa tìm kiếm'
                                    >
                                        ✖️
                                    </button>
                                )}
                            </form>
                        </div>

                        {/* ✅ CATEGORY FILTERS - CẢI THIỆN */}
                        <div className='section-actions'>
                            <button
                                className={`filter-btn ${
                                    selectedCategory === 'all' ? 'active' : ''
                                }`}
                                onClick={() => handleCategoryFilter('all')}
                            >
                                <span>🍽️ Tất cả</span>
                            </button>

                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    className={`filter-btn ${
                                        selectedCategory ===
                                        category.id.toString()
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        handleCategoryFilter(
                                            category.id.toString()
                                        )
                                    }
                                >
                                    <span>
                                        {getCategoryIcon(category.id)}{' '}
                                        {category.name}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* ✅ FILTER STATUS */}
                        {selectedCategory !== 'all' && (
                            <div className='filter-status'>
                                <span className='filter-indicator'>
                                    🎯 Đang lọc theo:{' '}
                                    <strong>
                                        {getCategoryName(
                                            parseInt(selectedCategory)
                                        )}
                                    </strong>
                                </span>
                                <button
                                    className='clear-filter-btn'
                                    onClick={() => handleCategoryFilter('all')}
                                    title='Xóa bộ lọc'
                                >
                                    ✖️ Bỏ lọc
                                </button>
                            </div>
                        )}
                    </div>

                    {productsLoading ? (
                        <div className='products-loading'>
                            <div className='loading-spinner'>☕</div>
                            <p>Đang tải menu...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className='no-products'>
                            <div className='no-products-icon'>📭</div>
                            <h3>Không tìm thấy sản phẩm</h3>
                            <p>
                                {selectedCategory === 'all'
                                    ? 'Không có sản phẩm nào khớp với từ khóa tìm kiếm của bạn.'
                                    : `Không có sản phẩm nào trong danh mục "${getCategoryName(
                                          parseInt(selectedCategory)
                                      ).replace(/^[^\s]+\s/, '')}".`}
                            </p>
                            {selectedCategory !== 'all' && (
                                <button
                                    className='reset-filter-btn'
                                    onClick={() => handleCategoryFilter('all')}
                                >
                                    Xem tất cả sản phẩm
                                </button>
                            )}
                        </div>
                    ) : (
                        <div
                            className={`products-grid ${
                                products.length <= 3 ? 'few-products' : ''
                            }`}
                        >
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className='product-card'
                                    onClick={() => handleViewProduct(product)}
                                >
                                    <div className='product-image'>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            onError={(e) => {
                                                e.target.src =
                                                    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&q=80&fit=crop';
                                            }}
                                        />
                                        <div className='product-overlay'>
                                            <button
                                                className='quick-view-btn'
                                                title='Xem chi tiết'
                                            >
                                                👁️
                                            </button>
                                        </div>
                                        <div className='product-badge'>
                                            <span>🔥 Hot</span>
                                        </div>
                                    </div>

                                    <div className='product-info'>
                                        <div className='product-category'>
                                            {getCategoryName(
                                                product.category_id
                                            )}
                                        </div>
                                        <h3 className='product-name'>
                                            {product.name}
                                        </h3>
                                        <p className='product-description'>
                                            {product.description}
                                        </p>

                                        <div className='product-footer'>
                                            <div className='product-price'>
                                                <span className='current-price'>
                                                    {formatPrice(product.price)}
                                                </span>
                                            </div>
                                            <button
                                                className='add-to-cart-btn'
                                                onClick={() =>
                                                    handleAddToCart(product)
                                                }
                                                disabled={
                                                    addingToCart[product.id]
                                                }
                                            >
                                                <span className='btn-icon'>
                                                    {addingToCart[product.id]
                                                        ? '⏳'
                                                        : '🛒'}
                                                </span>
                                                <span className='btn-text'>
                                                    {addingToCart[product.id]
                                                        ? 'Đang thêm...'
                                                        : isGuest
                                                        ? 'Xem chi tiết'
                                                        : 'Xem chi tiết'}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ✅ PAGINATION */}
                    {!productsLoading &&
                        products.length > 0 &&
                        totalPage > 1 && (
                            <div className='pagination'>
                                <div className='pagination-info'>
                                    Trang {page} / {totalPage} - Tổng{' '}
                                    {totalItems} sản phẩm
                                    {selectedCategory !== 'all' && (
                                        <span>
                                            {' '}
                                            (danh mục:{' '}
                                            {getCategoryName(
                                                parseInt(selectedCategory)
                                            ).replace(/^[^\s]+\s/, '')}
                                            )
                                        </span>
                                    )}
                                </div>
                                <div className='pagination-controls'>
                                    <button
                                        className='btn-nav'
                                        onClick={() => handlePageChange(1)}
                                        disabled={page === 1 || productsLoading}
                                    >
                                        ⏪ Đầu
                                    </button>
                                    <button
                                        className='btn-nav'
                                        onClick={() =>
                                            handlePageChange(page - 1)
                                        }
                                        disabled={page === 1 || productsLoading}
                                    >
                                        ⬅️ Trước
                                    </button>

                                    {Array.from(
                                        { length: Math.min(5, totalPage) },
                                        (_, i) => {
                                            const startPage = Math.max(
                                                1,
                                                page - 2
                                            );
                                            const pageNum = startPage + i;
                                            if (pageNum > totalPage)
                                                return null;

                                            return (
                                                <button
                                                    key={pageNum}
                                                    className={`btn-page ${
                                                        page === pageNum
                                                            ? 'active'
                                                            : ''
                                                    }`}
                                                    onClick={() =>
                                                        handlePageChange(
                                                            pageNum
                                                        )
                                                    }
                                                    disabled={productsLoading}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        }
                                    )}

                                    <button
                                        className='btn-nav'
                                        onClick={() =>
                                            handlePageChange(page + 1)
                                        }
                                        disabled={
                                            page === totalPage ||
                                            productsLoading
                                        }
                                    >
                                        Tiếp ➡️
                                    </button>
                                    <button
                                        className='btn-nav'
                                        onClick={() =>
                                            handlePageChange(totalPage)
                                        }
                                        disabled={
                                            page === totalPage ||
                                            productsLoading
                                        }
                                    >
                                        Cuối ⏩
                                    </button>
                                </div>
                            </div>
                        )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
