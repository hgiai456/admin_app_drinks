import { useEffect, useState } from "react";
import OrderService from "@services/order.service.js";
import { orderStatusMap } from "@models/order";
import Modal from "@components/admin/ModelComponent.jsx";
import Button from "@components/common/Button.jsx";
import "@styles/pages/_admin.scss";
import "@styles/pages/_order-manager.scss";
import { ShoppingCart } from "lucide-react";
import AlertMessage from "@components/common/AlertMessage.jsx";
import Loading from "../../components/common/Loading";

const getAvailableStatuses = (currentStatus) => {
  const statusFlow = {
    1: [2, 6, 7],
    2: [3, 6, 7],
    3: [4, 5, 7], // Đã vận chuyển => Đã hoàn tất | Trả hàng | Đã thất bại
    4: [5], // Đã hoàn tất => Trả hàng
    5: [], // Trả hàng => Không thể chuyển (trạng thái cuối)
    6: [], // Đã hủy => Không thể chuyển (trạng thái cuối)
    7: [],
  };

  const availableStatuses = [
    currentStatus,
    ...(statusFlow[currentStatus] || []),
  ];
  return availableStatuses;
};

const isStatusDisabled = (currentStatus, targetStatus) => {
  const availableStatuses = getAvailableStatuses(currentStatus);
  return !availableStatuses.includes(targetStatus);
};

//  CONSTANTS
const STATUS_CONFIG = {
  1: { color: "#1976d2", icon: "⏳", label: "Chờ xác nhận" },
  2: { color: "#ff9800", icon: "🚚", label: "Đang chuẩn bị" },
  3: { color: "#2e7d32", icon: "✅", label: "Đã vận chuyển" },
  4: { color: "#2e7d32", icon: "✅", label: "Đã hoàn tất" },
  5: { color: "#d32f2f", icon: "↩️", label: "Trả hàng" },
  6: { color: "#d32f2f", icon: "❌", label: "Đã thất bại" },
  7: { color: "#d32f2f", icon: "🚫", label: "Đã hủy" },
};

const PAYMENT_STATUS_CONFIG = {
  pending: { color: "#ff9800", icon: "⏳", label: "Chờ thanh toán" },
  completed: { color: "#4caf50", icon: "✅", label: "Đã thanh toán" },
  failed: { color: "#f44336", icon: "❌", label: "Thất bại" },
};

const PAYMENT_METHOD_CONFIG = {
  cod: { icon: "💵", label: "COD" },
  vnpay: { icon: "🏦", label: "VNPAY" },
  sepay: { icon: "📱", label: "SePay" },
};

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("detail");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalOrders, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState(1);
  const [messageType, setMessageType] = useState("info");

  // HELPER FUNCTIONS
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0đ";
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || {
      color: "#666",
      icon: "❓",
      label: "Không xác định",
    };
    return (
      <span className={`status-badge status-${status}`}>
        <span className="badge-icon">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const PaymentStatusBadge = ({ status }) => {
    const config =
      PAYMENT_STATUS_CONFIG[status] || PAYMENT_STATUS_CONFIG.pending;
    return (
      <span className={`status-badge payment-${status || "pending"}`}>
        <span className="badge-icon">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const PaymentMethodBadge = ({ method }) => {
    const config = PAYMENT_METHOD_CONFIG[method] || PAYMENT_METHOD_CONFIG.cod;
    return (
      <span
        style={{
          alignItems: "center",
          fontWeight: "500",
        }}
      >
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const fetchOrders = async (
    pageNum = 1,
    searchTerm = "",
    statusFilter = "all",
  ) => {
    setLoading(true);
    try {
      const response = await OrderService.getOrders(pageNum, 10);

      if (!response?.data) {
        setOrders([]);
        setTotalPage(1);
        setTotalItems(0);
        return;
      }

      let ordersData = response.data || [];
      const totalOrdersCount = response.totalOrders || 0;
      const totalPagesFromAPI = response.totalPage || 1;

      // Client-side filters
      if (searchTerm) {
        ordersData = ordersData.filter(
          (order) =>
            order.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id?.toString().includes(searchTerm),
        );
      }

      if (statusFilter !== "all") {
        ordersData = ordersData.filter(
          (order) => String(order.status) === String(statusFilter),
        );
      }

      setOrders(ordersData);
      setTotalPage(totalPagesFromAPI);
      setTotalItems(totalOrdersCount);
      setPage(pageNum);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      setMessage(`❌ ${error.message}`);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, "", "all").finally(() => setLoadingData(false));
  }, []);

  useEffect(() => {
    if (!loadingData) {
      fetchOrders(page, search, filterStatus);
    }
  }, [page, search, filterStatus]);

  const openDetailModal = async (order) => {
    try {
      setLoading(true);
      const response = await OrderService.getOrderById(order.id);
      setSelectedOrder(response);
      setModalMode("detail");
      setEditingId(order.id);
      setShowModal(true);
    } catch (error) {
      setMessage("❌ Lỗi tải chi tiết đơn hàng: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setModalMode("update");
    setEditingId(order.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setEditingId(null);
    setNewStatus(1);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    setLoading(true);
    try {
      await OrderService.updateOrderStatus(selectedOrder.id, newStatus);
      setMessage("Cập nhật trạng thái thành công!");
      setMessageType("success");
      closeModal();
      await fetchOrders(page, search, filterStatus);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Lỗi: " + error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchTerm = new FormData(e.target).get("search") || "";
    setSearch(searchTerm);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage && newPage !== page && !loading) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderDetailModal = () => (
    <div
      className="order-detail-modal"
      style={{ maxHeight: "70vh", overflowY: "auto" }}
    >
      {/* Order Info Section */}
      <div className="order-info-section">
        <h4 className="section-title">Thông tin đơn hàng</h4>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">ID Đơn hàng</div>
            <div className="info-value">#{selectedOrder.id}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Trạng thái</div>
            <div className="info-value">
              <StatusBadge status={selectedOrder.status} />
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">Điện thoại</div>
            <div className="info-value">📞 {selectedOrder.phone || "N/A"}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Tổng tiền</div>
            <div className="info-value highlight">
              {formatCurrency(selectedOrder.total)}
            </div>
          </div>
          <div className="info-item full-width">
            <div className="info-label">Địa chỉ</div>
            <div className="info-value">
              🏠 {selectedOrder.address || "N/A"}
            </div>
          </div>
          {selectedOrder.note && (
            <div className="info-item full-width">
              <div className="info-label">Ghi chú</div>
              <div className="info-value">📝 {selectedOrder.note}</div>
            </div>
          )}
          <div className="info-item">
            <div className="info-label">Ngày đặt</div>
            <div className="info-value">
              📅 {formatDate(selectedOrder.createdAt)}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">Cập nhật</div>
            <div className="info-value">
              🔄 {formatDate(selectedOrder.updatedAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Info Section */}
      <div className="payment-info-section">
        <h4 className="section-title">💳 Thông tin thanh toán</h4>
        <div className="payment-grid">
          <div className="payment-item">
            <div className="payment-label">Phương thức</div>
            <div className="payment-value">
              <PaymentMethodBadge method={selectedOrder.payment_method} />
            </div>
          </div>
          <div className="payment-item">
            <div className="payment-label">Trạng thái</div>
            <div className="payment-value">
              <PaymentStatusBadge status={selectedOrder.payment_status} />
            </div>
          </div>
          {selectedOrder.transaction_id && (
            <div className="payment-item full-width">
              <div className="payment-label">Mã giao dịch</div>
              <div className="payment-value">
                <span className="transaction-id">
                  {selectedOrder.transaction_id}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Items Section */}
      <div className="order-items-section">
        <h4 className="items-header">
          🛍️ Chi tiết sản phẩm
          <span className="items-count">
            {selectedOrder.order_details?.length || 0}
          </span>
        </h4>
        <div className="items-list">
          {selectedOrder.order_details?.map((item, index) => (
            <div key={item.id || index} className="order-item">
              <div className="item-info">
                <div className="item-name">
                  {item.product_details?.name ||
                    `Sản phẩm #${item.product_detail_id}`}
                </div>
                {item.product_details?.sizes?.name && (
                  <div className="item-size">
                    📏 Size: {item.product_details.sizes.name}
                  </div>
                )}
                <div className="item-quantity">
                  SL: <strong>{item.quantity}</strong> ×{" "}
                  {formatCurrency(item.price)}
                </div>
              </div>
              <div className="item-total">
                {formatCurrency(item.quantity * item.price)}
              </div>
            </div>
          ))}
        </div>

        <div className="order-total">
          <span className="total-label">💰 Tổng cộng</span>
          <span className="total-value">
            {formatCurrency(selectedOrder.total)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="form-buttons" style={{ marginTop: "24px" }}>
        <button className="modal-btn modal-btn--secondary" onClick={closeModal}>
          ❌ Đóng
        </button>
        <button
          className="modal-btn modal-btn--warning"
          onClick={() => openUpdateModal(selectedOrder)}
        >
          ✏️ Cập nhật trạng thái
        </button>
      </div>
    </div>
  );

  const renderUpdateModal = () => {
    const currentStatus = selectedOrder?.status;
    const availableStatuses = getAvailableStatuses(currentStatus);

    return (
      <div className="update-status-modal">
        <div className="current-order-info">
          <div className="info-row">
            <span className="order-id">📦 Đơn hàng #{selectedOrder?.id}</span>
            <span className="order-phone">📞 {selectedOrder?.phone}</span>
          </div>
          <div className="current-status-display">
            <span className="label">Trạng thái hiện tại:</span>
            <StatusBadge status={currentStatus} />
          </div>
        </div>
        {/* Status Selection */}
        <div className="status-select-wrapper">
          <label className="status-label">
            🔄 Chọn trạng thái mới
            <span className="required-mark">*</span>
          </label>

          <div className="status-options">
            {Object.entries(orderStatusMap).map(([statusKey, label]) => {
              const statusNum = Number(statusKey);
              const isDisabled = isStatusDisabled(currentStatus, statusNum);
              const isCurrentStatus = statusNum === currentStatus;
              const isSelected = statusNum === newStatus;

              return (
                <label
                  key={statusKey}
                  className={`status-option ${isDisabled ? "disabled" : ""} ${
                    isSelected ? "selected" : ""
                  } ${isCurrentStatus ? "current" : ""}`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={statusNum}
                    checked={isSelected}
                    onChange={(e) => setNewStatus(Number(e.target.value))}
                    disabled={isDisabled}
                  />
                  <div className="option-content">
                    <span className="option-icon">
                      {STATUS_CONFIG[statusNum]?.icon}
                    </span>
                    <div className="option-text">
                      <span className="option-label">{label}</span>
                      {isCurrentStatus && (
                        <span className="current-badge">Hiện tại</span>
                      )}
                      {isDisabled && !isCurrentStatus && (
                        <span className="disabled-reason">Không khả dụng</span>
                      )}
                    </div>
                    {isSelected && <span className="check-icon">✓</span>}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="form-buttons">
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={closeModal}
            disabled={loading}
          >
            ❌ Hủy
          </Button>
          <Button
            type="button"
            variant="warning"
            size="md"
            onClick={handleUpdateStatus}
            disabled={loading || newStatus === currentStatus}
            loading={loading}
          >
            💾 Cập nhật trạng thái
          </Button>
        </div>
      </div>
    );
  };

  //  MAIN RENDER
  return (
    <div className="prodetail-container">
      <AlertMessage
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />

      <div className="header">
        <div className="header-title">
          <ShoppingCart size={30} className="header-icon" />
          <h2> Quản lý đơn hàng</h2>
        </div>
      </div>

      <div className="search-bar">
        <div className="search-info">
          Hiển thị <strong>{orders.length}</strong> /{" "}
          <strong>{totalOrders}</strong> đơn hàng
        </div>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            {Object.entries(orderStatusMap).map(([key, label]) => (
              <option key={key} value={key}>
                {STATUS_CONFIG[key]?.icon} {label}
              </option>
            ))}
          </select>
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              name="search"
              className="search-input"
              placeholder="Tìm kiếm (ID, SĐT, địa chỉ)..."
              defaultValue={search}
            />
            <button type="submit" className="btn-search">
              🔍 Tìm
            </button>
          </form>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>SDT</th>
              <th className="mobile-hide">Địa chỉ</th>
              <th>Trạng thái</th>
              <th>Thanh toán</th>
              <th>Tổng tiền</th>
              <th className="mobile-hide">Ngày đặt</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ padding: "0" }}>
                  <Loading variant="skeleton" rows={8} cols={8} />
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#999",
                  }}
                >
                  📦 Không có đơn hàng nào
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="table-id">#{order.id}</td>
                  <td className="text-bold"> {order.phone || "N/A"}</td>
                  <td className="mobile-hide">
                    <div className="address-cell" title={order.address}>
                      {order.address || "-"}
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td>
                    <PaymentMethodBadge method={order.payment_method} />
                  </td>
                  <td className="price" style={{ fontWeight: "bold" }}>
                    {formatCurrency(order.total)}
                  </td>
                  <td className="mobile-hide date">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="actions">
                    <div className="action-buttons">
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => openDetailModal(order)}
                        disabled={loading}
                      >
                        👁️ Chi tiết
                      </Button>

                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => openUpdateModal(order)}
                        disabled={loading}
                      >
                        ✏️ Cập nhật
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalOrders > 0 && (
        <div className="pagination">
          <div className="pagination-controls">
            <button
              className="btn-nav"
              onClick={() => handlePageChange(1)}
              disabled={page === 1 || loading}
            >
              ⏪ Đầu
            </button>
            <button
              className="btn-nav"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || loading}
            >
              ⬅️ Trước
            </button>

            {Array.from({ length: Math.min(5, totalPage) }, (_, i) => {
              let pageNum;
              if (totalPage <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPage - 2) {
                pageNum = totalPage - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  className={`btn-page ${page === pageNum ? "active" : ""}`}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={loading}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className="btn-nav"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPage || loading}
            >
              Tiếp ➡️
            </button>
            <button
              className="btn-nav"
              onClick={() => handlePageChange(totalPage)}
              disabled={page >= totalPage || loading}
            >
              Cuối ⏩
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        show={showModal}
        onClose={closeModal}
        title={
          modalMode === "detail"
            ? `👁️ Chi tiết đơn hàng #${editingId}`
            : `✏️ Cập nhật trạng thái #${editingId}`
        }
        size="lg"
      >
        {modalMode === "detail" && selectedOrder ? renderDetailModal() : null}
        {modalMode === "update" && selectedOrder ? renderUpdateModal() : null}
      </Modal>
    </div>
  );
}
