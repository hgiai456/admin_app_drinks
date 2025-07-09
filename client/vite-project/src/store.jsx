import { useEffect, useState } from "react";
import StoreAPI from "../api/storeapi";

function Store() {
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({
    storeName: "",
    address: "",
    phoneNumber: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Lấy danh sách store khi load trang
  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    const data = await StoreAPI.getAll();
    setStores(data);
  };

  // Xử lý thay đổi form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Thêm hoặc sửa store
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await StoreAPI.update(editingId, form);
    } else {
      await StoreAPI.create(form);
    }
    setForm({ storeName: "", address: "", phoneNumber: "" });
    setEditingId(null);
    fetchStores();
  };

  // Xóa store
  const handleDelete = async (id) => {
    await StoreAPI.delete(id);
    fetchStores();
  };

  // Chọn store để sửa
  const handleEdit = (store) => {
    setForm({
      storeName: store.storeName,
      address: store.address,
      phoneNumber: store.phoneNumber || "",
    });
    setEditingId(store.id);
  };

  // Hủy sửa
  const handleCancel = () => {
    setForm({ storeName: "", address: "", phoneNumber: "" });
    setEditingId(null);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>Quản lý cửa hàng</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="storeName"
          placeholder="Tên cửa hàng"
          value={form.storeName}
          onChange={handleChange}
          required
        />
        <input
          name="address"
          placeholder="Địa chỉ"
          value={form.address}
          onChange={handleChange}
          required
        />
        <input
          name="phoneNumber"
          placeholder="Số điện thoại"
          value={form.phoneNumber}
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
            <th>Tên cửa hàng</th>
            <th>Địa chỉ</th>
            <th>SĐT</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td>{store.id}</td>
              <td>{store.storeName}</td>
              <td>{store.address}</td>
              <td>{store.phoneNumber}</td>
              <td>
                <button onClick={() => handleEdit(store)}>Sửa</button>
                <button onClick={() => handleDelete(store.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Store;
