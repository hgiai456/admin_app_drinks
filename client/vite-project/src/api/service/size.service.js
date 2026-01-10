import Size from "@models/size.js";
import BaseService from "./base.service";
import api from "../index.js";
import { ENDPOINTS } from "../endpoints.js";

class SizeService extends BaseService {
  constructor() {
    super(ENDPOINTS.SIZES.BASE);
  }

  async getAll() {
    try {
      console.log("🔗 SizeService.getAll() - Endpoint:", this.endpoint);

      const response = await api.get(this.endpoint);

      console.log("✅ Raw response:", response);
      console.log("✅ Response data:", response.data);

      const data = response.data;

      // ✅ EXTRACT ARRAY từ response
      let sizes = [];

      if (Array.isArray(data)) {
        // Case 1: API trả về array trực tiếp
        sizes = data;
      } else if (data.data && Array.isArray(data.data)) {
        // Case 2: API trả về { data: [...] }
        sizes = data.data;
      } else if (data.sizes && Array.isArray(data.sizes)) {
        // Case 3: API trả về { sizes: [...] }
        sizes = data.sizes;
      } else {
        console.warn("⚠️ Unexpected response format:", data);
        sizes = [];
      }

      console.log(`✅ Extracted ${sizes.length} sizes:`, sizes);

      // ✅ Transform với Size.fromApiResponse
      return sizes.map((item) =>
        Size?.fromApiResponse ? Size.fromApiResponse(item) : item
      );
    } catch (error) {
      console.error("❌ Error in SizeService.getAll():", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error("Lỗi khi tải danh sách kích thước: " + error.message);
    }
  }

  async getPaging({ page = 1, search = "" } = {}) {
    try {
      console.log(
        `🔗 SizeService.getPaging() - page: ${page}, search: "${search}"`
      );

      const params = { page, search };
      const response = await api.get(this.endpoint, { params });

      console.log("✅ Paging response:", response.data);

      const data = response.data;

      // ✅ Extract data và pagination info
      const sizes = data.data || [];
      const pagination = {
        currentPage: data.currentPage || parseInt(page),
        totalPage: data.totalPage || 1,
        totalItems: data.totalSizes || data.totalItems || 0,
      };

      console.log(
        `✅ Extracted ${sizes.length} sizes with pagination:`,
        pagination
      );

      return {
        data: sizes.map((item) =>
          Size?.fromApiResponse ? Size.fromApiResponse(item) : item
        ),
        pagination: pagination,
      };
    } catch (error) {
      console.error("❌ Error in SizeService.getPaging():", error);
      throw new Error("Lỗi khi tải kích thước phân trang: " + error.message);
    }
  }

  async getById(id) {
    try {
      console.log("🔗 Đang tải kích thước:", id);

      const response = await api.get(`${this.endpoint}/${id}`);
      const data = response.data;

      const sizeResponse = data.data || data.size || data;
      return Size?.fromApiResponse
        ? Size.fromApiResponse(sizeResponse)
        : sizeResponse;
    } catch (error) {
      console.error("❌ Lỗi trong getById Size:", error);
      throw new Error("Lỗi khi tải kích thước: " + error.message);
    }
  }

  async create(sizeData) {
    try {
      console.log("🔗 Đang tạo kích thước:", sizeData);

      const payload =
        sizeData instanceof Size ? sizeData.toApiFormat() : sizeData;

      const response = await api.post(this.endpoint, payload);

      console.log("📊 Create Size Status:", response.status);
      console.log("✅ Raw Create Response:", response.data);

      const data = response.data;
      const sizeResponse = data.data || data.size || data;

      return Size?.fromApiResponse
        ? Size.fromApiResponse(sizeResponse)
        : sizeResponse;
    } catch (error) {
      console.error("❌ Lỗi trong create Size:", error);
      throw new Error("Lỗi khi tạo kích thước: " + error.message);
    }
  }

  async update(id, sizeData) {
    try {
      console.log("🔗 Đang cập nhật kích thước:", id, sizeData);

      const payload =
        sizeData instanceof Size ? sizeData.toApiFormat() : sizeData;

      const response = await api.put(`${this.endpoint}/${id}`, payload);

      const data = response.data;

      if (data.success || data.message) {
        console.log("⚠️ API chỉ trả success, fetch lại size...");
        return await this.getById(id);
      }

      const sizeResponse = data.data || data.size || data;

      if (!sizeResponse.id) {
        console.log("⚠️ Response không có ID, fetch lại size...");
        return await this.getById(id);
      }

      return Size?.fromApiResponse
        ? Size.fromApiResponse(sizeResponse)
        : sizeResponse;
    } catch (error) {
      console.error("❌ Lỗi trong update Size:", error);
      throw new Error("Lỗi khi cập nhật kích thước: " + error.message);
    }
  }

  async delete(id) {
    try {
      console.log("🔗 Đang xóa kích thước:", id);

      const response = await api.delete(`${this.endpoint}/${id}`);

      console.log("📊 Delete Size Status:", response.status);
      console.log("✅ Raw Delete Response:", response.data);

      const data = response.data;
      return data.data || data.size || data;
    } catch (error) {
      console.error("❌ Lỗi trong delete Size:", error);
      throw new Error("Lỗi khi xóa kích thước: " + error.message);
    }
  }
}

export default new SizeService();
