import Product from "@models/product.js";
import BaseService from "./base.service.js";
import api from "../index.js";
import { ENDPOINTS } from "../endpoints.js";

class ProductService extends BaseService {
  constructor() {
    super(ENDPOINTS.PRODUCTS.BASE);
  }

  async getAll() {
    try {
      const response = await api.get(this.endpoint);
      const data = response.data;

      const products = data.data || data.products || data || [];

      return Array.isArray(products)
        ? products.map((item) =>
            Product?.fromApiResponse ? Product.fromApiResponse(item) : item,
          )
        : [];
    } catch (error) {
      console.error("❌ Lỗi Products getAll:", error);
      throw new Error("Lỗi khi tải danh sách sản phẩm: " + error.message);
    }
  }

  async getAllProducts() {
    try {
      const response = await api.get(`${this.endpoint}/all`);
      const data = response.data;

      const products = data.data || data.products || data || [];

      return Array.isArray(products)
        ? products.map((item) =>
            Product?.fromApiResponse ? Product.fromApiResponse(item) : item,
          )
        : [];
    } catch (error) {
      console.error("❌ Lỗi Products getAllProducts:", error);
      throw new Error("Lỗi khi tải danh sách sản phẩm: " + error.message);
    }
  }

  async getPaging({ page = 1, search = "" } = {}) {
    try {
      console.log(
        `🔗 Gọi API Products getPaging - page: ${page}, search: "${search}"`,
      );

      const params = { page, search };
      const response = await api.get(this.endpoint, { params });

      const data = response.data;

      return {
        data: (data.data || []).map((item) =>
          Product?.fromApiResponse ? Product.fromApiResponse(item) : item,
        ),
        pagination: {
          currentPage: data.currentPage || parseInt(page),
          totalPage: data.totalPage || 1,
          totalItems: data.totalProducts || data.totalItems || 0,
          limit: Math.ceil((data.totalProducts || 0) / (data.totalPage || 1)),
        },
      };
    } catch (error) {
      console.error("❌ Lỗi trong Products getPaging:", error);
      throw new Error("Lỗi khi tải sản phẩm phân trang: " + error.message);
    }
  }

  async getByCategory(categoryId, params = {}) {
    try {
      const { page = 1, limit = 12, search = "" } = params;

      const queryParams = {
        category_id: categoryId,
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      };

      console.log(
        `🔗 Fetching products by category ${categoryId}:`,
        queryParams,
      );

      const response = await api.get(ENDPOINTS.PRODUCTS.BY_CATEGORY, {
        params: queryParams,
      });

      const result = response.data;
      console.log("✅ Products by category response:", result);

      return {
        data: (result.data || []).map((item) =>
          Product?.fromApiResponse ? Product.fromApiResponse(item) : item,
        ),
        totalProducts: result.totalProducts || 0,
        pagination: result.pagination || {
          currentPage: page,
          pageSize: limit,
          totalPage: Math.ceil((result.totalProducts || 0) / limit),
          totalProducts: result.totalProducts || 0,
        },
      };
    } catch (error) {
      console.error("❌ Error fetching products by category:", error);
      throw error;
    }
  }

  async getCustomizePage({ page = 1, search = "", pageSize = 4 } = {}) {
    //hàm này là hàm lấy response từ server (Sai format không là không lấy được dữ liệu)
    try {
      const params = { page, search, pageSize };
      const response = await api.get(ENDPOINTS.PRODUCTS.CUSTOMIZE_PAGE, {
        params,
      });

      const data = response.data;

      return {
        data: (data.data || []).map((item) =>
          Product?.fromApiResponse ? Product.fromApiResponse(item) : item,
        ),
        pagination: {
          currentPage: data.pagination.currentPage || parseInt(page),
          totalPage: data.pagination.totalPage || 1,
          totalProducts: data.pagination.totalProducts || 0,
          pageSize: data.pagination?.pageSize || pageSize,
          hasNextPage: data.pagination?.hasNextPage || false,
          hasPrevPage: data.pagination?.hasPrevPage || false,
        },
      };
    } catch (error) {
      console.error("❌ Error in getCustomizePage:", error);
      throw new Error("Lỗi khi tải sản phẩm: " + error.message);
    }
  }

  // ===== GET PRODUCT BY ID =====
  async getById(id) {
    try {
      console.log("🔗 Getting product by ID:", id);

      const response = await api.get(`${this.endpoint}/${id}`);
      const data = response.data;

      console.log("✅ Product by ID response:", data);

      const productResponse = data.data || data.product || data;

      return Product?.fromApiResponse
        ? Product.fromApiResponse(productResponse)
        : {
            id: productResponse.id,
            name: productResponse.name,
            description: productResponse.description,
            image: productResponse.image,
            sizes: productResponse.sizes || [],
            category_id: productResponse.category_id,
            brand_id: productResponse.brand_id,
            createdAt: productResponse.createdAt,
            updatedAt: productResponse.updatedAt,
          };
    } catch (error) {
      console.error("❌ Error getting product by ID:", error);
      throw new Error("Lỗi khi tải sản phẩm: " + error.message);
    }
  }

  // ===== CREATE PRODUCT =====
  async create(productData) {
    try {
      console.log("🔗 Đang tạo sản phẩm:", productData);

      const payload =
        productData instanceof Product
          ? productData.toApiFormat()
          : productData;

      const response = await api.post(this.endpoint, payload);
      const data = response.data;

      const productResponse = data.data || data.product || data;

      return Product?.fromApiResponse
        ? Product.fromApiResponse(productResponse)
        : productResponse;
    } catch (error) {
      console.error("❌ Lỗi trong create Product:", error);
      throw error;
    }
  }

  // ===== UPDATE PRODUCT =====
  async update(id, productData) {
    try {
      console.log("🔗 Đang cập nhật sản phẩm:", id, productData);

      // ✅ Nếu là Product instance, sử dụng toApiFormat
      const payload =
        productData instanceof Product
          ? productData.toApiFormat()
          : productData;

      const response = await api.put(`${this.endpoint}/${id}`, payload);
      const data = response.data;

      console.log("✅ Raw Update Response:", data);

      const productResponse = data.data || data.product || data;
      return Product?.fromApiResponse
        ? Product.fromApiResponse(productResponse)
        : productResponse;
    } catch (error) {
      console.error("❌ Lỗi trong update Product:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      console.log("🔗 Đang xóa sản phẩm:", id);

      const response = await api.delete(`${this.endpoint}/${id}`);
      const data = response.data;

      console.log("✅ Sản phẩm đã xóa:", data);

      return data.data || data.product || data;
    } catch (error) {
      console.error("❌ Lỗi trong delete Product:", error);
      throw error;
    }
  }
}

export default new ProductService();
