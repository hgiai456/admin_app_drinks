import { useEffect, useState } from "react";
import UserAPI from "../api/userapi";
import User from "../models/usermodel";

function UserComponent() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    role: 0,
    avatar: "",
    phone: "",
    address: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await UserAPI.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!form.email || !form.name) {
      alert("Email và tên là bắt buộc!");
      return;
    }

    if (!editingId && !form.password) {
      alert("Password là bắt buộc khi tạo user mới!");
      return;
    }

    // Tạo plain object thay vì User instance
    const userData = {
      email: form.email.trim(),
      name: form.name.trim(),
      role: Number(form.role),
      avatar: form.avatar.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    };

    // Chỉ thêm password nếu có
    if (form.password) {
      userData.password = form.password;
    }

    console.log("Submitting data:", userData);
    console.log("Editing ID:", editingId);

    try {
      let result;
      if (editingId) {
        console.log("Updating user with data:", userData);
        result = await UserAPI.update(editingId, userData);
        console.log("Update result:", result);
      } else {
        console.log("Creating new user with data:", userData);
        result = await UserAPI.create(userData);
        console.log("Create result:", result);
      }

      // Reset form
      setForm({
        email: "",
        password: "",
        name: "",
        role: 0,
        avatar: "",
        phone: "",
        address: "",
      });
      setEditingId(null);

      // Reload users
      await fetchUsers();

      alert(editingId ? "Cập nhật thành công!" : "Tạo user thành công!");
    } catch (error) {
      console.error("Detailed error:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);

      // Hiển thị lỗi chi tiết hơn
      let errorMessage =
        "Có lỗi xảy ra khi " + (editingId ? "cập nhật" : "tạo") + " user";
      if (error.message.includes("400")) {
        errorMessage += "\nLỗi: Dữ liệu không hợp lệ";
      } else if (error.message.includes("404")) {
        errorMessage += "\nLỗi: Không tìm thấy user";
      } else if (error.message.includes("500")) {
        errorMessage += "\nLỗi: Lỗi server";
      } else if (error.message.includes("Cannot read properties")) {
        errorMessage += "\nLỗi: Cấu trúc response từ server không đúng";
      }
      errorMessage += "\nChi tiết: " + error.message;

      alert(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa user này?")) {
      return;
    }

    try {
      await UserAPI.delete(id);
      fetchUsers();
      alert("Xóa thành công!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Có lỗi xảy ra khi xóa user: " + error.message);
    }
  };

  const handleEdit = (user) => {
    console.log("Editing user:", user);
    setForm({
      email: user.getEmail(),
      password: "", // Không điền password khi edit
      name: user.getName(),
      role: user.getRole(),
      avatar: user.getAvatar() || "",
      phone: user.getPhone() || "",
      address: user.getAddress() || "",
    });
    setEditingId(user.getId());
    console.log("Form after edit:", form);
    console.log("Editing ID set to:", user.getId());
  };

  const handleCancel = () => {
    setForm({
      email: "",
      password: "",
      name: "",
      role: 0,
      avatar: "",
      phone: "",
      address: "",
    });
    setEditingId(null);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h2>Quản lý người dùng</h2>

      {/* Debug info */}
      <div style={{ background: "#f0f0f0", padding: 10, marginBottom: 20 }}>
        <strong>Debug Info:</strong>
        <p>Editing ID: {editingId}</p>
        <p>Form data: {JSON.stringify(form, null, 2)}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ marginRight: 10, marginBottom: 10 }}
        />
        <input
          name="password"
          placeholder="Mật khẩu"
          type="password"
          value={form.password}
          onChange={handleChange}
          required={!editingId}
          style={{ marginRight: 10, marginBottom: 10 }}
        />
        <input
          name="name"
          placeholder="Tên"
          value={form.name}
          onChange={handleChange}
          style={{ marginRight: 10, marginBottom: 10 }}
        />
        <input
          name="role"
          placeholder="Role"
          value={form.role}
          onChange={handleChange}
          type="number"
          style={{ marginRight: 10, marginBottom: 10 }}
        />
        <input
          name="avatar"
          placeholder="Link avatar"
          value={form.avatar}
          onChange={handleChange}
          style={{ marginRight: 10, marginBottom: 10 }}
        />
        <input
          name="phone"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={handleChange}
          style={{ marginRight: 10, marginBottom: 10 }}
        />
        <input
          name="address"
          placeholder="Địa chỉ"
          value={form.address}
          onChange={handleChange}
          style={{ marginRight: 10, marginBottom: 10 }}
        />
        <button type="submit" style={{ marginRight: 10 }}>
          {editingId ? "Cập nhật" : "Thêm mới"}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancel}>
            Hủy
          </button>
        )}
      </form>

      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Tên</th>
            <th>Role</th>
            <th>Avatar</th>
            <th>SĐT</th>
            <th>Địa chỉ</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.getId()}>
              <td>{user.getId()}</td>
              <td>{user.getEmail()}</td>
              <td>{user.getName()}</td>
              <td>{user.getRole()}</td>
              <td>
                {user.getAvatar() && (
                  <img
                    src={user.getAvatar()}
                    alt={user.getName()}
                    width={40}
                    height={40}
                  />
                )}
              </td>
              <td>{user.getPhone()}</td>
              <td>{user.getAddress()}</td>
              <td>
                <button
                  onClick={() => handleEdit(user)}
                  style={{ marginRight: 5 }}
                >
                  Sửa
                </button>
                <button onClick={() => handleDelete(user.getId())}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserComponent;
