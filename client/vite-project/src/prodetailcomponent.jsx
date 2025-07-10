import { useEffect, useState } from "react";
// Adjust the import path as necessary
import ProdetailAPI from "../api/prodetails";

function ProdetailComponent() {
  const [prodetails, setProdetails] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    oldprice: "",
    quantity: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProdetails();
  }, []);

  const fetchProdetails = async () => {
    const data = await ProdetailAPI.getAll();
    setProdetails(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await ProdetailAPI.update(editingId, form);
    } else {
      await ProdetailAPI.create(form);
    }
    setForm({ name: "", price: "", oldprice: "", quantity: "" });
    setEditingId(null);
    fetchProdetails();
  };

  const handleDelete = async (id) => {
    await ProdetailAPI.delete(id);
    fetchProdetails();
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      price: item.price || "",
      oldprice: item.oldprice || "",
      quantity: item.quantity || "",
    });
    setEditingId(item.id);
  };

  const handleCancel = () => {
    setForm({ name: "", price: "", oldprice: "", quantity: "" });
    setEditingId(null);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h2>Quản lý sản phẩm chi tiết</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="name"
          placeholder="Tên chi tiết"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          placeholder="Giá"
          value={form.price}
          onChange={handleChange}
        />
        <input
          name="oldprice"
          placeholder="Giá cũ"
          value={form.oldprice}
          onChange={handleChange}
        />
        <input
          name="quantity"
          placeholder="Số lượng"
          value={form.quantity}
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
            <th>Tên</th>
            <th>Giá</th>
            <th>Giá cũ</th>
            <th>Số lượng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {prodetails.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.oldprice}</td>
              <td>{item.quantity}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Sửa</button>
                <button onClick={() => handleDelete(item.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProdetailComponent;
