import { useEffect, useState } from "react";
import CategoryAPI from "../api/categoryApi";

function Category() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const data = await CategoryAPI.getAll();
    setCategories(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await CategoryAPI.update(editingId, form);
    } else {
      await CategoryAPI.create(form);
    }
    setForm({ name: "", image: "" });
    setEditingId(null);
    setShowDialog(false);
    fetchCategories();
  };

  const handleDelete = async (id) => {
    await CategoryAPI.delete(id);
    fetchCategories();
  };

  const handleEdit = (cat) => {
    setForm({
      name: cat.name,
      image: cat.image || "",
    });
    setEditingId(cat.id);
    setShowDialog(true);
  };

  const handleAddNew = () => {
    setForm({ name: "", image: "" });
    setEditingId(null);
    setShowDialog(true);
  };

  const handleCancel = () => {
    setForm({ name: "", image: "" });
    setEditingId(null);
    setShowDialog(false);
  };

  // Dialog styles
  const dialogOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: showDialog ? "flex" : "none",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const dialogStyle = {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "90%",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    marginBottom: "15px",
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
    marginTop: "10px",
  };

  const buttonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#007bff",
    color: "white",
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#6c757d",
    color: "white",
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>Quản lý danh mục</h2>
        <button
          onClick={handleAddNew}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          + Thêm danh mục mới
        </button>
      </div>

      {/* Dialog */}
      <div style={dialogOverlayStyle} onClick={handleCancel}>
        <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
          <h3 style={{ marginTop: 0, marginBottom: 20 }}>
            {editingId ? "Cập nhật danh mục" : "Thêm danh mục mới"}
          </h3>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Tên danh mục"
              value={form.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              name="image"
              placeholder="Link ảnh"
              value={form.image}
              onChange={handleChange}
              style={inputStyle}
            />
            <div style={buttonGroupStyle}>
              <button
                type="button"
                onClick={handleCancel}
                style={secondaryButtonStyle}
              >
                Hủy
              </button>
              <button type="submit" style={primaryButtonStyle}>
                {editingId ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>
                {cat.image && (
                  <img src={cat.image} alt={cat.name} width={40} height={40} />
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(cat)}>Sửa</button>
                <button onClick={() => handleDelete(cat.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Category;
