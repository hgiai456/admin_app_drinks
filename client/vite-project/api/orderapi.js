// api/orderapi.js
import Order from "../models/ordermodel";

class OrderAPI {
  static baseUrl = "http://localhost:3001/api/orders";

  // Lấy tất cả đơn hàng
  static async getAll() {
    try {
      const res = await fetch(this.baseUrl);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Raw response from getAll orders:", data);

      // Kiểm tra cấu trúc response
      const orders = data.data || data.orders || data;
      if (!Array.isArray(orders)) {
        console.error("Expected array but got:", orders);
        return [];
      }

      // Chuyển thành instance Order
      return orders.map(
        (o) =>
          new Order(
            o.id,
            o.user_id,
            o.status,
            o.total,
            o.note,
            o.address,
            o.phone,
            o.createdAt,
            o.updatedAt
          )
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  // Lấy đơn hàng theo ID
  static async getById(id) {
    try {
      const res = await fetch(`${this.baseUrl}/${id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Raw response from getById order:", data);

      const o = data.data || data.order || data;
      return new Order(
        o.id,
        o.user_id,
        o.status,
        o.total,
        o.note,
        o.address,
        o.phone,
        o.createdAt,
        o.updatedAt
      );
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }

  // Lấy đơn hàng theo User ID
  static async getByUserId(userId) {
    try {
      const res = await fetch(`${this.baseUrl}?user_id=${userId}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Raw response from getByUserId orders:", data);

      const orders = data.data || data.orders || data;
      if (!Array.isArray(orders)) {
        console.error("Expected array but got:", orders);
        return [];
      }

      return orders.map(
        (o) =>
          new Order(
            o.id,
            o.user_id,
            o.status,
            o.total,
            o.note,
            o.address,
            o.phone,
            o.createdAt,
            o.updatedAt
          )
      );
    } catch (error) {
      console.error("Error fetching orders by user:", error);
      throw error;
    }
  }

  // Lấy đơn hàng theo trạng thái
  static async getByStatus(status) {
    try {
      const res = await fetch(`${this.baseUrl}?status=${status}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Raw response from getByStatus orders:", data);

      const orders = data.data || data.orders || data;
      if (!Array.isArray(orders)) {
        console.error("Expected array but got:", orders);
        return [];
      }

      return orders.map(
        (o) =>
          new Order(
            o.id,
            o.user_id,
            o.status,
            o.total,
            o.note,
            o.address,
            o.phone,
            o.createdAt,
            o.updatedAt
          )
      );
    } catch (error) {
      console.error("Error fetching orders by status:", error);
      throw error;
    }
  }

  // Cập nhật đơn hàng
  static async update(id, orderData) {
    try {
      console.log("Updating order ID:", id, "with data:", orderData);

      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      console.log("Update order response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Update order error response:", errorText);
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorText}`
        );
      }

      const data = await res.json();
      console.log("Raw response from update order:", data);

      // Một số API chỉ trả về success message, không trả về order object
      if (data.success || data.message) {
        // Nếu chỉ trả về success, fetch lại order
        return await this.getById(id);
      }

      const o = data.data || data.order || data;
      if (!o.id) {
        // Nếu không có ID trong response, fetch lại order
        return await this.getById(id);
      }

      return new Order(
        o.id,
        o.user_id,
        o.status,
        o.total,
        o.note,
        o.address,
        o.phone,
        o.createdAt,
        o.updatedAt
      );
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  }

  // Cập nhật trạng thái đơn hàng
  static async updateStatus(id, newStatus) {
    try {
      // Đổi PATCH thành PUT, đổi endpoint
      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorText}`
        );
      }
      const data = await res.json();
      return await this.getById(id);
    } catch (error) {
      throw error;
    }
  }

  // Xóa đơn hàng
  static async delete(id) {
    try {
      console.log("Deleting order ID:", id);

      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
      });

      console.log("Delete order response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Delete order error response:", errorText);
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorText}`
        );
      }

      const data = await res.json();
      console.log("Raw response from delete order:", data);

      return data.data || data;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  }

  // Thống kê đơn hàng theo trạng thái
  static async getStatistics() {
    try {
      const res = await fetch(`${this.baseUrl}/statistics`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Raw response from getStatistics:", data);

      return data.data || data;
    } catch (error) {
      console.error("Error fetching order statistics:", error);
      throw error;
    }
  }
}

export default OrderAPI;
