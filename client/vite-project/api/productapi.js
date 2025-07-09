import Product from "../models/productmodel";

class ProductAPI {
  static baseUrl = "http://localhost:3001/api/products";

  static async getAll() {
    try {
      const res = await fetch(this.baseUrl);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Raw response from getAll:", data);

      // Kiểm tra cấu trúc response
      const products = data.data || data.products || data;
      if (!Array.isArray(products)) {
        console.error("Expected array but got:", products);
        return [];
      }

      // Chuyển thành instance Product
      return products.map(
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
      );
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
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
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
