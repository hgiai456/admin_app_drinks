import React, { useState, useEffect } from 'react';
import Layout from '@components/common/Layout.jsx';
import CartAPI from '@api/cartapi.js';
import '@styles/pages/_cart.scss';

export default function CartPage({ user, onLogout, isGuest = false, onLogin }) {
    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({});
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadCartData();
    }, [user, isGuest]);

    const loadCartData = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🔄 Loading cart data for user:', user?.id);
            // ✅ LẤY CART CHO CẢ USER VÀ GUEST
            const userId = user?.id || null;
            // ✅ GET OR CREATE CART
            const cartData = await CartAPI.getOrCreateCart(userId);
            setCart(cartData);

            // ✅ GET CART ITEMS
            const itemsData = await CartAPI.getCartItems(cartData.id);

            // ✅ SỬA: TRANSFORM DỮ LIỆU TỪ API RESPONSE
            const transformedItems = Array.isArray(itemsData)
                ? itemsData.map((item) => ({
                      id: item.id,
                      cart_id: item.cart_id,
                      product_detail_id: item.product_detail_id,
                      quantity: item.quantity,
                      // ✅ LẤY DỮ LIỆU TỪ product_details
                      product_id: item.product_details?.product?.id,
                      product_name: item.product_details?.product?.name,
                      product_image: item.product_details?.product?.image,
                      product_description:
                          item.product_details?.product?.description,
                      // ✅ LẤY THÔNG TIN SIZE VÀ GIÁ
                      size_id: item.product_details?.size_id,
                      size_name: `Size ${
                          item.product_details?.size_id === 1
                              ? 'S'
                              : item.product_details?.size_id === 2
                              ? 'M'
                              : 'L'
                      }`,
                      price: item.product_details?.price,
                      oldprice: item.product_details?.oldprice,
                      stock_quantity: item.product_details?.quantity
                  }))
                : [];

            setCartItems(transformedItems);
            console.log('✅ Transformed cart items:', transformedItems);
        } catch (error) {
            console.error('❌ Error loading cart:', error);
            setError('Không thể tải giỏ hàng: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            setUpdating((prev) => ({ ...prev, [cartItemId]: true }));
            setMessage('');

            console.log('🔄 Updating quantity:', { cartItemId, newQuantity });

            await CartAPI.updateCartItem(cartItemId, newQuantity);

            // ✅ UPDATE LOCAL STATE
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === cartItemId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );

            setMessage('✅ Đã cập nhật số lượng');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('❌ Error updating quantity:', error);
            setMessage('❌ Lỗi khi cập nhật: ' + error.message);
        } finally {
            setUpdating((prev) => ({ ...prev, [cartItemId]: false }));
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        if (!confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?'))
            return;

        try {
            setUpdating((prev) => ({ ...prev, [cartItemId]: true }));
            setMessage('');

            console.log('🗑️ Removing item:', cartItemId);
            await CartAPI.removeFromCart(cartItemId);

            // ✅ UPDATE LOCAL STATE
            setCartItems((prevItems) =>
                prevItems.filter((item) => item.id !== cartItemId)
            );

            setMessage('✅ Đã xóa sản phẩm khỏi giỏ hàng');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('❌ Error removing item:', error);
            setMessage('❌ Lỗi khi xóa: ' + error.message);
        } finally {
            setUpdating((prev) => ({ ...prev, [cartItemId]: false }));
        }
    };

    const handleClearCart = async () => {
        if (!confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?'))
            return;

        try {
            setLoading(true);
            setMessage('');

            console.log('🗑️ Clearing cart:', cart.id);
            await CartAPI.clearCart(cart.id);

            // ✅ UPDATE LOCAL STATE
            setCartItems([]);

            setMessage('✅ Đã xóa tất cả sản phẩm');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('❌ Error clearing cart:', error);
            setMessage('❌ Lỗi khi xóa giỏ hàng: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ UTILITY FUNCTIONS
    const formatPrice = (price) => {
        if (!price) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const calculateItemTotal = (item) => {
        return (item.price || 0) * (item.quantity || 0);
    };

    const calculateCartTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + calculateItemTotal(item);
        }, 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce(
            (total, item) => total + (item.quantity || 0),
            0
        );
    };

    // ✅ NAVIGATION FUNCTIONS
    const handleGoHome = () => {
        window.location.hash = 'home';
    };

    const handleGoMenu = () => {
        window.location.hash = 'menu';
    };

    const handleViewProduct = (productId) => {
        window.location.hash = `product/${productId}`;
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            setMessage('❌ Giỏ hàng trống, không thể thanh toán');
            return;
        }

        if (isGuest) {
            if (onLogin) {
                const confirmLogin = confirm(
                    'Bạn cần đăng nhập để thanh toán. Bạn có muốn đăng nhập ngay không?'
                );
                if (confirmLogin) {
                    // ✅ LƯU GIỎ HÀNG TRƯỚC KHI CHUYỂN SANG LOGIN
                    onLogin();
                }
            } else {
                alert('Vui lòng đăng nhập để thanh toán!');
            }
            return;
        }
        window.location.hash = 'checkout';
    };
    // ✅ LOADING STATE
    if (loading) {
        return (
            <Layout user={user} onLogout={onLogout} currentPage='cart'>
                <div className='cart-loading'>
                    <div className='loading-spinner'>🛒</div>
                    <p>Đang tải giỏ hàng...</p>
                </div>
            </Layout>
        );
    }

    // ✅ ERROR STATE
    if (error) {
        return (
            <Layout user={user} onLogout={onLogout} currentPage='cart'>
                <div className='cart-error'>
                    <h2>❌ Lỗi</h2>
                    <p>{error}</p>
                    <button onClick={loadCartData} className='btn-retry'>
                        🔄 Thử lại
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout user={user} onLogout={onLogout} currentPage='cart'>
            <div className='cart-container'>
                {/* ✅ BREADCRUMB */}
                <div className='breadcrumb'>
                    <span
                        onClick={() => (window.location.hash = 'home')}
                        className='breadcrumb-link'
                    >
                        🏠 Trang chủ
                    </span>
                    <span className='separator'>{'>'}</span>
                    <span className='current'>
                        🛒 Giỏ hàng {isGuest && '(Khách vãng lai)'}
                    </span>
                </div>

                {/* ✅ PAGE HEADER */}
                <div className='cart-header'>
                    <h1 className='cart-title'>🛒 Giỏ hàng của bạn</h1>
                    <div className='cart-summary'>
                        <span className='total-items'>
                            {getTotalItems()} sản phẩm
                        </span>
                        <span className='total-price'>
                            {formatPrice(calculateCartTotal())}
                        </span>
                    </div>
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
                            cla
                            ssName='close-message'
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* ✅ CART CONTENT */}
                {cartItems.length === 0 ? (
                    // ✅ EMPTY CART
                    <div className='cart-empty'>
                        <div className='empty-icon'>🛒</div>
                        <h2>Giỏ hàng trống</h2>
                        <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                        <div className='empty-actions'>
                            <button
                                onClick={handleGoMenu}
                                className='btn-continue-shopping'
                            >
                                🛍️ Tiếp tục mua sắm
                            </button>
                        </div>
                    </div>
                ) : (
                    // ✅ CART WITH ITEMS
                    <div className='cart-content'>
                        {/* ✅ CART ACTIONS */}
                        <div className='cart-actions'>
                            <button
                                onClick={handleGoMenu}
                                className='btn-continue-shopping'
                            >
                                ← Tiếp tục mua sắm
                            </button>
                            <button
                                onClick={handleClearCart}
                                className='btn-clear-cart'
                            >
                                🗑️ Xóa tất cả
                            </button>
                        </div>

                        {/* ✅ CART ITEMS */}
                        <div className='cart-items'>
                            {cartItems.map((item) => (
                                <div key={item.id} className='cart-item'>
                                    {/* ✅ PRODUCT IMAGE */}
                                    <div className='item-image'>
                                        <img
                                            src={
                                                item.product_image ||
                                                'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=80&h=80&q=80&fit=crop'
                                            }
                                            alt={
                                                item.product_name || 'Sản phẩm'
                                            }
                                            onError={(e) => {
                                                e.target.src =
                                                    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=80&h=80&q=80&fit=crop';
                                            }}
                                            onClick={() =>
                                                handleViewProduct(
                                                    item.product_id
                                                )
                                            }
                                        />
                                        {item.oldprice &&
                                            item.oldprice > item.price && (
                                                <div className='discount-badge'>
                                                    -
                                                    {Math.round(
                                                        ((item.oldprice -
                                                            item.price) /
                                                            item.oldprice) *
                                                            100
                                                    )}
                                                    %
                                                </div>
                                            )}
                                    </div>

                                    {/* ✅ PRODUCT INFO & PRICING */}
                                    <div className='item-details'>
                                        <div className='product-info'>
                                            <h3
                                                className='item-name'
                                                onClick={() =>
                                                    handleViewProduct(
                                                        item.product_id
                                                    )
                                                }
                                            >
                                                {item.product_name ||
                                                    'Sản phẩm'}
                                            </h3>
                                            <span className='item-size'>
                                                {item.size_name}
                                            </span>
                                        </div>

                                        <div className='pricing-section'>
                                            <div className='price-group'>
                                                <span className='current-price'>
                                                    {formatPrice(item.price)}
                                                </span>
                                                {item.oldprice &&
                                                    item.oldprice >
                                                        item.price && (
                                                        <span className='old-price'>
                                                            {formatPrice(
                                                                item.oldprice
                                                            )}
                                                        </span>
                                                    )}
                                            </div>

                                            {/* ✅ SAVINGS AMOUNT */}
                                            {item.oldprice &&
                                                item.oldprice > item.price && (
                                                    <div className='savings-amount'>
                                                        Tiết kiệm:{' '}
                                                        {formatPrice(
                                                            item.oldprice -
                                                                item.price
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    {/* ✅ QUANTITY CONTROLS */}
                                    <div className='item-quantity'>
                                        <div className='quantity-controls'>
                                            <button
                                                className='quantity-btn minus'
                                                onClick={() =>
                                                    handleUpdateQuantity(
                                                        item.id,
                                                        (item.quantity || 1) - 1
                                                    )
                                                }
                                                disabled={
                                                    updating[item.id] ||
                                                    (item.quantity || 1) <= 1
                                                }
                                            >
                                                −
                                            </button>
                                            <span className='quantity-display'>
                                                {item.quantity || 1}
                                            </span>
                                            <button
                                                className='quantity-btn plus'
                                                onClick={() =>
                                                    handleUpdateQuantity(
                                                        item.id,
                                                        (item.quantity || 1) + 1
                                                    )
                                                }
                                                disabled={
                                                    updating[item.id] ||
                                                    item.quantity >=
                                                        item.stock_quantity
                                                }
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* ✅ STOCK INFO */}
                                        <div className='stock-info'>
                                            Còn {item.stock_quantity} sản phẩm
                                        </div>
                                    </div>

                                    {/* ✅ TOTAL & ACTIONS */}
                                    <div className='item-total-actions'>
                                        <div className='total-section'>
                                            <div className='item-total-price'>
                                                {formatPrice(
                                                    calculateItemTotal(item)
                                                )}
                                            </div>

                                            {/* ✅ TOTAL SAVINGS */}
                                            {item.oldprice &&
                                                item.oldprice > item.price && (
                                                    <div className='total-savings'>
                                                        Tiết kiệm:{' '}
                                                        {formatPrice(
                                                            (item.oldprice -
                                                                item.price) *
                                                                item.quantity
                                                        )}
                                                    </div>
                                                )}
                                        </div>

                                        <button
                                            className='btn-remove'
                                            onClick={() =>
                                                handleRemoveItem(item.id)
                                            }
                                            disabled={updating[item.id]}
                                            title='Xóa sản phẩm'
                                        >
                                            {updating[item.id] ? '⏳' : '🗑️'}
                                        </button>
                                    </div>

                                    {/* ✅ LOADING OVERLAY */}
                                    {updating[item.id] && (
                                        <div className='item-loading-overlay'>
                                            <div className='loading-spinner-small'>
                                                ⏳
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* ✅ CART FOOTER */}
                        <div className='cart-footer'>
                            <div className='cart-totals'>
                                <div className='total-row'>
                                    <span className='total-label'>
                                        Tổng số lượng:
                                    </span>
                                    <span className='total-value'>
                                        {getTotalItems()} sản phẩm
                                    </span>
                                </div>

                                {/* ✅ HIỂN THỊ TỔNG TIẾT KIỆM */}
                                {(() => {
                                    const totalSavings = cartItems.reduce(
                                        (total, item) => {
                                            if (
                                                item.oldprice &&
                                                item.oldprice > item.price
                                            ) {
                                                return (
                                                    total +
                                                    (item.oldprice -
                                                        item.price) *
                                                        item.quantity
                                                );
                                            }
                                            return total;
                                        },
                                        0
                                    );

                                    return totalSavings > 0 ? (
                                        <div className='total-row savings-row'>
                                            <span className='total-label'>
                                                Tổng tiết kiệm:
                                            </span>
                                            <span className='total-value savings'>
                                                -{formatPrice(totalSavings)}
                                            </span>
                                        </div>
                                    ) : null;
                                })()}

                                <div className='total-row grand-total'>
                                    <span className='total-label'>
                                        Tổng cộng:
                                    </span>
                                    <span className='total-value'>
                                        {formatPrice(calculateCartTotal())}
                                    </span>
                                </div>
                            </div>

                            <div className='checkout-actions'>
                                <button
                                    className='btn-checkout'
                                    onClick={handleCheckout}
                                    disabled={cartItems.length === 0}
                                >
                                    💳 Thanh toán (
                                    {formatPrice(calculateCartTotal())})
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
