import ProDetail from "@models/prodetail.js";
import BaseService from "./base.service";
import api from "../index.js";
import { ENDPOINTS } from "../endpoints.js";
// ProdetailAPI.js
class ProDetailService extends BaseService {
  constructor() {
    super(ENDPOINTS.PRODETAILS.BASE);
  }

  async getAll() {
    try {
      const response = await api.get(this.endpoint);

      const data = response.data;
      const prodetails = data.data || data.prodetails || data || [];

      return Array.isArray(prodetails)
        ? prodetails.map((item) =>
            ProDetail?.fromApiResponse ? ProDetail.fromApiResponse(item) : item,
          )
        : [];
    } catch (error) {
      console.error("❌ Lỗi ProDetails getAll:", error);
      throw new Error(
        "Lỗi khi tải danh sách chi tiết sản phẩm: " + error.message,
      );
    }
  }

  async getPaging({ page = 1, search = "", limit = 10 } = {}) {
    try {
      console.log(
        `🔗 ProDetails getPaging - page: ${page}, search: "${search}"`,
      );

      const params = { page, search, limit };
      const response = await api.get(this.endpoint, { params });

      console.log("📊 ProDetails getPaging response:", response.data);

      const data = response.data;

      return {
        data: data.data || [],
        totalPage: data.totalPage || 1,
        currentPage: data.currentPage || page,
        totalProDetails: data.totalProDetails || 0,
      };
    } catch (error) {
      console.error("❌ Lỗi ProDetails getPaging:", error);
      throw new Error(
        "Lỗi khi tải chi tiết sản phẩm phân trang: " + error.message,
      );
    }
  }

  // ===== GET PRODUCT DETAIL BY SIZE AND PRODUCT =====
  async getProductDetailBySizeAndProduct(productId, sizeId) {
    try {
      console.log("🔗 ProDetails getProductDetailBySizeAndProduct:", {
        productId,
        sizeId,
      });

      const response = await api.get(
        `${ENDPOINTS.PRODETAILS.FIND}?product_id=${productId}&size_id=${sizeId}`,
      );
      const data = response.data;

      console.log("✅ ProDetails by Size & Product response:", data);

      const prodetailResponse = data.data || data.prodetail || data;

      return ProDetail?.fromApiResponse
        ? ProDetail.fromApiResponse(prodetailResponse)
        : prodetailResponse;
    } catch (error) {
      console.error(
        "❌ Lỗi ProDetails getProductDetailBySizeAndProduct:",
        error,
      );
      throw new Error(
        "Lỗi khi tải chi tiết sản phẩm theo size và product: " + error.message,
      );
    }
  }

  async getProductDetailsByProductId(productId) {
    try {
      const response = await api.get(
        `${this.endpoint}/by-product?product_id=${productId}`,
      );
      const data = response.data;

      const prodetails = data.data || data.prodetails || data || [];

      return Array.isArray(prodetails)
        ? prodetails.map((item) =>
            ProDetail?.fromApiResponse ? ProDetail.fromApiResponse(item) : item,
          )
        : [];
    } catch (error) {
      console.error("❌ Lỗi ProDetails getProductDetailsByProductId:", error);
      throw new Error(
        "Lỗi khi tải chi tiết sản phẩm theo product_id: " + error.message,
      );
    }
  }
  async getAllProductDetails(productId) {
    try {
      const res = await api.get(
        `${ENDPOINTS.PRODETAILS.BASE}?product_id=${productId}`,
      );

      const data = res.data;
      return ProDetail.fromApiResponse(data);
    } catch (error) {
      console.error("❌ Lỗi ProDetails getAllProductDetails:", error);
      throw new Error("Lỗi khi tải tất cả chi tiết sản phẩm: " + error.message);
    }
  }
}

export default new ProDetailService();

// import ProDetail from "@models/Prodetail.js";
// import BaseService from "./base.service";
// import api from "../index.js";
// import { ENDPOINTS } from "../endpoints.js";
// // ProdetailAPI.js
// class ProDetailService extends BaseService {
//   constructor() {
//     super(ENDPOINTS.PRODETAILS.BASE);
//   }

// }
