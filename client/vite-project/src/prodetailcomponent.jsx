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
  const [showDialog, setShowDialog] = useState(false);

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
    setShowDialog(false);
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
    setShowDialog(true);
  };

  const handleAddNew = () => {
    setForm({ name: "", price: "", oldprice: "", quantity: "" });
    setEditingId(null);
    setShowDialog(true);
  };

  const handleCancel = () => {
    setForm({ name: "", price: "", oldprice: "", quantity: "" });
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
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>Quản lý sản phẩm chi tiết</h2>
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
          + Thêm chi tiết mới
        </button>
      </div>

      {/* Dialog */}
      <div style={dialogOverlayStyle} onClick={handleCancel}>
        <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
          <h3 style={{ marginTop: 0, marginBottom: 20 }}>
            {editingId ? "Cập nhật chi tiết" : "Thêm chi tiết mới"}
          </h3>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Tên chi tiết"
              value={form.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              name="price"
              placeholder="Giá"
              value={form.price}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="oldprice"
              placeholder="Giá cũ"
              value={form.oldprice}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="quantity"
              placeholder="Số lượng"
              value={form.quantity}
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
