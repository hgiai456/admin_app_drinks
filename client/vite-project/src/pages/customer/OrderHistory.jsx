import { useEffect, useState } from "react";
import { getOrdersByUserId } from "@services/order.service.js";
import "@styles/pages/_order.scss";

export default function OrderHistory({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    getOrdersByUserId(user.id, page)
      .then((res) => {
        setOrders(res.data || []);
        setTotalPage(res.totalPage || 1);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, page]);

  const getStatusInfo = (status) => {
    const statusMap = {
      1: { text: "Chờ xác nhận", class: "status-pending", icon: "⏳" },
      2: { text: "Đang xử lý", class: "status-processing", icon: "🔄" },
      3: { text: "Đã giao", class: "status-delivered", icon: "✅" },
      4: { text: "Hoàn thành", class: "status-completed", icon: "🎉" },
      0: { text: "Đã hủy", class: "status-cancelled", icon: "❌" },
    };
    return statusMap[status] || statusMap[0];
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // ===== EMPTY STATES =====
  if (!user?.id) {
    return (
      <div className="order-history-container">
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
      <div className="order-history-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history-container">
        <div className="error-state">
          <div className="error-icon">❌</div>
          <h3>Có lỗi xảy ra</h3>
          <p>{error}</p>
          <button
            className="btn-retry"
            onClick={() => window.location.reload()}
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="order-history-container">
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>Chưa có đơn hàng</h3>
          <p>Bạn chưa có đơn hàng nào. Hãy đặt hàng ngay!</p>
          <button
            className="btn-shop-now"
            onClick={() => (window.location.hash = "home")}
          >
            🛒 Mua sắm ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      {/* Header */}
      <div className="order-history-header">
        <div className="header-content">
          <h1>📋 Lịch sử đơn hàng</h1>
          <p className="order-count">
            Tổng <strong>{orders.length}</strong> đơn hàng
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          const isExpanded = expandedOrder === order.id;

          return (
            <div
              key={order.id}
              className={`order-card ${isExpanded ? "expanded" : ""}`}
            >
              {/* Card Header */}
              <div className="order-card-header">
                <div className="header-left">
                  <span className="order-id">
                    <span className="id-label">Đơn hàng</span>
                    <span className="id-value">#{order.id}</span>
                  </span>
                  <span className={`order-status ${statusInfo.class}`}>
                    <span className="status-icon">{statusInfo.icon}</span>
                    <span className="status-text">{statusInfo.text}</span>
                  </span>
                </div>
                <div className="header-right">
                  <span className="order-date">
                    📅{" "}
                    {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                  <span className="order-time">
                    🕐{" "}
                    {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="order-card-body">
                {/* Quick Info */}
                <div className="order-quick-info">
                  <div className="info-item">
                    <span className="info-icon">📍</span>
                    <div className="info-content">
                      <span className="info-label">Địa chỉ giao hàng</span>
                      <span className="info-value">{order.address}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📞</span>
                    <div className="info-content">
                      <span className="info-label">Số điện thoại</span>
                      <span className="info-value">{order.phone}</span>
                    </div>
                  </div>
                  {order.note && (
                    <div className="info-item full-width">
                      <span className="info-icon">📝</span>
                      <div className="info-content">
                        <span className="info-label">Ghi chú</span>
                        <span className="info-value">{order.note}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="order-total-wrapper">
                  <div className="order-total">
                    <span className="total-label">Tổng tiền</span>
                    <span className="total-amount">
                      {order.total?.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  className={`toggle-details-btn ${isExpanded ? "active" : ""}`}
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <span className="btn-icon">{isExpanded ? "▲" : "▼"}</span>
                  <span className="btn-text">
                    {isExpanded ? "Ẩn chi tiết" : "Xem chi tiết"}
                  </span>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="order-details">
                    <div className="details-header">
                      <h4>📦 Chi tiết sản phẩm</h4>
                      <span className="product-count">
                        {order.order_details?.length || 0} sản phẩm
                      </span>
                    </div>
                    <div className="products-list">
                      {order.order_details?.map((item, idx) => (
                        <div key={idx} className="product-item">
                          <div className="product-image-wrapper">
                            <img
                              src={item.product_details?.product?.image}
                              alt={item.product_details?.name}
                              className="product-image"
                              onError={(e) => {
                                e.target.src =
                                  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&q=80&fit=crop";
                              }}
                            />
                          </div>
                          <div className="product-info">
                            <h5 className="product-name">
                              {item.product_details?.name}
                            </h5>
                            <div className="product-meta">
                              <span className="product-quantity">
                                x{item.quantity}
                              </span>
                              <span className="product-price">
                                {item.price?.toLocaleString("vi-VN")}₫
                              </span>
                            </div>
                          </div>
                          <div className="product-total">
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN"
                            )}
                            ₫
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

      {/* Pagination */}
      {totalPage > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn btn-prev"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <span className="btn-icon">⬅️</span>
            <span className="btn-text">Trước</span>
          </button>
          <div className="pagination-info">
            <span className="current-page">{page}</span>
            <span className="separator">/</span>
            <span className="total-pages">{totalPage}</span>
          </div>
          <button
            className="pagination-btn btn-next"
            disabled={page >= totalPage}
            onClick={() => setPage(page + 1)}
          >
            <span className="btn-text">Tiếp</span>
            <span className="btn-icon">➡️</span>
          </button>
        </div>
      )}
    </div>
  );
}
