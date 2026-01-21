import { useEffect, useState } from "react";
import BannerDetailService from "@services/bannerdetail.service.js";
import BannerDetail from "@models/bannerdetail";

function BannerDetailComponent() {
  const [details, setDetails] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    banner_id: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    const data = await BannerDetailService.getAll();
    setDetails(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const detailObj = new BannerDetail(
      editingId || undefined,
      Number(form.product_id),
      Number(form.banner_id),
    );
    if (editingId) {
      await BannerDetailService.update(editingId, detailObj);
    } else {
      await BannerDetailService.create(detailObj);
    }
    setForm({ product_id: "", banner_id: "" });
    setEditingId(null);
    fetchDetails();
  };

  const handleDelete = async (id) => {
    await BannerDetailService.delete(id);
    fetchDetails();
  };

  const handleEdit = (detail) => {
    setForm({
      product_id: detail.getProductId(),
      banner_id: detail.getBannerId(),
    });
    setEditingId(detail.getId());
  };

  const handleCancel = () => {
    setForm({ product_id: "", banner_id: "" });
    setEditingId(null);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <h2>Quản lý Banner Detail</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="product_id"
          placeholder="Product ID"
          value={form.product_id}
          onChange={handleChange}
          required
        />
        <input
          name="banner_id"
          placeholder="Banner ID"
          value={form.banner_id}
          onChange={handleChange}
          required
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
            <th>Product ID</th>
            <th>Banner ID</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {details.map((detail) => (
            <tr key={detail.getId()}>
              <td>{detail.getId()}</td>
              <td>{detail.getProductId()}</td>
              <td>{detail.getBannerId()}</td>
              <td>
                <button onClick={() => handleEdit(detail)}>Sửa</button>
                <button onClick={() => handleDelete(detail.getId())}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BannerDetailComponent;
