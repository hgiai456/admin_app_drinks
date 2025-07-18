import Product from "../models/productmodel";

class ProductAPI {
  static baseUrl = "http://localhost:3003/api/products";

  static getAuthHeader() {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: "Bearer " + token } : {};
  }

  static async getAll({ page = 1 } = {}) {
    try {
      // Gọi API với tham số page
      const res = await fetch(`${this.baseUrl}?page=${page}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Raw response from getAll:", data);

      // Lấy mảng sản phẩm và thông tin phân trang
      const productsArr = data.products || data.data || [];
      const currentPage = data.currentPage || 1;
      const totalPage = data.totalPage || 1;

      // Chuyển thành instance Product
      const products = Array.isArray(productsArr)
        ? productsArr.map(
            (p) =>
              new Product(
                p.id,
                p.name,
                p.description,
                p.image,
                p.brand_id,
                p.category_id,
                p.createdAt,
                p.updatedAt
              )
          )
        : [];

      // Trả về đúng cấu trúc cho component
      return {
        products,
        currentPage,
        totalPage,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const res = await fetch(`${this.baseUrl}/${id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Raw response from getById:", data);

      const p = data.data || data.product || data;
      return new Product(
        p.id,
        p.name,
        p.description,
        p.image,
        p.brand_id,
        p.category_id,
        p.createdAt,
        p.updatedAt
      );
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  static async create(productData) {
    try {
      console.log("Creating product with data:", productData);
      const res = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
        body: JSON.stringify(productData),
      });

      console.log("Create response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Create error response:", errorText);
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorText}`
        );
      }

      const data = await res.json();
      console.log("Raw response from create:", data);

      const p = data.data || data.product || data;
      return new Product(
        p.id,
        p.name,
        p.description,
        p.image,
        p.brand_id,
        p.category_id,
        p.createdAt,
        p.updatedAt
      );
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  static async update(id, productData) {
    try {
      console.log("Updating product ID:", id, "with data:", productData);

      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
        body: JSON.stringify(productData),
      });

      console.log("Update response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Update error response:", errorText);
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorText}`
        );
      }

      const data = await res.json();
      console.log("Raw response from update:", data);

      // Một số API chỉ trả về success message, không trả về product object
      if (data.success || data.message) {
        // Nếu chỉ trả về success, fetch lại product
        return await this.getById(id);
      }

      const p = data.data || data.product || data;
      if (!p.id) {
        // Nếu không có ID trong response, fetch lại product
        return await this.getById(id);
      }

      return new Product(
        p.id,
        p.name,
        p.description,
        p.image,
        p.brand_id,
        p.category_id,
        p.createdAt,
        p.updatedAt
      );
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      console.log("Deleting product ID:", id);

      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeader(),
      });

      console.log("Delete response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Delete error response:", errorText);
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorText}`
        );
      }

      const data = await res.json();
      console.log("Raw response from delete:", data);

      return data.data || data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
}

export default ProductAPI;
