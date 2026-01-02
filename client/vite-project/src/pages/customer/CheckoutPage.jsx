import { useState, useEffect } from 'react';
import Layout from '@components/common/Layout.jsx';
import CartAPI from '@services/cart.service.js';
import CheckoutService from '@services/checkout.service.js';
import '@styles/pages/_checkout.scss';

export default function CheckoutPage({
    user,
    onLogout,
    isGuest = false,
    onLogin
}) {
    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        phone: user?.phone || '',
        address: '',
        note: '',
        payment_method: 'cod'
    });

    const [formErrors, setFormErrors] = useState({});

    const paymentMethods = [
        {
            id: 'cod', 
            name: 'Thanh toán khi nhận hàng (COD)',
            icon: '💵',
            description: 'Thanh toán bằng tiềm mặt khi nhận hàng'
        },
        {
            id: 'vnpay',
            name: 'VNPAY',
            icon: '🏦',
            description: 'Thanh toán qua VNPAY (ATM/Visa/MasterCard)'
        },
        {
            id: 'payos',
            name: 'PayOS',
            icon: '📱',
            description: 'Thanh toán qua PayOS (QR Code/Chuyển khoản)'
        }
    ];

    useEffect(() => {
        if (isGuest) {
            if (onLogin) {
                onLogin();
            } else {
                window.location.hash = 'cart';
            }
            return;
        }
        loadCartData();
    }, [user, isGuest, onLogin]);

    const loadCartData = async () => {
        try {
            setLoading(true);
            setError('');
            if (!user?.id) {
                setError('Vui lòng đăng nhập để thanh toán');
                return;
            }

            const cartData = await CartAPI.getOrCreateCart(user.id); //Lay cart theo user_id
            setCart(cartData);
            const itemsData = await CartAPI.getCartItems(cartData.id);

            // ✅ TRANSFORM DATA
            const transformedItems = Array.isArray(itemsData)
                ? itemsData.map((item) => ({
                      id: item.id,
                      cart_id: item.cart_id,
                      product_detail_id: item.product_detail_id,
                      quantity: item.quantity,
                      product_id: item.product_details?.product?.id,
                      product_name: item.product_details?.product?.name,
                      product_image: item.product_details?.product?.image,
                      size_name: `Size ${
                          item.product_details?.sizes?.name ||
                          (item.product_details?.size_id === 1
                              ? 'S'
                              : item.product_details?.size_id === 2
                              ? 'M'
                              : 'L')
                      }`,
                      price: item.product_details?.price,
                      oldprice: item.product_details?.oldprice,
                      stock_quantity: item.product_details?.quantity
                  }))
                : [];

            setCartItems(transformedItems);
            if (transformedItems.length === 0) {
                setError(
                    'Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.'
                );
            }
        } catch (error) {
            console.error('❌ Error loading cart:', error);
            setError('Không thể tải giỏ hàng: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        // ✅ CLEAR ERROR FOR THIS FIELD
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handlePaymentMethodChange = (methodId) => {
       setFormData((prev) => ({
           ...prev,
           payment_method: methodId
       }));
    };

    const validateForm = () => {
        const errors = {};
        //phone validation
        if (!formData.phone.trim()) {
            errors.phone = 'Số điện thoại không được để trống';
        } else if (!/^[0-9]{10,11}$/.test(formData.phone.trim())) {
            errors.phone = 'Số điện thoại phải có 10-11 chữ số';
        }

        // Address validation
        if (!formData.address.trim()) {
            errors.address = 'Địa chỉ không được để trống';
        } else if (formData.address.trim().length < 10) {
            errors.address = 'Địa chỉ phải có ít nhất 10 ký tự';
        }

        // Note validation (optional)
        if (formData.note && formData.note.length > 500) {
            errors.note = 'Ghi chú không được quá 500 ký tự';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCheckout = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setError('Vui lòng kiểm tra lại thông tin nhập vào');
            return;
        }

        if (cartItems.length === 0) {
            setError('Giỏ hàng trống, không thể thanh toán');
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            setSuccess('');

            const checkoutData = {
                cart_id: cart.id,
                user_id: user.id,
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                payment_method: formData.payment_method,
                note: formData.note.trim() || null,
                total_amount: calculateCartTotal()
            };
           

            // ✅ VALIDATE DATA BEFORE SENDING
            const validationErrors = CheckoutService.validateCheckoutData(checkoutData);
            if (validationErrors.length > 0) {
                setError(
                    '❌ Thông tin không hợp lệ: ' + validationErrors.join(', ')
                );
                return;
            }
          
           
            if(formData.payment_method === 'cod') {
                const res = await CheckoutService.checkout(checkoutData);

                const isSuccess = res.status === 'success' || res.success === true || res.message?.toLowerCase().includes('thành công');

                if(!isSuccess){
                    throw new Error(res.message || 'Lỗi khi đặt hàng');
                }

                setSuccess(' Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
                setCartItems([]);
                setFormData({
                    phone: user?.phone || '',
                    address: '',
                    note: '',
                    payment_method: 'cod'
                });

                setTimeout(() => {
                    window.location.hash = 'orders';
                }, 2000);

                return;

            
            }else if(formData.payment_method === 'vnpay' || formData.payment_method === 'payos') {
                const response = await fetch('http://localhost:3003/api/payments/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("admin_token")}`,
                    },
                    body: JSON.stringify(checkoutData)
                });

                const result = await response.json();

                const paymentUrl = result.data?.payment_url;
                console.log(' Payment URL received:', paymentUrl);
                if(paymentUrl){
                    setSuccess(' Chuyển hướng đến trang thanh toán...');
                    setTimeout(() => {
                        window.location.href =paymentUrl
                    }, 1000);
                    return;
                }else {
                    throw new Error('Không nhận được URL thanh toán từ server');
                }
            }
            // ✅ CLEAR CART ITEMS (OPTIONAL)
            

        } catch (error) {
              console.error(' Payment error:', error);
            setError('Lỗi khi đặt hàng: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const formatPrice = (price) => {
        if (!price) return '0 đ';
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

    if (loading) {
        return (
            <Layout
                user={user}
                onLogout={onLogout}
                currentPage='checkout'
                isGuest={isGuest}
                onLogin={onLogin}
            ></Layout>
        );
    }

    return (
        <Layout
            user={user}
            onLogout={onLogout}
            currentPage='checkout'
            isGuest={isGuest}
            onLogin={onLogin}
        >
            <div className='checkout-container'>
                {/* ✅ BREADCRUMB */}
                <div className='breadcrumb'>
                    <span
                        onClick={() => (window.location.hash = 'home')}
                        className='breadcrumb-link'
                    >
                        🏠 Trang chủ
                    </span>
                    <span className='separator'>{'>'}</span>
                    <span
                        onClick={() => (window.location.hash = 'cart')}
                        className='breadcrumb-link'
                    >
                        🛒 Giỏ hàng
                    </span>
                    <span className='separator'>{'>'}</span>
                    <span className='current'>💳 Thanh toán</span>
                </div>

                <div className='checkout-header'>
                    <h1>💳 Thanh toán đơn hàng</h1>
                    <p>Vui lòng kiểm tra thông tin và hoàn tất đơn hàng</p>
                </div>

                {/* ✅ SUCCESS MESSAGE */}
                {success && (
                    <div className='success-message'>
                        <span className='success-icon'>✅</span>
                        <div className='success-content'>
                            <p>{success}</p>
                            <small>Đang chuyển hướng về trang chủ...</small>
                        </div>
                    </div>
                )}

                {/* ✅ ERROR MESSAGE */}
                {error && (
                    <div className='error-message'>
                        <span className='error-icon'>❌</span>
                        <span>{error}</span>
                        <button
                            onClick={() => setError('')}
                            className='close-error'
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className='checkout-content'>
                    {/* ✅ ORDER SUMMARY */}
                    <div className='order-summary'>
                        <h2>📋 Thông tin đơn hàng</h2>

                        <div className='summary-items'>
                            {cartItems.map((item) => (
                                <div key={item.id} className='summary-item'>
                                    <div className='item-image'>
                                        <img
                                            src={item.product_image}
                                            alt={item.product_name}
                                            onError={(e) => {
                                                e.target.src =
                                                    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&q=80&fit=crop';
                                            }}
                                        />
                                    </div>
                                    <div className='item-details'>
                                        <h4>{item.product_name}</h4>
                                        <p>{item.size_name}</p>
                                        <div className='item-pricing'>
                                            <span className='quantity'>
                                                x{item.quantity}
                                            </span>
                                            <span className='price'>
                                                {formatPrice(item.price)}
                                            </span>
                                            <span className='total'>
                                                {formatPrice(
                                                    calculateItemTotal(item)
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='summary-totals'>
                            <div className='total-row'>
                                <span>Tổng sản phẩm:</span>
                                <span>{getTotalItems()} sản phẩm</span>
                            </div>
                            <div className='total-row'>
                                <span>Phí vận chuyển:</span>
                                <span>Miễn phí</span>
                            </div>
                            <div className='total-row grand-total'>
                                <span>Tổng cộng:</span>
                                <span>{formatPrice(calculateCartTotal())}</span>
                            </div>
                        </div>
                    </div>

                    {/* ✅ CHECKOUT FORM */}
                    <div className='checkout-form'>
                        <h2>📝 Thông tin giao hàng</h2>

                        <form onSubmit={handleCheckout}>
                            {/* ✅ USER INFO */}
                            <div className='form-section'>
                                <h3>👤 Thông tin khách hàng</h3>
                                <div className='user-info-display'>
                                    <p>
                                        <strong>Tên:</strong>{' '}
                                        {user?.name || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Email:</strong>{' '}
                                        {user?.email || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* ✅ CONTACT INFO */}
                            <div className='form-section'>
                                <h3>📞 Thông tin liên hệ</h3>

                                <div className='form-group'>
                                    <label htmlFor='phone'>
                                        Số điện thoại{' '}
                                        <span className='required'>*</span>
                                    </label>
                                    <input
                                        type='tel'
                                        id='phone'
                                        name='phone'
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder='Nhập số điện thoại (10-11 số)'
                                        className={
                                            formErrors.phone ? 'error' : ''
                                        }
                                        disabled={submitting}
                                    />
                                    {formErrors.phone && (
                                        <span className='field-error'>
                                            {formErrors.phone}
                                        </span>
                                    )}
                                </div>

                                <div className='form-group'>
                                    <label htmlFor='address'>
                                        Địa chỉ giao hàng{' '}
                                        <span className='required'>*</span>
                                    </label>
                                    <textarea
                                        id='address'
                                        name='address'
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder='Nhập địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)'
                                        rows={3}
                                        className={
                                            formErrors.address ? 'error' : ''
                                        }
                                        disabled={submitting}
                                    />
                                    {formErrors.address && (
                                        <span className='field-error'>
                                            {formErrors.address}
                                        </span>
                                    )}
                                </div>

                                <div className='form-group'>
                                    <label htmlFor='note'>
                                        Ghi chú (tùy chọn)
                                    </label>
                                    <textarea
                                        id='note'
                                        name='note'
                                        value={formData.note}
                                        onChange={handleInputChange}
                                        placeholder='Ghi chú thêm cho đơn hàng (ví dụ: giao hàng giờ hành chính, hàng dễ vỡ...)'
                                        rows={2}
                                        className={
                                            formErrors.note ? 'error' : ''
                                        }
                                        disabled={submitting}
                                        maxLength={500}
                                    />
                                    <small className='char-count'>
                                        {formData.note.length}/500 ký tự
                                    </small>
                                    {formErrors.note && (
                                        <span className='field-error'>
                                            {formErrors.note}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className='form-section'>
                                <h3>💳 Phương thức thanh toán</h3>
                                
                                <div className='payment-methods'>
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            className={`payment-method-card ${formData.payment_method === method.id ? 'selected' : ''}`}
                                            onClick={() => !submitting && handlePaymentMethodChange(method.id)}
                                        >
                                            <div className='method-radio'>
                                                <input 
                                                    type='radio' 
                                                    id={`payment-${method.id}`} 
                                                    name='payment_method' 
                                                    value={method.id} 
                                                    checked={formData.payment_method === method.id} 
                                                    onChange={() => handlePaymentMethodChange(method.id)} 
                                                    disabled={submitting} 
                                                />
                                            </div>
                                            <div className='method-info'>{method.icon}</div>
                                            <div className='method-info'>
                                                <h4>{method.name}</h4>
                                                <p>{method.description}</p>
                                            </div>
                                             {formData.payment_method === method.id && (
                                                <div className='method-check'>✓</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                 {formData.payment_method === 'vnpay' && (
                                    <div className='payment-info-box vnpay'>
                                        <h4>🏦 Thông tin VNPAY Sandbox (Test)</h4>
                                        <ul>
                                            <li><strong>Ngân hàng:</strong> NCB</li>
                                            <li><strong>Số thẻ:</strong> 9704198526191432198</li>
                                            <li><strong>Tên:</strong> NGUYEN VAN A</li>
                                            <li><strong>Ngày phát hành:</strong> 07/15</li>
                                            <li><strong>Mật khẩu OTP:</strong> 123456</li>
                                        </ul>
                                    </div>
                                )}

                                {/* ✅ THÔNG TIN THÊM CHO PAYOS */}
                                {formData.payment_method === 'payos' && (
                                    <div className='payment-info-box payos'>
                                        <h4>📱 Thông tin PayOS</h4>
                                        <p>Bạn sẽ được chuyển đến trang PayOS để thanh toán qua:</p>
                                        <ul>
                                            <li>Quét mã QR bằng ứng dụng ngân hàng</li>
                                            <li>Chuyển khoản ngân hàng</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                            {/* ✅ SUBMIT BUTTONS */}
                            <div className='form-actions'>
                                <button
                                    type='button'
                                    onClick={() =>
                                        (window.location.hash = 'cart')
                                    }
                                    className='btn-back'
                                    disabled={submitting}
                                >
                                    ← Quay lại giỏ hàng
                                </button>

                                <button
                                    type='submit'
                                    className='btn-checkout'
                                    disabled={
                                        submitting || cartItems.length === 0
                                    }
                                >
                                    {submitting ? (
                                        <>
                                            <span className='loading-spinner'>
                                                ⏳
                                            </span>
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            💳 Đặt hàng (
                                            {formatPrice(calculateCartTotal())})
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
