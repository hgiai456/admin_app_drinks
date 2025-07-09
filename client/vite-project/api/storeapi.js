class StoreAPI {
  static baseUrl = "http://localhost:3001/api/stores";

  // Lấy danh sách store
  static async getAll() {
    const res = await fetch(this.baseUrl);
    const data = await res.json();
    return data.data;
  }

  // Lấy 1 store theo id
  static async getById(id) {
    const res = await fetch(`${this.baseUrl}/${id}`);
    const data = await res.json();
    return data.data;
  }

  // Thêm mới store
  static async create(store) {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(store),
    });
    const data = await res.json();
    return data.data;
  }

  // Sửa store
  static async update(id, store) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(store),
    });
    const data = await res.json();
    return data.data;
  }

  // Xóa store
  static async delete(id) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    return data.data;
  }
}

export default StoreAPI;
