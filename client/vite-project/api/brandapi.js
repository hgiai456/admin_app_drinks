class BrandAPI {
  static baseUrl = "http://localhost:3001/api/brands";

  static async getAll() {
    const res = await fetch(this.baseUrl);
    const data = await res.json();
    return data.data;
  }

  static async getById(id) {
    const res = await fetch(`${this.baseUrl}/${id}`);
    const data = await res.json();
    return data.data;
  }

  static async create(brand) {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(brand),
    });
    const data = await res.json();
    return data.data;
  }

  static async update(id, brand) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(brand),
    });
    const data = await res.json();
    return data.data;
  }

  static async delete(id) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    return data.data;
  }
}

export default BrandAPI;
