import Brand from "@models/brand.js";
import BaseService from "./base.service";
import api from "../index.js";
import { ENDPOINTS } from "../endpoints.js";

class BrandService extends BaseService {
  constructor() {
    super(ENDPOINTS.BRANDS.BASE);
  }

  async getAll() {
    try {
      console.log("🔗 Đang gọi API Brands getAll:", `${this.endpoint}/all`);

      const response = await api.get(`${this.endpoint}`);

      console.log("✅ Response status:", response.status);
      console.log("✅ Response data:", response.data);

      const data = response.data;
      const brands = data.data || data.brands || data || [];

      return Array.isArray(brands)
        ? brands.map((item) =>
            Brand?.fromApiResponse ? Brand.fromApiResponse(item) : item
          )
        : [];
    } catch (error) {
      console.error("❌ Lỗi Brands getAll:", error);
      throw new Error("Lỗi khi tải danh sách thương hiệu: " + error.message);
    }
  }

  async getPaging({ page = 1, search = "" } = {}) {
    try {
      console.log(
        `🔗 Gọi API Brands getPaging - page: ${page}, search: "${search}"`
      );

      const params = { page, search };
      const response = await api.get(this.endpoint, { params });

      console.log("📊 Response status:", response.status);
      console.log("✅ Raw Brands Paging Data:", response.data);

      const data = response.data;

      return {
        data: data.data || [],
        pagination: {
          currentPage: data.currentPage || parseInt(page),
          totalPage: data.totalPage || 1,
          totalItems: data.totalBrands || data.totalItems || 0,
        },
      };
    } catch (error) {
      console.error("❌ Lỗi trong Brands getPaging:", error);
      throw new Error("Lỗi khi tải thương hiệu phân trang: " + error.message);
    }
  }

  // ✅ SỬA: Các methods còn lại cũng dùng axios
  async getById(id) {
    try {
      console.log("🔗 Đang tải thương hiệu:", id);

      const response = await api.get(`${this.endpoint}/${id}`);
      const data = response.data;

      console.log("✅ Brand getById data:", data);

      const brandResponse = data.data || data.brand || data;
      return Brand?.fromApiResponse
        ? Brand.fromApiResponse(brandResponse)
        : brandResponse;
    } catch (error) {
      console.error("❌ Lỗi trong getById Brand:", error);
      throw new Error("Lỗi khi tải thương hiệu: " + error.message);
    }
  }

  //   async getById(id) {
  //     try {
  //       console.log("🔗 Đang tải thương hiệu:", id);

  //       const res = await fetch(`${this.baseUrl}/${id}`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           ...this.getAuthHeader(),
  //         },
  //       });

  //       if (!res.ok) {
  //         const errorText = await res.text();
  //         console.error("❌ Lỗi getById Brand:", errorText);
  //         throw new Error(`HTTP ${res.status}: ${errorText}`);
  //       }

  //       const data = await res.json();
  //       console.log("✅ Brand getById data:", data);

  //       const brandResponse = data.data || data.brand || data;
  //       return Brand.fromApiResponse(brandResponse);
  //     } catch (error) {
  //       console.error("❌ Lỗi trong getById Brand:", error);
  //       throw new Error("Lỗi khi tải thương hiệu: " + error.message);
  //     }
  //   }

  //   async create(brandData) {
  //     try {
  //       console.log("🔗 Đang tạo thương hiệu:", brandData);

  //       // ✅ Nếu là Brand instance, sử dụng toApiFormat
  //       const payload =
  //         brandData instanceof Brand ? brandData.toApiFormat() : brandData;

  //       const res = await fetch(this.baseUrl, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           ...this.getAuthHeader(),
  //         },
  //         body: JSON.stringify(payload),
  //       });

  //       console.log("📊 Create Brand Status:", res.status);

  //       if (!res.ok) {
  //         const errorText = await res.text();
  //         console.error("❌ Lỗi tạo thương hiệu:", errorText);
  //         throw new Error(`HTTP ${res.status}: ${errorText}`);
  //       }

  //       const data = await res.json();
  //       console.log("✅ Raw Create Response:", data);

  //       // ✅ Convert response thành Brand instance
  //       const brandResponse = data.data || data.brand || data;
  //       return Brand.fromApiResponse(brandResponse);
  //     } catch (error) {
  //       console.error("❌ Lỗi trong create Brand:", error);
  //       throw error;
  //     }
  //   }

  //   static async update(id, brandData) {
  //     try {
  //       console.log("🔗 Đang cập nhật thương hiệu:", id, brandData);

  //       // ✅ Nếu là Brand instance, sử dụng toApiFormat
  //       const payload =
  //         brandData instanceof Brand ? brandData.toApiFormat() : brandData;

  //       const res = await fetch(`${this.baseUrl}/${id}`, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           ...this.getAuthHeader(),
  //         },
  //         body: JSON.stringify(payload),
  //       });

  //       console.log("📊 Update Brand Status:", res.status);

  //       if (!res.ok) {
  //         const errorText = await res.text();
  //         console.error("❌ Lỗi cập nhật thương hiệu:", errorText);
  //         throw new Error(`HTTP ${res.status}: ${errorText}`);
  //       }

  //       const data = await res.json();
  //       console.log("✅ Raw Update Response:", data);

  //       // ✅ Convert response thành Brand instance
  //       const brandResponse = data.data || data.brand || data;
  //       return Brand.fromApiResponse(brandResponse);
  //     } catch (error) {
  //       console.error("❌ Lỗi trong update Brand:", error);
  //       throw error;
  //     }
  //   }

  //   static async delete(id) {
  //     try {
  //       console.log("🔗 Đang xóa thương hiệu:", id);

  //       const res = await fetch(`${this.baseUrl}/${id}`, {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //           ...this.getAuthHeader(),
  //         },
  //       });

  //       console.log("📊 Delete Brand Status:", res.status);

  //       if (!res.ok) {
  //         const errorText = await res.text();
  //         console.error("❌ Lỗi xóa thương hiệu:", errorText);
  //         throw new Error(`HTTP ${res.status}: ${errorText}`);
  //       }

  //       const data = await res.json();
  //       console.log("✅ Thương hiệu đã xóa:", data);

  //       return data.data || data.brand || data;
  //     } catch (error) {
  //       console.error("❌ Lỗi trong delete Brand:", error);
  //       throw error;
  //     }
  //   }
}

export default new BrandService();
//Export instance
// export default BrandService;
//Export class
