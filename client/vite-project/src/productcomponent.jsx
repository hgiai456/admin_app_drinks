import { useEffect, useState } from "react";
import ProductAPI from "../api/productapi";

function ProductComponent() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    brand_id: 0,
    category_id: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = async (pageNum = 1) => {
    try {
      const data = await ProductAPI.getPaging({ page: pageNum });
      setProducts(data.data);
      setTotalPage(data.totalPage || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Tên sản phẩm là bắt buộc!");
      return;
    }
    const productData = {
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      brand_id: Number(form.brand_id),
      category_id: Number(form.category_id),
    };
    try {
      if (editingId) {
        await ProductAPI.update(editingId, productData);
      } else {
        await ProductAPI.create(productData);
      }
      setForm({
        name: "",
        description: "",
        image: "",
        brand_id: 0,
        category_id: 0,
      });
      setEditingId(null);
      await fetchProducts();
      alert(editingId ? "Cập nhật thành công!" : "Tạo sản phẩm thành công!");
    } catch (error) {
      alert("Có lỗi xảy ra: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      return;
    }
    try {
      await ProductAPI.delete(id);
      fetchProducts();
      alert("Xóa thành công!");
    } catch (error) {
      alert("Có lỗi xảy ra khi xóa sản phẩm: " + error.message);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      image: product.image || "",
      brand_id: product.brand_id,
      category_id: product.category_id,
    });
    setEditingId(product.id);
  };

  const handleCancel = () => {
    setForm({
      name: "",
      description: "",
      image: "",
      brand_id: 0,
      category_id: 0,
    });
    setEditingId(null);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <h2>Quản lý sản phẩm</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 10 }}>
          <input
            name="name"
            placeholder="Tên sản phẩm"
            value={form.name}
            onChange={handleChange}
            required
            style={{ marginRight: 10, padding: 8, width: 200 }}
          />
          <input
            name="description"
            placeholder="Mô tả"
            value={form.description}
            onChange={handleChange}
            style={{ marginRight: 10, padding: 8, width: 300 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <input
            name="image"
            placeholder="Link hình ảnh"
            value={form.image}
            onChange={handleChange}
            style={{ marginRight: 10, padding: 8, width: 400 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <input
            name="brand_id"
            placeholder="Brand ID"
            value={form.brand_id}
            onChange={handleChange}
            type="number"
            style={{ marginRight: 10, padding: 8, width: 100 }}
          />
          <input
            name="category_id"
            placeholder="Category ID"
            value={form.category_id}
            onChange={handleChange}
            type="number"
            style={{ marginRight: 10, padding: 8, width: 100 }}
          />
        </div>
        <button type="submit" style={{ marginRight: 10, padding: 8 }}>
          {editingId ? "Cập nhật" : "Thêm mới"}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancel} style={{ padding: 8 }}>
            Hủy
          </button>
        )}
      </form>
      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Mô tả</th>
            <th>Hình ảnh</th>
            <th>Brand ID</th>
            <th>Category ID</th>
            <th>Ngày tạo</th>
            <th>Ngày cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td
                style={{
                  maxWidth: 200,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {product.description}
              </td>
              <td>
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    width={60}
                    height={60}
                    style={{ objectFit: "cover" }}
                  />
                )}
              </td>
              <td>{product.brand_id}</td>
              <td>{product.category_id}</td>
              <td>
                {product.createdAt
                  ? new Date(product.createdAt).toLocaleDateString("vi-VN")
                  : "-"}
              </td>
              <td>
                {product.updatedAt
                  ? new Date(product.updatedAt).toLocaleDateString("vi-VN")
                  : "-"}
              </td>
              <td>
                <button
                  onClick={() => handleEdit(product)}
                  style={{ marginRight: 5, padding: 5 }}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  style={{ padding: 5 }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Phân trang */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          marginTop: 16,
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Trang trước
        </button>
        <span>
          Trang {page} / {totalPage}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
          disabled={page === totalPage}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}

export default ProductComponent;
