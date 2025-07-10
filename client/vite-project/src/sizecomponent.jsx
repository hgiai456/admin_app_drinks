import { useEffect, useState } from "react";
import SizeAPI from "../api/sizeapi";
import Size from "../models/sizemodel";

function SizeComponent() {
  const [sizes, setSizes] = useState([]);
  const [form, setForm] = useState({
    name: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSizes();
  }, []);

  const fetchSizes = async () => {
    try {
      const data = await SizeAPI.getAll();
      setSizes(data);
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!form.name.trim()) {
      alert("Tên size là bắt buộc!");
      return;
    }

    // Tạo plain object
    const sizeData = {
      name: form.name.trim(),
    };

    console.log("Submitting data:", sizeData);
    console.log("Editing ID:", editingId);

    try {
      let result;
      if (editingId) {
        console.log("Updating size with data:", sizeData);
        result = await SizeAPI.update(editingId, sizeData);
        console.log("Update result:", result);
      } else {
        console.log("Creating new size with data:", sizeData);
        result = await SizeAPI.create(sizeData);
        console.log("Create result:", result);
      }

      // Reset form
      setForm({
        name: "",
      });
      setEditingId(null);

      // Reload sizes
      await fetchSizes();

      alert(editingId ? "Cập nhật thành công!" : "Tạo size thành công!");
    } catch (error) {
      console.error("Detailed error:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);

      // Hiển thị lỗi chi tiết hơn
      let errorMessage =
        "Có lỗi xảy ra khi " + (editingId ? "cập nhật" : "tạo") + " size";
      if (error.message.includes("400")) {
        errorMessage += "\nLỗi: Dữ liệu không hợp lệ";
      } else if (error.message.includes("404")) {
        errorMessage += "\nLỗi: Không tìm thấy size";
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
    if (!confirm("Bạn có chắc chắn muốn xóa size này?")) {
      return;
    }

    try {
      await SizeAPI.delete(id);
      fetchSizes();
      alert("Xóa thành công!");
    } catch (error) {
      console.error("Error deleting size:", error);
      alert("Có lỗi xảy ra khi xóa size: " + error.message);
    }
  };

  const handleEdit = (size) => {
    console.log("Editing size:", size);
    setForm({
      name: size.getName(),
    });
    setEditingId(size.getId());
    console.log("Form after edit:", form);
    console.log("Editing ID set to:", size.getId());
  };

  const handleCancel = () => {
    setForm({
      name: "",
    });
    setEditingId(null);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h2>Quản lý Size</h2>

      {/* Debug info */}
      <div style={{ background: "#f0f0f0", padding: 10, marginBottom: 20 }}>
        <strong>Debug Info:</strong>
        <p>Editing ID: {editingId}</p>
        <p>Form data: {JSON.stringify(form, null, 2)}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 10 }}>
          <input
            name="name"
            placeholder="Tên size (VD: S, M, L, XL, 38, 39, 40...)"
            value={form.name}
            onChange={handleChange}
            required
            style={{ padding: 8, width: 300, marginRight: 10 }}
          />
          <button type="submit" style={{ padding: 8, marginRight: 10 }}>
            {editingId ? "Cập nhật" : "Thêm mới"}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} style={{ padding: 8 }}>
              Hủy
            </button>
          )}
        </div>
      </form>

      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th style={{ width: "10%" }}>ID</th>
            <th style={{ width: "30%" }}>Tên Size</th>
            <th style={{ width: "25%" }}>Ngày tạo</th>
            <th style={{ width: "25%" }}>Ngày cập nhật</th>
            <th style={{ width: "10%" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((size) => (
            <tr key={size.getId()}>
              <td style={{ textAlign: "center" }}>{size.getId()}</td>
              <td style={{ fontWeight: "bold" }}>{size.getName()}</td>
              <td>
                {size.getCreatedAt()
                  ? new Date(size.getCreatedAt()).toLocaleString("vi-VN")
                  : "-"}
              </td>
              <td>
                {size.getUpdatedAt()
                  ? new Date(size.getUpdatedAt()).toLocaleString("vi-VN")
                  : "-"}
              </td>
              <td style={{ textAlign: "center" }}>
                <button
                  onClick={() => handleEdit(size)}
                  style={{
                    marginRight: 5,
                    padding: 5,
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: 3,
                  }}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(size.getId())}
                  style={{
                    padding: 5,
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: 3,
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sizes.length === 0 && (
        <div style={{ textAlign: "center", padding: 20, color: "#666" }}>
          Chưa có size nào. Hãy thêm size mới!
        </div>
      )}
    </div>
  );
}

export default SizeComponent;
