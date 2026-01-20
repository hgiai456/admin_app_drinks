import BaseService from "./base.service.js";
import api from "../index.js";
import { ENDPOINTS } from "../endpoints.js";

class OrderService extends BaseService {
  constructor() {
    super(ENDPOINTS.ORDERS.BASE);
  }

  async getAll(page = 1) {
    try {
      const response = await api.get(`${this.endpoint}/all`, {
        params: { page },
      });

      console.log("📊 Orders response:", response.data);

      const data = response.data;

      return {
        data: data.data || data.orders || [],
        currentPage: data.currentPage || page,
        totalPage: data.totalPage || 1,
        totalOrders: data.totalOrders || 0,
      };
    } catch (error) {
      console.error("❌ Lỗi getOrders:", error);
      throw new Error("Lỗi khi tải danh sách đơn hàng: " + error.message);
    }
  }

  async getOrders(page = 1) {
    try {
      console.log(`🔗 Orders getOrders - page: ${page}`);

      const response = await api.get(this.endpoint, {
        params: { page },
      });

      console.log("📊 Orders response:", response.data);

      const data = response.data;

      return {
        data: data.data || data.orders || [],
        currentPage: data.currentPage || page,
        totalPage: data.totalPage || 1,
        totalOrders: data.totalOrders || 0,
      };
    } catch (error) {
      console.error("❌ Lỗi getOrders:", error);
      throw new Error("Lỗi khi tải danh sách đơn hàng: " + error.message);
    }
  }

  async getOrderById(id) {
    try {
      console.log("🔗 Orders getOrderById:", id);

      const response = await api.get(`${this.endpoint}/${id}`);
      const data = response.data;

      console.log("✅ Order by ID:", data);

      return data.data || data.order || data;
    } catch (error) {
      console.error("❌ Lỗi getOrderById:", error);
      throw new Error("Lỗi khi tải đơn hàng: " + error.message);
    }
  }

  // =============================================
  // ✅ GIỮ NGUYÊN TÊN: getOrdersByUserId (thay vì getByUserId)
  // =============================================
  async getOrdersByUserId(userId, page = 1) {
    try {
      console.log("🔗 Orders getOrdersByUserId:", { userId, page });

      const response = await api.get(`${this.endpoint}/user/${userId}`, {
        params: { page },
      });
      const data = response.data;

      console.log("✅ Orders by UserId:", data);

      return {
        data: data.data || data.orders || [],
        pagination: {
          currentPage: data.currentPage || page,
          totalPage: data.totalPage || 1,
          totalOrders: data.totalOrders || 0,
        },
      };
    } catch (error) {
      console.error("❌ Lỗi getOrdersByUserId:", error);
      throw new Error("Lỗi khi tải đơn hàng của người dùng: " + error.message);
    }
  }

  async updateOrderStatus(id, status) {
    try {
      console.log("🔗 Orders updateOrderStatus:", { id, status });

      const response = await api.put(`${this.endpoint}/${id}`, { status });
      const data = response.data;

      console.log("✅ Order status updated:", data);

      return data.data || data.order || data;
    } catch (error) {
      console.error("❌ Lỗi updateOrderStatus:", error);
      throw new Error("Lỗi khi cập nhật trạng thái đơn hàng: " + error.message);
    }
  }
}

export default new OrderService();
