import React, { useState, useEffect } from 'react';
import Layout from '@components/common/Layout.jsx';
import CartAPI from '@api/cartapi.js';
import '@styles/pages/_cart.scss';

export default function cartPage({ user, Logout }) {
    const [cart, setCart] = useState(null);
    const [CartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({}); // Track updating items by ID
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadCartData();
    }, [user]);
    const loadCartData = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🔄 Loading cart data for user:', user?.id);
            //GET OR CREATE CART
            const cartData = await CartAPI.getOrCreateCart(user?.id);
            setCart(cartData);

            //GET CART ITEMS
            const itemsData = await CartAPI.getCartItems(cartData.id);
            setCartItems(Array.isArray(itemsData) ? itemsData : []);
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
            //UPDATE LOCAL STATE
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

            //UPDATE LOCAL STATE
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
        if (
            !confirm(
                'Bạn có chắc muốn xóa hết tất cả sản phẩm trong giỏ hàng không ?'
            )
        )
            return;
        try {
            setLoading(true);
            setMessage('');
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
        // TODO: Navigate to checkout page
        alert('Chức năng thanh toán đang được phát triển!');
        // window.location.hash = 'checkout';
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
                    <span onClick={handleGoHome} className='breadcrumb-link'>
                        🏠 Trang chủ
                    </span>
                    <span className='breadcrumb-separator'>›</span>
                    <span onClick={handleGoMenu} className='breadcrumb-link'>
                        📱 Menu
                    </span>
                    <span className='breadcrumb-separator'>›</span>
                    <span className='breadcrumb-current'>Giỏ hàng</span>
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
                            className='close-message'
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
                                                item.image ||
                                                'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&q=80&fit=crop'
                                            }
                                            alt={
                                                item.product_name ||
                                                item.name ||
                                                'Sản phẩm'
                                            }
                                            onError={(e) => {
                                                e.target.src =
                                                    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&q=80&fit=crop';
                                            }}
                                            onClick={() =>
                                                handleViewProduct(
                                                    item.product_id
                                                )
                                            }
                                        />
                                    </div>

                                    {/* ✅ PRODUCT INFO */}
                                    <div className='item-info'>
                                        <h3
                                            className='item-name'
                                            onClick={() =>
                                                handleViewProduct(
                                                    item.product_id
                                                )
                                            }
                                        >
                                            {item.product_name ||
                                                item.name ||
                                                'Sản phẩm'}
                                        </h3>
                                        <div className='item-details'>
                                            <span className='item-size'>
                                                Size: {item.size_name || 'M'}
                                            </span>
                                            <span className='item-price-unit'>
                                                {formatPrice(item.price || 0)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ✅ QUANTITY CONTROLS */}
                                    <div className='item-quantity'>
                                        <button
                                            className='quantity-btn'
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
                                        <input
                                            type='number'
                                            value={item.quantity || 1}
                                            onChange={(e) => {
                                                const newQuantity =
                                                    parseInt(e.target.value) ||
                                                    1;
                                                if (
                                                    newQuantity !==
                                                    item.quantity
                                                ) {
                                                    handleUpdateQuantity(
                                                        item.id,
                                                        newQuantity
                                                    );
                                                }
                                            }}
                                            min='1'
                                            className='quantity-input'
                                            disabled={updating[item.id]}
                                        />
                                        <button
                                            className='quantity-btn'
                                            onClick={() =>
                                                handleUpdateQuantity(
                                                    item.id,
                                                    (item.quantity || 1) + 1
                                                )
                                            }
                                            disabled={updating[item.id]}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* ✅ TOTAL PRICE */}
                                    <div className='item-total'>
                                        <span className='total-price'>
                                            {formatPrice(
                                                calculateItemTotal(item)
                                            )}
                                        </span>
                                    </div>

                                    {/* ✅ REMOVE BUTTON */}
                                    <div className='item-actions'>
                                        <button
                                            className='btn-remove'
                                            onClick={() =>
                                                handleRemoveItem(item.id)
                                            }
                                            disabled={updating[item.id]}
                                            title='Xóa sản phẩm'
                                        >
                                            {updating[item.id] ? '🔄' : '🗑️'}
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
