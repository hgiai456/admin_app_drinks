import { useState, useEffect } from 'react';
import Layout from '@components/common/Layout.jsx';
import ProductAPI from '@api/productapi.js';
import SizeAPI from '@api/sizeapi.js';
import CartAPI from '@api/cartapi.js';
import ProdetailAPI from '@api/prodetails.js';
import '@styles/pages/_productdetail.scss';
import { triggerCartRefresh } from '../common/UtilityFunction';

export default function ProductDetailPage({ user, onLogout, productId }) {
    const navigateToHash = (hash) => {
        window.location.hash = hash;
    };

    //State
    const [product, setProduct] = useState(null);
    const [sizes, setSizes] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedProductDetail, setSelectedProductDetail] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const loadProductData = async () => {
            try {
                setLoading(true);
                const [productData, sizesData, productDetailsData] =
                    await Promise.all([
                        ProductAPI.getById(productId),
                        SizeAPI.getAll(),
                        ProdetailAPI.getProductDetailsByProductId(productId)
                    ]);
                console.log('✅ Product data loaded:', {
                    productData,
                    sizesData,
                    productDetailsData
                });

                setProduct(productData);
                // ✅ XỬ LÝ sizes TỪ API RESPONSE
                const sizesFromApi = productData.sizes || [];

                // ✅ TRANSFORM sizes THÀNH productDetails FORMAT
                const transformedProductDetails = sizesFromApi.map(
                    (sizeInfo) => ({
                        id: sizeInfo.product_detail, // product_detail là ID của chi tiết sản phẩm
                        size_id: sizeInfo.size_id,
                        size_name: sizeInfo.size_name,
                        price: sizeInfo.price,
                        oldprice: sizeInfo.oldprice,
                        quantity: sizeInfo.quantity,
                        product_id: productData.id
                    })
                );

                // ✅ TRANSFORM sizes THÀNH sizes FORMAT
                const transformedSizes = sizesFromApi.map((sizeInfo) => ({
                    id: sizeInfo.size_id,
                    name: sizeInfo.size_name
                }));
                setSizes(transformedSizes || []);
                setProductDetails(transformedProductDetails || []);
                // Tự động chọn size đầu tiên nếu có
                if (transformedProductDetails.length > 0) {
                    const firstDetail = transformedProductDetails[0];
                    setSelectedSize(firstDetail.size_id?.toString());
                    setSelectedProductDetail(firstDetail);
                }
            } catch (error) {
                console.error('❌ Error loading product data:', error);
                setError('Không thể tải thông tin sản phẩm');
            } finally {
                setLoading(false);
            }
        };
        if (productId) {
            loadProductData();
        }
    }, [productId]);

    useEffect(() => {
        if (selectedSize && productDetails.length > 0) {
            const detail = productDetails.find(
                (d) => d.size_id?.toString() === selectedSize
            );
            setSelectedProductDetail(detail || null);
        }
    }, [selectedSize, productDetails]);

    const handleSizeChange = (sizeId) => {
        setSelectedSize(sizeId);
        // alert('bạn đã chọn size ' + sizeId);
        setQuantity(1); //Reset quantity
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) return;
        if (
            selectedProductDetail &&
            newQuantity > selectedProductDetail.quantity
        ) {
            setMessage(`⚠️ Chỉ còn ${selectedProductDetail.quantity} sản phẩm`);
            return;
        }
        setQuantity(newQuantity);
        setMessage('');
    };
    // ✅ SỬA handleAddToCart
    const handleAddToCart = async () => {
        try {
            if (!selectedProductDetail) {
                setMessage('❌ Vui lòng chọn size');
                return; // ✅ THÊM return
            }

            if (quantity > selectedProductDetail.quantity) {
                setMessage(
                    `❌ Không đủ hàng. Chỉ còn ${selectedProductDetail.quantity} sản phẩm`
                );
                return;
            }

            setAddingToCart(true);
            setMessage('');

            // ✅ SỬA TÊN HÀM: getOrCreatCart -> getOrCreateCart
            const cart = await CartAPI.getOrCreateCart(user?.id);
            await CartAPI.addToCart(
                cart.id,
                selectedProductDetail.id,
                quantity
            );

            setMessage(
                `✅ Đã thêm ${quantity} ${product.name} (${getSizeName(
                    selectedSize
                )}) vào giỏ hàng`
            );
            triggerCartRefresh();

            // Reset quantity
            setQuantity(1);
        } catch (error) {
            console.error('❌ Error adding to cart:', error);
            setMessage('❌ Lỗi khi thêm vào giỏ hàng: ' + error.message);
        } finally {
            setAddingToCart(false);
        }
    };
    // ✅ UTILITY FUNCTIONS
    const formatPrice = (price) => {
        if (!price) return 'Liên hệ';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getSizeName = (sizeId) => {
        const size = sizes.find((s) => s.id?.toString() === sizeId?.toString());
        return size?.name || `Size ${sizeId}`;
    };

    const getAvailableImages = () => {
        // ✅ VÌ API CHỈ TRẢ VỀ 1 HÌNH ẢNH CHÍNH
        return [product?.image].filter(Boolean);
    };

    const calculateDiscount = () => {
        if (!selectedProductDetail?.oldprice || !selectedProductDetail?.price)
            return 0;
        return Math.round(
            ((selectedProductDetail.oldprice - selectedProductDetail.price) /
                selectedProductDetail.oldprice) *
                100
        );
    };

    const handleGoBack = () => {
        window.history.back();
    };

    const handleGoHome = () => {
        window.location.hash = 'home';
    };

    const handleGoMenu = () => {
        window.location.hash = 'menu';
    };

    const handleGoToCart = () => {
        window.location.hash = 'cart';
    };

    // ✅ LOADING STATE
    if (loading) {
        return (
            <Layout
                user={user}
                onLogout={onLogout}
                currentPage='product-detail'
            >
                <div className='product-detail-loading'>
                    <div className='loading-spinner'>☕</div>
                    <p>Đang tải sản phẩm...</p>
                </div>
            </Layout>
        );
    }

    if (error || !product) {
        return (
            <Layout
                user={user}
                onLogout={onLogout}
                currentPage='product-detail'
            >
                <div className='product-detail-error'>
                    <h2>❌ Lỗi</h2>
                    <p>{error || 'Không tìm thấy sản phẩm'}</p>
                    <button onClick={handleGoBack} className='btn-back'>
                        ← Quay lại
                    </button>
                </div>
            </Layout>
        );
    }

    const availableImages = getAvailableImages();
    const discount = calculateDiscount();
    return (
        <Layout user={user} onLogout={onLogout} currentPage='product-detail'>
            <div className='product-detail-container'>
                {/* ✅ BREADCRUMB */}
                <div className='breadcrumb'>
                    <span onClick={handleGoHome} className='breadcrumb-link'>
                        🏠 Trang chủ
                    </span>
                    <span className='breadcrumb-separator'>›</span>
                    <span onClick={handleGoMenu} className='breadcrumb-link'>
                        📱 Menu
                    </span>
                    <span className='breadcrumb-separator'>›</span>
                    <span className='breadcrumb-current'>{product.name}</span>
                </div>

                {/* ✅ MESSAGE */}
                {message && (
                    <div
                        className={`message ${
                            message.includes('✅')
                                ? 'success'
                                : message.includes('❌')
                                ? 'error'
                                : 'warning'
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

                {/* ✅ PRODUCT DETAIL CONTENT */}
                <div className='product-detail-content'>
                    {/* ✅ PRODUCT IMAGES */}
                    <div className='product-images'>
                        <div className='main-image'>
                            <img
                                src={availableImages[currentImageIndex]}
                                alt={product.name}
                                onError={(e) => {
                                    e.target.src =
                                        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=600&q=80&fit=crop';
                                }}
                            />
                            {discount > 0 && (
                                <div className='discount-badge'>
                                    -{discount}%
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ✅ PRODUCT INFO */}
                    <div className='product-info'>
                        <h1 className='product-title'>{product.name}</h1>

                        <div className='product-description'>
                            <p>{product.description}</p>
                        </div>

                        {/* ✅ PRICE */}
                        <div className='product-pricing'>
                            {selectedProductDetail ? (
                                <>
                                    <div className='current-price'>
                                        {formatPrice(
                                            selectedProductDetail.price
                                        )}
                                    </div>
                                    {selectedProductDetail.oldprice &&
                                        selectedProductDetail.oldprice >
                                            selectedProductDetail.price && (
                                            <div className='old-price'>
                                                {formatPrice(
                                                    selectedProductDetail.oldprice
                                                )}
                                            </div>
                                        )}
                                </>
                            ) : (
                                <div className='price-placeholder'>
                                    Chọn size để xem giá
                                </div>
                            )}
                        </div>

                        {/* ✅ SIZE SELECTOR */}
                        <div className='size-selector'>
                            <h3>📏 Chọn size:</h3>
                            <div className='size-options'>
                                {productDetails.map((detail) => {
                                    const isSelected =
                                        selectedSize ===
                                        detail.size_id?.toString();
                                    const isOutOfStock = detail.quantity === 0;

                                    return (
                                        <button
                                            key={detail.id}
                                            className={`size-option ${
                                                isSelected ? 'selected' : ''
                                            } ${
                                                isOutOfStock
                                                    ? 'out-of-stock'
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                !isOutOfStock &&
                                                handleSizeChange(
                                                    detail.size_id?.toString()
                                                )
                                            }
                                            disabled={isOutOfStock}
                                        >
                                            <span className='size-name'>
                                                {detail.size_name}
                                            </span>
                                            <span className='size-price'>
                                                {formatPrice(detail.price)}
                                            </span>
                                            {isOutOfStock && (
                                                <span className='stock-status'>
                                                    Hết hàng
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ✅ QUANTITY SELECTOR */}
                        {selectedProductDetail &&
                            selectedProductDetail.quantity > 0 && (
                                <div className='quantity-selector'>
                                    <h3>📦 Số lượng:</h3>
                                    <div className='quantity-controls'>
                                        <button
                                            className='quantity-btn'
                                            onClick={() =>
                                                handleQuantityChange(
                                                    quantity - 1
                                                )
                                            }
                                            disabled={quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <input
                                            type='number'
                                            value={quantity}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    parseInt(e.target.value) ||
                                                        1
                                                )
                                            }
                                            min='1'
                                            max={selectedProductDetail.quantity}
                                            className='quantity-input'
                                        />
                                        <button
                                            className='quantity-btn'
                                            onClick={() =>
                                                handleQuantityChange(
                                                    quantity + 1
                                                )
                                            }
                                            disabled={
                                                quantity >=
                                                selectedProductDetail.quantity
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className='stock-info'>
                                        Còn lại:{' '}
                                        <strong>
                                            {selectedProductDetail.quantity}
                                        </strong>{' '}
                                        sản phẩm
                                    </div>
                                </div>
                            )}

                        {/* ✅ ACTION BUTTONS */}
                        <div className='product-actions'>
                            <button
                                className='btn-add-to-cart'
                                onClick={handleAddToCart}
                                disabled={
                                    !selectedProductDetail ||
                                    selectedProductDetail.quantity === 0 ||
                                    addingToCart
                                }
                            >
                                {addingToCart ? (
                                    <>🔄 Đang thêm...</>
                                ) : (
                                    <>🛒 Thêm vào giỏ hàng</>
                                )}
                            </button>

                            <button
                                className='btn-view-cart'
                                onClick={handleGoToCart}
                            >
                                👁️ Xem giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
