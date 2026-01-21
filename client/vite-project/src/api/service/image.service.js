const BASE_URL = "https://api.hgcoffee.id.vn/api/images";

const ImageService = {
  getAuthHeader() {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: "Bearer " + token } : {};
  },
  // Upload ảnh lên Google Storage
  async uploadToGoogle(file) {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${BASE_URL}/google/upload`, {
      method: "POST",
      headers: {
        ...this.getAuthHeader(),
      },
      body: formData,
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return await res.json(); // { message, file }
  },

  // Xóa ảnh (local hoặc Google)
  async deleteImage(url) {
    const res = await fetch(`${BASE_URL}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return await res.json();
  },
};

export default ImageService;
