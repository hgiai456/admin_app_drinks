// models/ordermodel.js
class Order {
  // Định nghĩa các trạng thái đơn hàng
  static STATUS = {
    PENDING: 0, // Đang chờ xử lý
    PREPARING: 1, // Đang chuẩn bị đơn hàng
    SHIPPING: 2, // Đang giao hàng
    DELIVERED: 3, // Đã giao hàng
    CANCELLED: 4, // Đã hủy
    RETURNED: 5, // Đơn hoàn/trả lại
  };

  // Mapping trạng thái sang text tiếng Việt
  static STATUS_TEXT = {
    0: "Đang chờ xử lý",
    1: "Đang chuẩn bị đơn hàng",
    2: "Đang giao hàng",
    3: "Đã giao hàng",
    4: "Đã hủy",
    5: "Đơn hoàn/trả lại",
  };

  // Mapping màu sắc cho từng trạng thái
  static STATUS_COLOR = {
    0: "#ffa500", // orange
    1: "#1e90ff", // dodgerblue
    2: "#32cd32", // limegreen
    3: "#28a745", // success green
    4: "#dc3545", // danger red
    5: "#6c757d", // secondary gray
  };

  constructor(
    id,
    user_id,
    status = 0,
    total = 0,
    note = "",
    address = "",
    phone = "",
    createdAt = null,
    updatedAt = null
  ) {
    this.id = id;
    this.user_id = user_id;
    this.status = status;
    this.total = total;
    this.note = note;
    this.address = address;
    this.phone = phone;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Getters
  getId() {
    return this.id;
  }

  getUserId() {
    return this.user_id;
  }

  getStatus() {
    return this.status;
  }

  getStatusText() {
    return Order.STATUS_TEXT[this.status] || "Không xác định";
  }

  getStatusColor() {
    return Order.STATUS_COLOR[this.status] || "#000000";
  }

  getTotal() {
    return this.total;
  }

  getFormattedTotal() {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(this.total);
  }

  getNote() {
    return this.note;
  }

  getAddress() {
    return this.address;
  }

  getPhone() {
    return this.phone;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getFormattedCreatedAt() {
    if (!this.createdAt) return "";
    return new Date(this.createdAt).toLocaleString("vi-VN");
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  getFormattedUpdatedAt() {
    if (!this.updatedAt) return "";
    return new Date(this.updatedAt).toLocaleString("vi-VN");
  }

  // Setters
  setUserId(user_id) {
    this.user_id = user_id;
  }

  setStatus(status) {
    if (status in Order.STATUS_TEXT) {
      this.status = status;
      this.updatedAt = new Date().toISOString();
    } else {
      throw new Error("Invalid status value");
    }
  }

  setTotal(total) {
    this.total = parseFloat(total) || 0;
  }

  setNote(note) {
    this.note = note;
  }

  setAddress(address) {
    this.address = address;
  }

  setPhone(phone) {
    this.phone = phone;
  }

  setUpdatedAt(time) {
    this.updatedAt = time;
  }

  // Phương thức kiểm tra trạng thái
  isPending() {
    return this.status === Order.STATUS.PENDING;
  }

  isPreparing() {
    return this.status === Order.STATUS.PREPARING;
  }

  isShipping() {
    return this.status === Order.STATUS.SHIPPING;
  }

  isDelivered() {
    return this.status === Order.STATUS.DELIVERED;
  }

  isCancelled() {
    return this.status === Order.STATUS.CANCELLED;
  }

  isReturned() {
    return this.status === Order.STATUS.RETURNED;
  }

  // Phương thức chuyển đổi trạng thái
  markAsPreparing() {
    if (this.isPending()) {
      this.setStatus(Order.STATUS.PREPARING);
      return true;
    }
    return false;
  }

  markAsShipping() {
    if (this.isPreparing()) {
      this.setStatus(Order.STATUS.SHIPPING);
      return true;
    }
    return false;
  }

  markAsDelivered() {
    if (this.isShipping()) {
      this.setStatus(Order.STATUS.DELIVERED);
      return true;
    }
    return false;
  }

  markAsCancelled() {
    if (this.isPending() || this.isPreparing()) {
      this.setStatus(Order.STATUS.CANCELLED);
      return true;
    }
    return false;
  }

  markAsReturned() {
    if (this.isDelivered()) {
      this.setStatus(Order.STATUS.RETURNED);
      return true;
    }
    return false;
  }

  // Phương thức kiểm tra có thể thay đổi trạng thái hay không
  canUpdateStatus(newStatus) {
    switch (newStatus) {
      case Order.STATUS.PREPARING:
        return this.isPending();
      case Order.STATUS.SHIPPING:
        return this.isPreparing();
      case Order.STATUS.DELIVERED:
        return this.isShipping();
      case Order.STATUS.CANCELLED:
        return this.isPending() || this.isPreparing();
      case Order.STATUS.RETURNED:
        return this.isDelivered();
      default:
        return false;
    }
  }

  // Static methods for CRUD
  static add(list, order) {
    list.push(order);
    return list;
  }

  static remove(list, id) {
    return list.filter((order) => order.id !== id);
  }

  static update(list, id, newData) {
    return list.map((order) => {
      if (order.id === id) {
        Object.assign(order, newData);
        order.updatedAt = new Date().toISOString();
      }
      return order;
    });
  }

  // Phương thức lấy danh sách đơn hàng theo trạng thái
  static getByStatus(list, status) {
    return list.filter((order) => order.status === status);
  }

  // Phương thức lấy danh sách đơn hàng theo user
  static getByUserId(list, userId) {
    return list.filter((order) => order.user_id === userId);
  }

  // Phương thức format thành object để gửi API
  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      status: this.status,
      total: this.total,
      note: this.note,
      address: this.address,
      phone: this.phone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Phương thức validate dữ liệu
  validate() {
    const errors = [];

    if (!this.user_id) {
      errors.push("User ID là bắt buộc");
    }

    if (!this.address || this.address.trim() === "") {
      errors.push("Địa chỉ giao hàng là bắt buộc");
    }

    if (!this.phone || this.phone.trim() === "") {
      errors.push("Số điện thoại là bắt buộc");
    }

    if (this.total <= 0) {
      errors.push("Tổng tiền phải lớn hơn 0");
    }

    return errors;
  }
}

export default Order;
