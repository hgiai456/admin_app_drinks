import BannerDetail from "../models/bannerdetailmodel";

class BannerDetailAPI {
  static baseUrl = "http://localhost:3003/api/banner-details";

  static getAuthHeader() {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: "Bearer " + token } : {};
  }

  static async getAll() {
    const res = await fetch(this.baseUrl);
    const data = await res.json();
    return data.data.map(
      (d) =>
        new BannerDetail(
          d.id,
          d.product_id,
          d.banner_id,
          d.createdAt,
          d.updatedAt
        )
    );
  }

  static async getById(id) {
    const res = await fetch(`${this.baseUrl}/${id}`);
    const data = await res.json();
    const d = data.data;
    return new BannerDetail(
      d.id,
      d.product_id,
      d.banner_id,
      d.createdAt,
      d.updatedAt
    );
  }

  static async create(bannerDetail) {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(bannerDetail),
    });
    const data = await res.json();
    const d = data.data;
    return new BannerDetail(
      d.id,
      d.product_id,
      d.banner_id,
      d.createdAt,
      d.updatedAt
    );
  }

  static async update(id, bannerDetail) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(bannerDetail),
    });
    const data = await res.json();
    const d = data.data;
    return new BannerDetail(
      d.id,
      d.product_id,
      d.banner_id,
      d.createdAt,
      d.updatedAt
    );
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

export default BannerDetailAPI;
