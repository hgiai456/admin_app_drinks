// ProdetailAPI.js
class ProdetailAPI {
  static baseUrl = "http://localhost:3001/api/prodetails";

  static getAuthHeader() {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: "Bearer " + token } : {};
  }

  static async getAll() {
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

  static async create(prodetail) {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(prodetail),
    });
    const data = await res.json();
    return data.data;
  }

  static async update(id, prodetail) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(prodetail),
    });
    const data = await res.json();
    return data.data;
  }

  static async delete(id) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeader(),
    });
    const data = await res.json();
    return data.data;
  }
}

export default ProdetailAPI;
