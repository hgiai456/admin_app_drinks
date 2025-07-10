// components/OrderComponent.js
import { useEffect, useState } from "react";
import OrderAPI from "../api/orderapi";
import Order from "../models/ordermodel";

function OrderComponent() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    user_id: "",
    status: 0,
    total: 0,
    note: "",
    address: "",
    phone: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState(-1); // -1 = all
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let data;
      if (filterStatus === -1) {
        data = await OrderAPI.getAll();
      } else {
        data = await OrderAPI.getByStatus(filterStatus);
      }
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Có lỗi khi tải danh sách đơn hàng: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        name === "total" || name === "status" || name === "user_id"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!form.user_id || !form.address || !form.phone) {
      alert("User ID, địa chỉ và số điện thoại là bắt buộc!");
      return;
    }

    if (form.total <= 0) {
      alert("Tổng tiền phải lớn hơn 0!");
      return;
    }

    // Tạo plain object
    const orderData = {
      user_id: form.user_id,
      status: form.status,
      total: form.total,
      note: form.note.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
    };

    console.log("Submitting order data:", orderData);
    console.log("Editing ID:", editingId);

    try {
      setLoading(true);
      let result;
      if (editingId) {
        console.log("Updating order with data:", orderData);
        result = await OrderAPI.update(editingId, orderData);
        console.log("Update result:", result);
      } else {
        console.log("Creating new order with data:", orderData);
        result = await OrderAPI.create(orderData);
        console.log("Create result:", result);
      }

      // Reset form
      setForm({
        user_id: "",
        status: 0,
        total: 0,
        note: "",
        address: "",
        phone: "",
      });
      setEditingId(null);

      // Reload orders
      await fetchOrders();

      alert(
        editingId ? "Cập nhật đơn hàng thành công!" : "Tạo đơn hàng thành công!"
      );
    } catch (error) {
      console.error("Detailed error:", error);

      let errorMessage =
        "Có lỗi xảy ra khi " + (editingId ? "cập nhật" : "tạo") + " đơn hàng";
      if (error.message.includes("400")) {
        errorMessage += "\nLỗi: Dữ liệu không hợp lệ";
      } else if (error.message.includes("404")) {
        errorMessage += "\nLỗi: Không tìm thấy đơn hàng";
      } else if (error.message.includes("500")) {
        errorMessage += "\nLỗi: Lỗi server";
      }
      errorMessage += "\nChi tiết: " + error.message;

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      return;
    }

    try {
      setLoading(true);
      await OrderAPI.delete(id);
      await fetchOrders();
      alert("Xóa đơn hàng thành công!");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Có lỗi xảy ra khi xóa đơn hàng: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (order) => {
    console.log("Editing order:", order);
    setForm({
      user_id: order.getUserId(),
      status: order.getStatus(),
      total: order.getTotal(),
      note: order.getNote(),
      address: order.getAddress(),
      phone: order.getPhone(),
    });
    setEditingId(order.getId());
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await OrderAPI.updateStatus(orderId, newStatus);
      await fetchOrders();
      alert("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Có lỗi khi cập nhật trạng thái: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      user_id: "",
      status: 0,
      total: 0,
      note: "",
      address: "",
      phone: "",
    });
    setEditingId(null);
  };

  const getStatusOptions = (currentStatus) => {
    const options = [];
    Object.entries(Order.STATUS_TEXT).forEach(([value, text]) => {
      const statusValue = Number(value);
      if (statusValue === currentStatus) {
        options.push({ value: statusValue, text, disabled: false });
      } else {
        // Kiểm tra xem có thể chuyển sang trạng thái này không
        const tempOrder = new Order(1, 1, currentStatus);
        const canUpdate = tempOrder.canUpdateStatus(statusValue);
        options.push({ value: statusValue, text, disabled: !canUpdate });
      }
    });
    return options;
  };

  const getAvailableStatusTransitions = (currentStatus) => {
    const transitions = [];
    Object.entries(Order.STATUS).forEach(([key, value]) => {
      const tempOrder = new Order(1, 1, currentStatus);
      if (tempOrder.canUpdateStatus(value) && value !== currentStatus) {
        transitions.push({ value, text: Order.STATUS_TEXT[value], key });
      }
    });
    return transitions;
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <h2>Quản lý đơn hàng</h2>

      {/* Filter */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10 }}>
          Lọc theo trạng thái:
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(Number(e.target.value))}
            style={{ marginLeft: 10, padding: 5 }}
          >
            <option value={-1}>Tất cả</option>
            {Object.entries(Order.STATUS_TEXT).map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: 20, border: "1px solid #ccc", padding: 15 }}
      >
        <h3>{editingId ? "Cập nhật đơn hàng" : "Tạo đơn hàng mới"}</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <input
            name="user_id"
            placeholder="User ID"
            value={form.user_id}
            onChange={handleChange}
            type="number"
            required
            style={{ padding: 8 }}
          />
          <input
            name="total"
            placeholder="Tổng tiền"
            value={form.total}
            onChange={handleChange}
            type="number"
            step="0.01"
            required
            style={{ padding: 8 }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <input
            name="phone"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={handleChange}
            required
            style={{ padding: 8 }}
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={{ padding: 8 }}
          >
            {Object.entries(Order.STATUS_TEXT).map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </div>

        <textarea
          name="address"
          placeholder="Địa chỉ giao hàng"
          value={form.address}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 10, minHeight: 60 }}
        />

        <textarea
          name="note"
          placeholder="Ghi chú"
          value={form.note}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginBottom: 10, minHeight: 60 }}
        />

        <div>
          <button
            type="submit"
            disabled={loading}
            style={{ marginRight: 10, padding: "8px 16px" }}
          >
            {loading ? "Đang xử lý..." : editingId ? "Cập nhật" : "Tạo mới"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              style={{ padding: "8px 16px" }}
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      {/* Loading indicator */}
      {loading && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>Đang tải...</div>
      )}

      {/* Orders table */}
      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th>ID</th>
            <th>User ID</th>
            <th>Trạng thái</th>
            <th>Tổng tiền</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
            <th>Ghi chú</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.getId()}>
              <td>{order.getId()}</td>
              <td>{order.getUserId()}</td>
              <td>
                <span
                  style={{
                    backgroundColor: order.getStatusColor(),
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {order.getStatusText()}
                </span>
              </td>
              <td>{order.getFormattedTotal()}</td>
              <td style={{ maxWidth: 150, wordWrap: "break-word" }}>
                {order.getAddress()}
              </td>
              <td>{order.getPhone()}</td>
              <td style={{ maxWidth: 150, wordWrap: "break-word" }}>
                {order.getNote()}
              </td>
              <td>{order.getFormattedCreatedAt()}</td>
              <td>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  {/* Các nút chuyển trạng thái */}
                  {getAvailableStatusTransitions(order.getStatus()).map(
                    (transition) => (
                      <button
                        key={transition.key}
                        onClick={() =>
                          handleUpdateStatus(order.getId(), transition.value)
                        }
                        style={{
                          padding: "4px 8px",
                          fontSize: "12px",
                          backgroundColor: Order.STATUS_COLOR[transition.value],
                          color: "white",
                          border: "none",
                          borderRadius: "3px",
                          cursor: "pointer",
                        }}
                        disabled={loading}
                      >
                        {transition.text}
                      </button>
                    )
                  )}

                  {/* Nút Edit */}
                  <button
                    onClick={() => handleEdit(order)}
                    style={{
                      padding: "4px 8px",
                      fontSize: "12px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                    disabled={loading}
                  >
                    Sửa
                  </button>

                  {/* Nút Delete - chỉ cho phép xóa khi đơn hàng chưa được giao */}
                  {(order.isPending() || order.isCancelled()) && (
                    <button
                      onClick={() => handleDelete(order.getId())}
                      style={{
                        padding: "4px 8px",
                        fontSize: "12px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                      disabled={loading}
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Thống kê đơn hàng */}
      <div style={{ marginTop: 20 }}>
        <h3>Thống kê đơn hàng</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "10px",
          }}
        >
          {Object.entries(Order.STATUS_TEXT).map(([status, text]) => {
            const count = orders.filter(
              (order) => order.getStatus() === Number(status)
            ).length;
            const total = orders
              .filter((order) => order.getStatus() === Number(status))
              .reduce((sum, order) => sum + order.getTotal(), 0);

            return (
              <div
                key={status}
                style={{
                  padding: "15px",
                  backgroundColor: Order.STATUS_COLOR[status],
                  color: "white",
                  borderRadius: "5px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {text}
                </div>
                <div style={{ fontSize: "18px", margin: "5px 0" }}>
                  {count} đơn
                </div>
                <div style={{ fontSize: "12px" }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(total)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default OrderComponent;
