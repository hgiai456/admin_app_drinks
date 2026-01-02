import { useEffect, useState } from 'react';
import { getOrdersByUserId } from '@services/order.service.js';
import '@styles/pages/_order.scss';

export default function OrderHistory({ user }) {
   const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [error, setError] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        if (!user?.id) return;
        setLoading(true);
        getOrdersByUserId(user.id, page)
            .then((res) => {
                setOrders(res.data || []);
                setTotalPage(res.totalPage || 1);
                setError('');
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [user, page]);

    const getStatusInfo = (status) => {
        switch (status) {
            case 1:
                return { text: 'Chờ xác nhận' };
            case 2:
                return { text: 'Đang xử lý' };
            case 3:
                return { text: 'Đã giao'};
            case 4:
                return { text: 'Đã hoàn thành' };
            default:
                return { text: 'Đã hủy' };
        }
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    if (!user?.id) {
        return (
            <div className="order-list-container">
                <div className="empty-state">
                    <div className="empty-icon">🔐</div>
                    <h3>Vui lòng đăng nhập</h3>
                    <p>Bạn cần đăng nhập để xem lịch sử đơn hàng</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="order-list-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Đang tải đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-list-container">
                <div className="error-state">
                    <div className="error-icon">❌</div>
                    <h3>Có lỗi xảy ra</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className="order-list-container">
                <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h3>Chưa có đơn hàng</h3>
                    <p>Bạn chưa có đơn hàng nào. Hãy đặt hàng ngay!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="order-list-container">
            <div className="order-list-header">
                <h2>📋 Lịch sử đơn hàng</h2>
                <p className="order-count">Tổng: {orders.length} đơn hàng</p>
            </div>

            <div className="orders-grid">
                {orders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    const isExpanded = expandedOrder === order.id;

                    return (
                        <div key={order.id} className="order-card">
                            <div className="order-card-header">
                                <div className="order-info">
                                    <span className="order-id">#{order.id}</span>
                                    <span className={`order-status ${statusInfo.class}`}>
                                        {statusInfo.text}
                                    </span>
                                </div>
                                <div className="order-date">
                                    {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>

                            <div className="order-card-body">
                                <div className="order-summary">
                                    <div className="summary-item">
                                        <span className="label">📍 Địa chỉ:</span>
                                        <span className="value">{order.address}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="label">📞 Điện thoại:</span>
                                        <span className="value">{order.phone}</span>
                                    </div>
                                    {order.note && (
                                        <div className="summary-item">
                                            <span className="label">📝 Ghi chú:</span>
                                            <span className="value">{order.note}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="order-total">
                                    <span>Tổng tiền:</span>
                                    <span className="amount">{order.total?.toLocaleString('vi-VN')}₫</span>
                                </div>

                                <button
                                    className={`toggle-details-btn ${isExpanded ? 'expanded' : ''}`}
                                    onClick={() => toggleOrderDetails(order.id)}
                                >
                                    {isExpanded ? '▲ Ẩn chi tiết' : '▼ Xem chi tiết'}
                                </button>

                                {isExpanded && (
                                    <div className="order-details">
                                        <h4>Chi tiết sản phẩm:</h4>
                                        <div className="products-list">
                                            {order.order_details?.map((item, idx) => (
                                                <div key={idx} className="product-item">
                                                    <img
                                                        src={item.product_details?.product?.image}
                                                        alt={item.product_details?.name}
                                                        className="product-image"
                                                    />
                                                    <div className="product-info">
                                                        <h5>{item.product_details?.name}</h5>
                                                        <div className="product-meta">
                                                            <span className="quantity">x{item.quantity}</span>
                                                            <span className="price">
                                                                {item.price?.toLocaleString('vi-VN')}₫
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {totalPage > 1 && (
                <div className="pagination">
                    <button
                        className="pagination-btn"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        ⬅️ Trước
                    </button>
                    <span className="pagination-info">
                        Trang {page} / {totalPage}
                    </span>
                    <button
                        className="pagination-btn"
                        disabled={page >= totalPage}
                        onClick={() => setPage(page + 1)}
                    >
                        Tiếp ➡️
                    </button>
                </div>
            )}
        </div>
    );
}