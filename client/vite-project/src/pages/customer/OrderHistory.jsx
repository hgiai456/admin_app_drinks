import { useEffect, useState } from "react";
import OrderService from "@services/order.service.js";
import "@styles/pages/_order.scss";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  RefreshCw,
  Truck,
  CheckCircle,
  PartyPopper,
  XCircle,
  Package,
  MapPin,
  Phone,
  FileText,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  CalendarDays,
} from "lucide-react";

export default function OrderHistory({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await OrderService.getOrdersByUserId(
          user.id,
          currentPage,
        );

        console.log("📦 OrderHistory response:", response);

        setOrders(response?.data);
        setTotalPage(response.totalPage);
        setTotalOrders(response.totalOrders);
      } catch (err) {
        console.error("❌ Error loading orders:", err);
        setError(err.message || "Không thể tải lịch sử đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, currentPage]);

  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= totalPage &&
      newPage !== currentPage &&
      !loading
    ) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const maxVisible = 5;
    const pages = [];

    if (totalPage <= maxVisible) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let end = start + maxVisible - 1;

      if (end > totalPage) {
        end = totalPage;
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      1: {
        text: "Chờ xác nhận",
        class: "status-pending",
        icon: <Clock size={14} />,
      },
      2: {
        text: "Đang xử lý",
        class: "status-processing",
        icon: <RefreshCw size={14} />,
      },
      3: {
        text: "Đã giao",
        class: "status-delivered",
        icon: <Truck size={14} />,
      },
      4: {
        text: "Hoàn thành",
        class: "status-completed",
        icon: <CheckCircle size={14} />,
      },
      5: {
        text: "Đã hủy",
        class: "status-cancelled",
        icon: <XCircle size={14} />,
      },
      6: {
        text: "Đã hủy",
        class: "status-cancelled",
        icon: <XCircle size={14} />,
      },
      7: {
        text: "Đã hủy",
        class: "status-cancelled",
        icon: <XCircle size={14} />,
      },
      0: {
        text: "Đã hủy",
        class: "status-cancelled",
        icon: <XCircle size={14} />,
      },
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
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h3>Lỗi tải dữ liệu</h3>
          <p>{error}</p>
          <button
            className="btn-retry"
            onClick={() => {
              setCurrentPage(1);
              setError("");
            }}
          >
            <RefreshCw size={16} /> Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0 && currentPage === 1) {
    return (
      <div className="order-history-container">
        <div className="empty-state">
          <div className="empty-icon">
            <ShoppingBag size={48} />
          </div>
          <h3>Chưa có đơn hàng nào</h3>
          <p>Hãy bắt đầu mua sắm và đặt đơn hàng đầu tiên!</p>
          <button
            className="btn-shop"
            onClick={() => (window.location.hash = "home")}
          >
            <ShoppingBag size={16} /> Mua sắm ngay
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
          <h1>
            <Package size={28} /> Lịch sử đơn hàng
          </h1>
          <p className="order-count">
            Tổng <strong>{totalOrders}</strong> đơn hàng
            {totalPage > 1 && (
              <span className="page-info">
                {" "}
                — Trang <strong>{currentPage}</strong>/
                <strong>{totalPage}</strong>
              </span>
            )}
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
                    <CalendarDays size={14} />{" "}
                    {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                  <span className="order-time">
                    <Clock size={14} />{" "}
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
                    <span className="info-icon">
                      <MapPin size={16} />
                    </span>
                    <div className="info-content">
                      <span className="info-label">Địa chỉ giao hàng</span>
                      <span className="info-value">{order.address}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">
                      <Phone size={16} />
                    </span>
                    <div className="info-content">
                      <span className="info-label">Số điện thoại</span>
                      <span className="info-value">{order.phone}</span>
                    </div>
                  </div>
                  {order.note && (
                    <div className="info-item full-width">
                      <span className="info-icon">
                        <FileText size={16} />
                      </span>
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
                  <span className="btn-icon">
                    {isExpanded ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </span>
                  <span className="btn-text">
                    {isExpanded ? "Ẩn chi tiết" : "Xem chi tiết"}
                  </span>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="order-details">
                    <div className="details-header">
                      <h4>
                        <Package size={16} /> Chi tiết sản phẩm
                      </h4>
                      <span className="product-count">
                        {order.order_details?.length || 0} sản phẩm
                      </span>
                    </div>
                    <div className="products-list">
                      {order.order_details?.map((item, idx) => (
                        <div key={idx} className="product-item">
                          <div className="product-image-wrapper">
                            <img
                              src={
                                item.product_details?.product?.image ||
                                item.product_details?.image
                              }
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
                              "vi-VN",
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

      {/* ✅ PAGINATION - Fixed */}
      {totalPage > 1 && (
        <div className="pagination">
          <div className="pagination-info-text">
            Trang <strong>{currentPage}</strong> / <strong>{totalPage}</strong>{" "}
            — Tổng <strong>{totalOrders}</strong> đơn hàng
          </div>

          <div className="pagination-controls">
            {/* First page */}
            <button
              className="pagination-btn btn-first"
              disabled={currentPage === 1 || loading}
              onClick={() => handlePageChange(1)}
              title="Trang đầu"
            >
              <ChevronsLeft size={18} />
            </button>

            {/* Previous page */}
            <button
              className="pagination-btn btn-prev"
              disabled={currentPage === 1 || loading}
              onClick={() => handlePageChange(currentPage - 1)}
              title="Trang trước"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Page numbers */}
            <div className="page-numbers">
              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  className={`pagination-btn btn-page ${currentPage === pageNum ? "active" : ""}`}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={loading}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            {/* Next page */}
            <button
              className="pagination-btn btn-next"
              disabled={currentPage >= totalPage || loading}
              onClick={() => handlePageChange(currentPage + 1)}
              title="Trang sau"
            >
              <ChevronRight size={18} />
            </button>

            {/* Last page */}
            <button
              className="pagination-btn btn-last"
              disabled={currentPage >= totalPage || loading}
              onClick={() => handlePageChange(totalPage)}
              title="Trang cuối"
            >
              <ChevronsRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
