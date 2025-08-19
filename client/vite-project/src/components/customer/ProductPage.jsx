import React, { useState, useEffect } from 'react';
import ProductAPI from '@api/productapi';
import CategoryAPI from '@api/categoryapi';
import Layout from '@components/common/Layout.jsx';
import '@styles/pages/_homepage.scss';

export default function ProductPage({ user, onLogout }) {
    // ✅ STATES (giữ nguyên states từ code trước)
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [pageSize, setPageSize] = useState(4);
    const [showPageSizeDropdown, setShowPageSizeDropdown] = useState(false);

    const pageSizeOptions = [
        { value: 4, label: ' 4 sản phẩm' },
        { value: 8, label: '8 sản phẩm' },
        { value: 12, label: '12 sản phẩm' }
    ];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await CategoryAPI.getAll();
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
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setProductsLoading(true);
                let response;
                if (selectedCategory === 'all') {
                    response = await ProductAPI.getCustomizePage({
                        page: page || 1,
                        search: search || '',
                        pageSize: pageSize || 4
                    });
                } else {
                    // ✅ GIỮ NGUYÊN API CHO FILTER CATEGORY
                    response = await ProductAPI.getByCategory(
                        selectedCategory,
                        {
                            page: page || 1,
                            search: search || '',
                            limit: pageSize || 4
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

                // ✅ TRANSFORM DATA - XỬ LÝ PRICE
                const transformedProducts = productsData.map((product) => ({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    image: product.image,
                    category_id: product.category_id,
                    brand_id: product.brand_id || null,
                    // ✅ LẤY PRICE TỪ product_details
                    price: product.product_details?.[0]?.price || 0,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt
                }));

                // ✅ UPDATE STATES
                setProducts(transformedProducts);
                setTotalPage(pagination.totalPage || 1);
                setTotalItems(pagination.totalItems || 0);
                setPage(pagination.currentPage || page);
            } catch (error) {
                console.error('❌ Error fetching products:', error);
                setError('Không thể tải sản phẩm');
                setProducts([]);
            } finally {
                setProductsLoading(false); // ✅ QUAN TRỌNG: Thêm finally block
            }
        };
        fetchProducts();
    }, [page, search, selectedCategory, pageSize]);
    // ✅ THÊM MISSING HANDLERS
    const handleAddToCart = (product) => {
        alert(
            `Đã thêm "${product.name}" vào giỏ hàng!\nGiá: ${formatPrice(
                product.price
            )}`
        );
        console.log('🛒 Add to cart:', product);
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
        setPage(1);
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
    const handleViewProduct = (product) => {
        // ✅ NAVIGATE ĐẾN PRODUCT DETAIL PAGE BẰNG HASH
        window.location.hash = `product/${product.id}`;
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

    return (
        <Layout user={user} onLogout={onLogout} currentPage='menu'>
            {error && (
                <div
                    className='error-message'
                    style={{
                        background: '#fee',
                        color: '#c33',
                        padding: '1rem',
                        textAlign: 'center',
                        borderBottom: '1px solid #fcc'
                    }}
                >
                    {error}
                </div>
            )}

            <section
                className='products-section'
                style={{ paddingTop: '2rem' }}
            >
                <div className='container'>
                    <div className='section-header'>
                        <h2 className='section-title'>THỰC ĐƠN SẢN PHẨM</h2>
                        <p className='section-subtitle'>
                            Khám phá toàn bộ bộ sưu tập thức uống đặc biệt tại
                            HG Coffee
                        </p>

                        {/* ✅ SEARCH BAR */}
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
                                <span className='page-size-info'>
                                    | Hiển thị <strong>{pageSize}</strong> sản
                                    phẩm/trang
                                </span>
                            </div>
                            <form
                                className='search-form'
                                onSubmit={handleSearchSubmit}
                            >
                                <input
                                    name='search'
                                    className='search-input'
                                    placeholder='Tìm kiếm sản phẩm...'
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

                        {/* ✅ PAGE SIZE SELECTOR */}
                        <div className='page-size-dropdown-container'>
                            <span className='selector-label'>
                                📄 Số sản phẩm mỗi trang:
                            </span>
                            <div className='page-size-dropdown'>
                                <button
                                    className='page-size-dropdown-trigger'
                                    onClick={() =>
                                        setShowPageSizeDropdown(
                                            !showPageSizeDropdown
                                        )
                                    }
                                >
                                    <span className='current-size'>
                                        {pageSize} sản phẩm/trang
                                    </span>
                                    <span
                                        className={`dropdown-arrow ${
                                            showPageSizeDropdown ? 'open' : ''
                                        }`}
                                    >
                                        ▼
                                    </span>
                                </button>

                                {showPageSizeDropdown && (
                                    <div className='page-size-dropdown-menu'>
                                        {pageSizeOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                className={`dropdown-item ${
                                                    pageSize === option.value
                                                        ? 'active'
                                                        : ''
                                                }`}
                                                onClick={() => {
                                                    handlePageSizeChange(
                                                        option.value
                                                    );
                                                    setShowPageSizeDropdown(
                                                        false
                                                    );
                                                }}
                                            >
                                                <span className='item-text'>
                                                    {option.label}
                                                </span>
                                                {pageSize === option.value && (
                                                    <span className='check-mark'>
                                                        ✓
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ✅ CATEGORY FILTERS */}
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

                    {/* ✅ PRODUCTS GRID */}
                    {productsLoading ? (
                        <div className='products-loading'>
                            <div className='loading-spinner'>☕</div>
                            <p>Đang tải thực đơn...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className='no-products'>
                            <div className='no-products-icon'>📭</div>
                            <h3>Không tìm thấy sản phẩm</h3>
                            <p>
                                Không có sản phẩm nào khớp với tiêu chí tìm
                                kiếm.
                            </p>
                        </div>
                    ) : (
                        <div
                            className={`products-grid ${
                                products.length <= 3 ? 'few-products' : ''
                            }`}
                        >
                            {products.map((product) => (
                                <div key={product.id} className='product-card'>
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
                                                onClick={() =>
                                                    handleViewProduct(product)
                                                }
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
                                            >
                                                <span className='btn-icon'>
                                                    🛒
                                                </span>
                                                <span>Thêm</span>
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
                                    {totalItems} sản phẩm | Hiển thị {pageSize}{' '}
                                    sản phẩm/trang
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
        </Layout>
    );
}
