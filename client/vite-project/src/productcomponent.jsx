import { useEffect, useState } from "react";
import ProductAPI from "../api/productapi";
import Product from "../models/productmodel";

function ProductComponent() {
  const [products, setProducts] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    brand_id: 0,
    category_id: 0,
  });
  const [editingId, setEditingId] = useState(null);
  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // Sửa fetchProducts để nhận page
  const fetchProducts = async (page = 1) => {
    try {
      // Giả sử API hỗ trợ truyền page: ProductAPI.getAll({ page })
      const data = await ProductAPI.getAll({ page });
      // Nếu API trả về products, currentPage, totalPage
      setProducts(data.products || data);
      setCurrentPage(data.currentPage || 1);
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

      // Reset form and close dialog
      resetForm();
      setShowDialog(false);

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
    setShowDialog(true);
    console.log("Form after edit:", form);
    console.log("Editing ID set to:", product.getId());
  };

  const handleAddNew = () => {
    resetForm();
    setShowDialog(true);
  };

  const handleCancel = () => {
    resetForm();
    setShowDialog(false);
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      image: "",
      brand_id: 0,
      category_id: 0,
    });
    setEditingId(null);
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
    maxWidth: "500px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
  };

  const formGroupStyle = {
    marginBottom: "15px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
    marginTop: "20px",
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

  // Thêm hàm chuyển trang
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPage && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>Quản lý sản phẩm</h2>
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
          + Thêm sản phẩm mới
        </button>
      </div>

      {/* Dialog */}
      <div style={dialogOverlayStyle} onClick={handleCancel}>
        <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
          <h3 style={{ marginTop: 0, marginBottom: "20px" }}>
            {editingId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Tên sản phẩm *</label>
              <input
                name="name"
                placeholder="Nhập tên sản phẩm"
                value={form.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Mô tả</label>
              <textarea
                name="description"
                placeholder="Nhập mô tả sản phẩm"
                value={form.description}
                onChange={handleChange}
                style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Link hình ảnh</label>
              <input
                name="image"
                placeholder="Nhập URL hình ảnh"
                value={form.image}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Brand ID</label>
              <input
                name="brand_id"
                placeholder="Nhập Brand ID"
                value={form.brand_id}
                onChange={handleChange}
                type="number"
                style={inputStyle}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Category ID</label>
              <input
                name="category_id"
                placeholder="Nhập Category ID"
                value={form.category_id}
                onChange={handleChange}
                type="number"
                style={inputStyle}
              />
            </div>

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

      {/* PHÂN TRANG */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ margin: "0 5px", padding: "8px 16px" }}
        >
          &lt; Trước
        </button>
        {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            style={{
              margin: "0 2px",
              padding: "8px 14px",
              backgroundColor: page === currentPage ? "#007bff" : "#fff",
              color: page === currentPage ? "#fff" : "#000",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontWeight: page === currentPage ? "bold" : "normal",
              cursor: page === currentPage ? "default" : "pointer",
            }}
            disabled={page === currentPage}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPage}
          style={{ margin: "0 5px", padding: "8px 16px" }}
        >
          Sau &gt;
        </button>
      </div>
    </div>
  );
}

export default ProductComponent;
