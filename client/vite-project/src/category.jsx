import { useEffect, useState } from "react";
import CategoryAPI from "../api/categoryApi";

function Category() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);

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
  };

  const handleCancel = () => {
    setForm({ name: "", image: "" });
    setEditingId(null);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>Quản lý danh mục</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="name"
          placeholder="Tên danh mục"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="image"
          placeholder="Link ảnh"
          value={form.image}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? "Cập nhật" : "Thêm mới"}</button>
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
