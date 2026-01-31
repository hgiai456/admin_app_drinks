import { useEffect, useState } from "react";
import Layout from "@components/common/Layout.jsx";
import "@styles/pages/_payment-result.scss";
import PaymentService from "@services/payment.service.js";
import { navigation } from "@utils/editorHelpers.js";

export default function PaymentResult({ user, onLogout }) {
  const [status, setStatus] = useState("loading");
  const [orderId, setOrderId] = useState(null);
  const [amount, setAmount] = useState(null);
  const [message, setMessage] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [methodPayment, setMethodPayment] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    const queryIndex = hash.indexOf("?");

    let params = new URLSearchParams();
    if (queryIndex !== -1) {
      const queryString = hash.substring(queryIndex + 1);
      params = new URLSearchParams(queryString);
    }

    const statusParam = params.get("status");
    const orderIdParam = params.get("orderId") || params.get("vnp_TxnRef");
    const amountParam = params.get("amount");
    const messageParam = params.get("message");
    const methodParam = params.get("method") || "";

    console.log("📦 Payment Result Params:", {
      status: statusParam,
      orderId: orderIdParam,
      amount: amountParam,
      message: messageParam,
    });

    setOrderId(orderIdParam);
    setAmount(amountParam);
    setMethodPayment(methodParam);

    if (orderIdParam) {
      loadOrderDetails(orderIdParam);
    }

    // Xác định status
    if (statusParam === "success") {
      setStatus("success");
      setMessage(
        methodParam === "sepay"
          ? "Thanh toán thành công! Cảm ơn bạn đã đặt hàng."
          : "Đặt hàng thành công! Cảm ơn bạn đã đặt hàng.",
      );
    } else if (statusParam === "failed") {
      setStatus("failed");
      setMessage(messageParam || "Thanh toán thất bại. Vui lòng thử lại.");
    } else if (statusParam === "cancelled") {
      setStatus("cancelled");
      setMessage("Bạn đã hủy thanh toán.");
    } else if (statusParam === "error") {
      setStatus("failed");
      setMessage(decodeURIComponent(messageParam || "Có lỗi xảy ra."));
    } else {
      setStatus("pending");
      setMessage("Đang xử lý thanh toán...");
    }
  }, []);

  const loadOrderDetails = async (orderId) => {
    try {
      const response = await PaymentService.getPaymentStatus(orderId);
      const result = await response.json();

      if (result.success) {
        setOrderDetails(result.data);
        console.log("📦 Order details loaded:", result.data);
      }
    } catch (error) {
      console.error("❌ Load order details error:", error);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const handleGoHome = () => {
    window.location.hash = "home";
  };

  const handleViewOrder = () => {
    navigation(`orders`);
  };

  const handleRetry = () => {
    window.location.hash = "checkout";
  };

  const handleGoToCart = () => {
    window.location.hash = "cart";
  };

  return (
    <Layout user={user} onLogout={onLogout} currentPage="payment-result">
      <div className="payment-result-container">
        <div className="payment-result-card">
          {status === "loading" && (
            <div className="result-loading">
              <div className="spinner">⏳</div>
              <p>Đang xử lý thanh toán...</p>
            </div>
          )}

          {status === "success" && (
            <div className="result-success">
              <div className="result-icon success-icon">✓</div>
              <h1>
                {methodPayment === "sepay"
                  ? "Thanh toán thành công !"
                  : "Đặt hàng thành công!"}
              </h1>
              <p className="result-message">{message}</p>

              {orderDetails && (
                <div className="order-details-card">
                  <h3>📋 Thông tin đơn hàng</h3>

                  <div className="detail-row">
                    <span className="label">Mã đơn hàng:</span>
                    <span className="value">#{orderDetails.order_id}</span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Số tiền:</span>
                    <span className="value amount">
                      {formatPrice(orderDetails.amount)}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Phương thức:</span>
                    <span className="value">
                      {methodPayment === "sepay" && "📱 SePay"}
                      {methodPayment === "cod" && "💵 COD"}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Trạng thái:</span>
                    <span className="value status-completed">
                      ✅ Đã thanh toán
                    </span>
                  </div>

                  {orderDetails.transaction_id && (
                    <div className="detail-row">
                      <span className="label">Mã GD:</span>
                      <span className="value transaction-id">
                        {orderDetails.transaction_id}
                      </span>
                    </div>
                  )}

                  {orderDetails.order?.phone && (
                    <div className="detail-row">
                      <span className="label">SĐT:</span>
                      <span className="value">{orderDetails.order.phone}</span>
                    </div>
                  )}

                  {orderDetails.order?.address && (
                    <div className="detail-row">
                      <span className="label">Địa chỉ:</span>
                      <span className="value address">
                        {orderDetails.order.address}
                      </span>
                    </div>
                  )}

                  {/* Products */}
                  {orderDetails.order?.order_details && (
                    <div className="products-section">
                      <h4>
                        📦 Sản phẩm ({orderDetails.order.order_details.length})
                      </h4>
                      <div className="products-list">
                        {orderDetails.order.order_details.map(
                          (detail, index) => (
                            <div key={index} className="product-item">
                              <div className="product-info">
                                <span className="product-name">
                                  {detail.product_detail?.product?.name}
                                </span>
                                <span className="product-size">
                                  {detail.product_detail?.sizes?.name}
                                </span>
                              </div>
                              <div className="product-price">
                                <span className="quantity">
                                  x{detail.quantity}
                                </span>
                                <span className="price">
                                  {formatPrice(detail.price * detail.quantity)}
                                </span>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!orderDetails && orderId && (
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
                  📋 Xem chi tiết đơn hàng
                </button>
                <button onClick={handleGoHome} className="btn-secondary">
                  🏠 Về trang chủ
                </button>
              </div>
            </div>
          )}

          {/* FAILED */}
          {status === "failed" && (
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
          {status === "cancelled" && (
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
          {status === "pending" && (
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
