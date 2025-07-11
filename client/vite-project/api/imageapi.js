const BASE_URL = "http://localhost:3001/api/images";

const ImageAPI = {
  // Upload ảnh lên Google Storage
  async uploadToGoogle(file) {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${BASE_URL}/google/upload`, {
      method: "POST",
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return await res.json();
  },
};

export default ImageAPI;
