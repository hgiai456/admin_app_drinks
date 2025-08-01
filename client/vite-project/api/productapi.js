// ProductAPI.js
class ProductAPI {
<<<<<<< HEAD
    static baseUrl = 'http://localhost:3001/api/products';

    static async getAll({ page = 1 } = {}) {
        try {
            // Gọi API với tham số page
            const res = await fetch(`${this.baseUrl}?page=${page}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            console.log('Raw response from getAll:', data);

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
                totalPage
            };
        } catch (error) {
            throw new Error('Lỗi khi tải danh sách sản phẩm: ' + error.message);
        }
=======
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
>>>>>>> 19f6268ca7ab059e3bbf85f413738b30d61d2e5b
    }

    static async getById(id) {
        try {
            const res = await fetch(`${this.baseUrl}/${id}`);
            const data = await res.json();
            return data.data;
        } catch (error) {
            throw new Error('Lỗi khi tải sản phẩm: ' + error.message);
        }
    }

<<<<<<< HEAD
    static async create(product) {
        try {
            const res = await fetch(this.baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Lỗi thêm mới sản phẩm');
            }
            return data.data;
        } catch (error) {
            throw new Error('Lỗi khi thêm sản phẩm: ' + error.message);
        }
=======
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
>>>>>>> 19f6268ca7ab059e3bbf85f413738b30d61d2e5b
    }

<<<<<<< HEAD
    static async update(id, product) {
        try {
            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Lỗi cập nhật sản phẩm');
            }
            return data.data;
        } catch (error) {
            throw new Error('Lỗi khi cập nhật sản phẩm: ' + error.message);
        }
=======
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
>>>>>>> 19f6268ca7ab059e3bbf85f413738b30d61d2e5b
    }

<<<<<<< HEAD
    static async delete(id) {
        try {
            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Lỗi xóa sản phẩm');
            }
            return data.data;
        } catch (error) {
            throw new Error('Lỗi khi xóa sản phẩm: ' + error.message);
        }
=======
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
>>>>>>> 19f6268ca7ab059e3bbf85f413738b30d61d2e5b
    }

    static async getPaging({ page = 1, search = '' } = {}) {
        try {
            const url = `${this.baseUrl}?search=${encodeURIComponent(
                search
            )}&page=${page}`;
            const res = await fetch(url);
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Lỗi lấy danh sách sản phẩm');
            }
            return data;
        } catch (error) {
            throw new Error(
                'Lỗi khi tải danh sách sản phẩm có phân trang: ' + error.message
            );
        }
    }
}

export default ProductAPI;
