// bannerApi.js
class BannerAPI {
  static baseUrl = "http://localhost:3001/api/banners";

  static async getAll() {
    try {
      const res = await fetch(this.baseUrl);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      return data.data || data; // Xử lý cả trường hợp API trả về trực tiếp array
    } catch (error) {
      console.error("Error fetching banners:", error);
      throw error;
    }
  }

  static async create(banner) {
    try {
      const res = await fetch(this.baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banner),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      console.error("Error creating banner:", error);
      throw error;
    }
  }

  static async update(id, banner) {
    try {
      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banner),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      console.error("Error updating banner:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      console.error("Error deleting banner:", error);
      throw error;
    }
  }
}

export { BannerAPI };
