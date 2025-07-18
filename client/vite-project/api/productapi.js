// ProductAPI.js
class ProductAPI {
  static baseUrl = "http://localhost:3003/api/products";

  static getAuthHeader() {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: "Bearer " + token } : {};
  }

  static async getAll({ page = 1 } = {}) {
    try {
      const res = await fetch(this.baseUrl);
      const data = await res.json();
      return data.data;
    } catch (error) {
      throw new Error("Lỗi khi tải danh sách sản phẩm: " + error.message);
    }
  }

  static async getById(id) {
    try {
      const res = await fetch(`${this.baseUrl}/${id}`);
      const data = await res.json();
      return data.data;
    } catch (error) {
      throw new Error("Lỗi khi tải sản phẩm: " + error.message);
    }
  }

  static async create(product) {
    try {
      const res = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Lỗi thêm mới sản phẩm");
      }
      return data.data;
    } catch (error) {
      throw new Error("Lỗi khi thêm sản phẩm: " + error.message);
    }
  }

  static async update(id, product) {
    try {
      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Lỗi cập nhật sản phẩm");
      }
      return data.data;
    } catch (error) {
      throw new Error("Lỗi khi cập nhật sản phẩm: " + error.message);
    }
  }

  static async delete(id) {
    try {
      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeader(),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Lỗi xóa sản phẩm");
      }
      return data.data;
    } catch (error) {
      throw new Error("Lỗi khi xóa sản phẩm: " + error.message);
    }
  }

  static async getPaging({ page = 1, search = "" } = {}) {
    try {
      const url = `${this.baseUrl}?search=${encodeURIComponent(
        search
      )}&page=${page}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Lỗi lấy danh sách sản phẩm");
      }
      return data;
    } catch (error) {
      throw new Error(
        "Lỗi khi tải danh sách sản phẩm có phân trang: " + error.message
      );
    }
  }
}

export default ProductAPI;
