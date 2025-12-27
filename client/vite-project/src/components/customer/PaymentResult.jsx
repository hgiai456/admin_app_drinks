import { useEffect, useState } from 'react';
import Layout from '../common/Layout.jsx';
import '../../styles/pages/_payment-result.scss';

export default function PaymentResult({ user, onLogout }) {
    const [status, setStatus] = useState('loading');
    const [orderId, setOrderId] = useState(null);
    const [amount, setAmount] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // ✅ FIX: Lấy params từ hash URL thay vì search params
        const hash = window.location.hash;
        const queryIndex = hash.indexOf('?');
        
        let params = new URLSearchParams();
        if (queryIndex !== -1) {
            const queryString = hash.substring(queryIndex + 1);
            params = new URLSearchParams(queryString);
        }

        const statusParam = params.get('status');
        const orderIdParam = params.get('orderId') || params.get('vnp_TxnRef');
        const amountParam = params.get('amount');
        const messageParam = params.get('message');

        console.log('📦 Payment Result Params:', {
            status: statusParam,
            orderId: orderIdParam,
            amount: amountParam,
            message: messageParam
        });

        setOrderId(orderIdParam);
        setAmount(amountParam);

        // ✅ Xác định status
        if (statusParam === 'success') {
            setStatus('success');
            setMessage('Thanh toán thành công! Cảm ơn bạn đã đặt hàng.');
        } else if (statusParam === 'failed') {
            setStatus('failed');
            setMessage(messageParam || 'Thanh toán thất bại. Vui lòng thử lại.');
        } else if (statusParam === 'cancelled') {
            setStatus('cancelled');
            setMessage('Bạn đã hủy thanh toán.');
        } else if (statusParam === 'error') {
            setStatus('failed');
            setMessage(decodeURIComponent(messageParam || 'Có lỗi xảy ra.'));
        } else {
            setStatus('pending');
            setMessage('Đang xử lý thanh toán...');
        }
    }, []);

    const handleGoHome = () => {
        window.location.hash = 'home';
    };

    const handleViewOrder = () => {
        window.location.hash = 'orders';
    };

    const handleRetry = () => {
        window.location.hash = 'checkout';
    };

    const handleGoToCart = () => {
        window.location.hash = 'cart';
    };

    const formatPrice = (price) => {
        if (!price) return '';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <Layout user={user} onLogout={onLogout} currentPage="payment-result">
            <div className="payment-result-container">
                <div className="payment-result-card">
                    {/* LOADING */}
                    {status === 'loading' && (
                        <div className="result-loading">
                            <div className="spinner">⏳</div>
                            <p>Đang xử lý thanh toán...</p>
                        </div>
                    )}

                    {/* SUCCESS */}
                    {status === 'success' && (
                        <div className="result-success">
                            <div className="result-icon success-icon">✓</div>
                            <h1>Thanh toán thành công!</h1>
                            <p className="result-message">{message}</p>
                            
                            {orderId && (
                                <div className="order-info">
                                    <p className="order-id">
                                        Mã đơn hàng: <strong>#{orderId}</strong>
                                    </p>
                                    {amount && (
                                        <p className="order-amount">
                                            Số tiền: <strong>{formatPrice(amount)}</strong>
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="result-actions">
                                <button onClick={handleViewOrder} className="btn-primary">
                                    📋 Xem đơn hàng
                                </button>
                                <button onClick={handleGoHome} className="btn-secondary">
                                    🏠 Về trang chủ
                                </button>
                            </div>
                        </div>
                    )}

                    {/* FAILED */}
                    {status === 'failed' && (
                        <div className="result-failed">
                            <div className="result-icon failed-icon">✗</div>
                            <h1>Thanh toán thất bại</h1>
                            <p className="result-message">{message}</p>
                            
                            {orderId && (
                                <p className="order-id">
                                    Mã đơn hàng: <strong>#{orderId}</strong>
                                </p>
                            )}

                            <div className="result-actions">
                                <button onClick={handleRetry} className="btn-primary">
                                    🔄 Thử lại
                                </button>
                                <button onClick={handleGoHome} className="btn-secondary">
                                    🏠 Về trang chủ
                                </button>
                            </div>
                        </div>
                    )}

                    {/* CANCELLED */}
                    {status === 'cancelled' && (
                        <div className="result-cancelled">
                            <div className="result-icon cancelled-icon">⚠</div>
                            <h1>Đã hủy thanh toán</h1>
                            <p className="result-message">{message}</p>

                            <div className="result-actions">
                                <button onClick={handleGoToCart} className="btn-primary">
                                    🛒 Quay lại giỏ hàng
                                </button>
                                <button onClick={handleGoHome} className="btn-secondary">
                                    🏠 Về trang chủ
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PENDING */}
                    {status === 'pending' && (
                        <div className="result-pending">
                            <div className="spinner">⏳</div>
                            <h1>Đang xử lý</h1>
                            <p className="result-message">{message}</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}