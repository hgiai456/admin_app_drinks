import { useEffect, useState } from "react";
import ProductAPI from "../api/productapi";
import Product from "../models/productmodel";
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await ProductAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!form.name.trim()) {
      alert("Tên sản phẩm là bắt buộc!");
      return;
    }

    // Tạo plain object
    const productData = {
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      brand_id: Number(form.brand_id),
      category_id: Number(form.category_id),
    };

    console.log("Submitting data:", productData);
    console.log("Editing ID:", editingId);

    try {
      let result;
      if (editingId) {
        console.log("Updating product with data:", productData);
        result = await ProductAPI.update(editingId, productData);
        console.log("Update result:", result);
      } else {
        console.log("Creating new product with data:", productData);
        result = await ProductAPI.create(productData);
        console.log("Create result:", result);
      }

      // Reset form
      setForm({
        name: "",
        description: "",
        image: "",
        brand_id: 0,
        category_id: 0,
      });
      setEditingId(null);

      // Reload products
      await fetchProducts();

      alert(editingId ? "Cập nhật thành công!" : "Tạo sản phẩm thành công!");
    } catch (error) {
      console.error("Detailed error:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);

      // Hiển thị lỗi chi tiết hơn
      let errorMessage =
        "Có lỗi xảy ra khi " + (editingId ? "cập nhật" : "tạo") + " sản phẩm";
      if (error.message.includes("400")) {
        errorMessage += "\nLỗi: Dữ liệu không hợp lệ";
      } else if (error.message.includes("404")) {
        errorMessage += "\nLỗi: Không tìm thấy sản phẩm";
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
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      return;
    }

    try {
      await ProductAPI.delete(id);
      fetchProducts();
      alert("Xóa thành công!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Có lỗi xảy ra khi xóa sản phẩm: " + error.message);
    }
  };

  const handleEdit = (product) => {
    console.log("Editing product:", product);
    setForm({
      name: product.getName(),
      description: product.getDescription(),
      image: product.getImage() || "",
      brand_id: product.getBrandId(),
      category_id: product.getCategoryId(),
    });
    setEditingId(product.getId());
    console.log("Form after edit:", form);
    console.log("Editing ID set to:", product.getId());
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
            <tr key={product.getId()}>
              <td>{product.getId()}</td>
              <td>{product.getName()}</td>
              <td
                style={{
                  maxWidth: 200,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {product.getDescription()}
              </td>
              <td>
                {product.getImage() && (
                  <img
                    src={product.getImage()}
                    alt={product.getName()}
                    width={60}
                    height={60}
                    style={{ objectFit: "cover" }}
                  />
                )}
              </td>
              <td>{product.getBrandId()}</td>
              <td>{product.getCategoryId()}</td>
              <td>
                {product.getCreatedAt()
                  ? new Date(product.getCreatedAt()).toLocaleDateString("vi-VN")
                  : "-"}
              </td>
              <td>
                {product.getUpdatedAt()
                  ? new Date(product.getUpdatedAt()).toLocaleDateString("vi-VN")
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
                  onClick={() => handleDelete(product.getId())}
                  style={{ padding: 5 }}
                >
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

export default ProductComponent;
