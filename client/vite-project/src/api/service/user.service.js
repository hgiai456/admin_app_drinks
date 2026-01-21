import User from "@models/user";

class UserService {
  static baseUrl = "https://api.hgcoffee.id.vn/api/users";

  static getAuthHeader() {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: "Bearer " + token } : {};
  } //Lấy token khi đăng nhập thành công

  static async getAll() {
    try {
      const res = await fetch(this.baseUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Lỗi UserAPI - getAll:", errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();

      //Xử lý respondata
      const users = data.data || data.users || data || [];

      return Array.isArray(users)
        ? users.map((item) =>
            User && User.fromApiResponse
              ? User.fromApiResponse(item)
              : {
                  id: item.id,
                  email: item.id,
                  password: item.password,
                  name: item.name,
                  role: item.role,
                  avatar: item.avatar,
                  phone: item.phone,
                  address: item.address,
                  is_locked: item.is_locked,
                  password_changed: item.password_changed_ad,
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt,
                },
          )
        : [];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  static async getAllUsers() {
    try {
      const res = await fetch(`${this.baseUrl}/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Lỗi UserAPI - getAll:", errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();

      //Xử lý respondata
      const users = data.data || data.users || data || [];

      return Array.isArray(users) //Trả về 1 danh sách user
        ? users.map((item) =>
            User && User.fromApiResponse
              ? User.fromApiResponse(item)
              : {
                  id: item.id,
                  email: item.id,
                  password: item.password,
                  name: item.name,
                  role: item.role,
                  avatar: item.avatar,
                  phone: item.phone,
                  address: item.address,
                  is_locked: item.is_locked,
                  password_changed: item.password_changed_ad,
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt,
                },
          )
        : [];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  static async getPaging({ page = 1, search = "" } = {}) {
    try {
      const url = `${this.baseUrl}?search=${encodeURIComponent(
        search,
      )}&page=${page}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Lỗi từ server Users:", errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const response = {
        data: data.data || [],
        pagination: {
          currentPage: data.currentPage || parseInt(page),
          totalPage: data.totalPage || 1,
          totalItems: data.totalUsers || data.totalItems || 0, // ✅ FIX: totalProducts
          limit: Math.ceil((data.totalUsers || 0) / (data.totalPage || 1)),
        },
      };
      //Trả về data nguyên bảng để component xử lý

      return response;
    } catch (error) {
      console.error("❌ Lỗi trong Users getPaging:", error);
      throw error;
    }
  }
  static async getById(id) {
    try {
      const res = await fetch(`${this.baseUrl}/${id}`);
      const data = await res.json();
      return data.data;
    } catch (error) {
      throw new Error("Lỗi khi tải người dùng. " + error.message);
    }
  }

  static async create(userData) {
    try {
      console.log("Creating user with data:", userData);
      const payload =
        userData instanceof User ? userData.toApiFormat() : userData;

      // Sử dụng endpoint /api/users/register thay vì /api/users
      const res = await fetch("http://localhost:3003/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Create response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Create error response:", errorText);
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorText}`,
        );
      }

      const data = await res.json();
      console.log("Raw response from create:", data);

      const userResponse = data.data || data.user || data;
      return User.fromApiResponse(userResponse);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

export default UserService;
