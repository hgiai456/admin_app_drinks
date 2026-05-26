import { useEffect, useState } from "react";
import ProductService from "@services/product.service.js";
import CategoryService from "@services/category.service.js";
import BrandService from "@services/brand.service.js";
import Modal from "@components/admin/ModelComponent.jsx";
import "@styles/pages/_admin.scss";
import ImagePicker from "../../components/admin/ImagePicker";
import ImageComponent from "../../components/common/Image.jsx";
import { Image, Package } from "lucide-react";
import Button from "@components/common/Button.jsx";
import Loading from "../../components/common/Loading.jsx";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [showImagePicker, setShowImagePicker] = useState(false); // ✅ ADD THIS

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    brand_id: "",
    category_id: "",
  });

  const loadingInitialData = async () => {
    setLoadingData(true);
    try {
      console.log("🔄 Đang tải dữ liệu ban đầu...");
      const categoriesData = await CategoryService.getAllCategories();
      setCategories(categoriesData || []);
      const brandsData = await BrandService.getAll();
      setBrands(brandsData || []);
      console.log("✅ Đã tải brands:", categoriesData);
      console.log("✅ Đã tải categories:", brandsData);
    } catch (error) {
      console.error("❌ Lỗi tải dữ liệu ban đầu:", error);
      setMessage("❌ Lỗi tải dữ liệu: " + error.message);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadingInitialData();
  }, []);

  useEffect(() => {
    if (!loadingData) {
      fetchProducts(page, search);
    }
  }, [page, search, loadingData]);

  const fetchProducts = async (pageNum = 1, searchTerm = "") => {
    setLoading(true);
    try {
      const response = await ProductService.getPaging({
        page: pageNum || 1,
        search: searchTerm || "",
      });

      if (!response || !response.data) {
        setProducts([]);
        setTotalPage(1);
        setTotalItems(0);
        setPage(1);
        return;
      }

      const productsData = response.data || [];
      const pagination = response.pagination || {};

      const processedProducts = productsData.map((product) => ({
        ...product,
        price: product.product_details?.[0]?.price || 0,
      }));

      console.log("📊 Processed Products:", processedProducts);
      console.log("📊 Pagination:", pagination);

      const currentPage = pagination.currentPage || pageNum || 1;
      const totalPageCount = pagination.totalPage || 1;
      const totalItemsCount = pagination.totalItems || 0;

      setProducts(processedProducts);
      setPage(currentPage);
      setTotalPage(totalPageCount);
      setTotalItems(totalItemsCount);

      console.log(`✅ State updated: ${productsData.length} products loaded`);
    } catch (error) {
      console.error("❌ Error in fetchProducts:", error);
      setMessage(`❌ ${error.message}`);

      setProducts([]);
      setTotalPage(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };
  const openCreateModal = () => {
    setForm({
      name: "",
      description: "",
      image: "",
      brand_id: "",
      category_id: "",
    });
    setModalMode("create");
    setEditingId(null);
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setForm({
      name: item.name || "",
      description: item.description || "",
      image: item.image || "",
      brand_id: item.brand_id?.toString() || "",
      category_id: item.category_id?.toString() || "",
    });
    setModalMode("edit");
    setEditingId(item.id);
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({
      name: "",
      description: "",
      image: "",
      brand_id: "",
      category_id: "",
    });
    setEditingId(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error khi user input
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Tên sản phẩm là bắt buộc";
    } else if (form.name.length > 255) {
      newErrors.name = "Tên sản phẩm không được dài quá 255 ký tự";
    }

    if (!form.category_id) {
      newErrors.category_id = "Danh mục là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage("❌ Vui lòng kiểm tra lại thông tin");
      return;
    }

    setLoading(true);

    try {
      // ✅ Tạo Product instance hoặc object data
      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        brand_id: parseInt(form.brand_id),
        category_id: parseInt(form.category_id),
      };

      let result;
      if (modalMode === "edit") {
        console.log("🔄 Đang cập nhật sản phẩm:", editingId);
        result = await ProductService.update(editingId, productData);
        setMessage("✅ Cập nhật sản phẩm thành công!");
      } else {
        console.log("🔄 Đang tạo sản phẩm mới");
        result = await ProductService.create(productData);
        setMessage("✅ Thêm sản phẩm thành công!");
      }

      console.log("✅ Kết quả:", result);

      // Đóng modal và refresh data
      closeModal();
      await fetchProducts(page, search);

      // Clear message sau 3 giây
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ Lỗi submit form:", error);
      setMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      return;
    }

    setLoading(true);
    try {
      console.log("🗑️ Đang xóa sản phẩm:", id);

      await ProductService.delete(id);
      setMessage("✅ Xóa sản phẩm thành công!");

      // Refresh data
      await fetchProducts(page, search);

      // Clear message sau 3 giây
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ Lỗi xóa sản phẩm:", error);
      setMessage("❌ Lỗi xóa sản phẩm: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchTerm = formData.get("search") || "";
    setSearch(searchTerm);
    setPage(1); // Reset về trang 1 khi search
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage && newPage !== page && !loading) {
      setPage(newPage);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : `Category #${categoryId}`;
  };

  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : `Brand #${brandId}`;
  };
  const formatPrice = (price) => {
    if (!price || price === 0) return "-";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handleImageSelect = (imagePath) => {
    setForm((prev) => ({ ...prev, image: imagePath }));
    setShowImagePicker(false);
  };

  return (
    <div className="prodetail-container">
      {/* Message Alert */}
      {message && (
        <div
          className={`message ${message.includes("✅") ? "success" : "error"}`}
        >
          {message}
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}

      {/* Header */}
      <div className="header">
        <div className="header-title">
          <Package size={30} className="header-icon" />
          <h2>Quản lý sản phẩm</h2>
        </div>
        <h2>Quản lý sản phẩm</h2>
        <button
          className="btn btn-success"
          onClick={openCreateModal}
          disabled={loading}
        >
          ➕ Thêm sản phẩm
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-info">
          Tổng <strong>{totalItems}</strong> sản phẩm
        </div>
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            name="search"
            className="search-input"
            placeholder="Tìm kiếm sản phẩm..."
            defaultValue={search}
          />
          <button type="submit" className="btn-search">
            🔍 Tìm kiếm
          </button>
        </form>
      </div>

      {/* Products Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Hình ảnh</th>
              <th>Danh mục</th>
              <th>Thương hiệu</th>
              <th>Giá</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ padding: "0" }}>
                  <Loading variant="skeleton" rows={8} cols={8} />
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#999",
                  }}
                >
                  📦 Không có dữ liệu
                </td>
              </tr>
            ) : (
              products.map((item) => (
                <tr key={item.id}>
                  <td className="table-id">{item.id}</td>
                  <td className="product-name">
                    <div style={{ maxWidth: "200px" }}>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {item.name || "-"}
                      </div>
                      {item.description && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#666",
                            marginTop: "4px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="product-image">
                    {item.image ? (
                      <ImageComponent
                        src={item.image}
                        alt={item.name}
                        width={55}
                        height={55}
                        borderRadius={4}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : (
                      <ImageComponent
                        src="https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751092040674-logo.png?alt=media&token=4b72bf76-9c9c-4257-9290-808098ceac2f"
                        alt={"Default Image"}
                        width={55}
                        height={55}
                        borderRadius={4}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                    )}
                  </td>
                  <td className="category-name">
                    <span className="category-badge">
                      {getCategoryName(item.category_id)}
                    </span>
                  </td>
                  <td className="brand-name">
                    <span className="brand-badge">
                      {item.brand_id ? getBrandName(item.brand_id) : "-"}
                    </span>
                  </td>
                  <td className="price">{formatPrice(item.price)}</td>
                  <td className="date">{formatDate(item.createdAt)}</td>
                  <td className="actions">
                    <div className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => openEditModal(item)}
                        disabled={loading}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(item.id)}
                        disabled={loading}
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="pagination">
          <div className="pagination-info">
            Trang {page} / {totalPage} - Tổng {totalItems} sản phẩm
          </div>
          <div className="pagination-controls">
            <button
              className="btn-nav"
              onClick={() => handlePageChange(1)}
              disabled={page === 1 || loading}
            >
              ⏪ Đầu
            </button>
            <button
              className="btn-nav"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || loading}
            >
              ⬅️ Trước
            </button>

            {/* Hiển thị số trang */}
            {Array.from({ length: Math.min(5, totalPage) }, (_, i) => {
              const startPage = Math.max(1, page - 2);
              const pageNum = startPage + i;
              if (pageNum > totalPage) return null;

              return (
                <button
                  key={pageNum}
                  className={`btn-page ${page === pageNum ? "active" : ""}`}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={loading}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className="btn-nav"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPage || loading}
            >
              Tiếp ➡️
            </button>
            <button
              className="btn-nav"
              onClick={() => handlePageChange(totalPage)}
              disabled={page === totalPage || loading}
            >
              Cuối ⏩
            </button>
          </div>
        </div>
      )}

      {/* Modal Form */}
      <Modal
        show={showModal}
        onClose={closeModal}
        title={
          modalMode === "create"
            ? "➕ Thêm sản phẩm mới"
            : `✏️ Chỉnh sửa sản phẩm #${editingId}`
        }
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">📝 Tên sản phẩm *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? "error" : ""}`}
              placeholder="Nhập tên sản phẩm..."
              required
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">📋 Mô tả sản phẩm</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="form-input"
              rows="3"
              placeholder="Nhập mô tả sản phẩm..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">🖼️ Hình ảnh</label>
            <div className="image-row">
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                className="form-input"
                placeholder="URL hình ảnh..."
                type="url"
                style={{ flex: 1 }}
              />
              <Button
                type="button"
                variant="primary"
                size="md"
                icon={<Image size={18} />}
                onClick={() => setShowImagePicker(true)}
              >
                Chọn từ thư viện
              </Button>
            </div>
            {form.image && (
              <div>
                <ImageComponent
                  src={form.image}
                  alt={form.name}
                  width={150}
                  height={150}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">📁 Danh mục *</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className={`form-input ${errors.category_id ? "error" : ""}`}
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    [{category.id}] {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <span className="form-error">{errors.category_id}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">🏷️ Thương hiệu</label>
              <select
                name="brand_id"
                value={form.brand_id}
                onChange={handleChange}
                className={`form-input ${errors.brand_id ? "error" : ""}`}
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    [{brand.id}] {brand.name}
                  </option>
                ))}
              </select>
              {errors.brand_id && (
                <span className="form-error">{errors.brand_id}</span>
              )}
            </div>
          </div>

          {/* Form Buttons */}
          <div className="form-buttons">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
              disabled={loading}
            >
              ❌ Hủy
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading
                ? "⏳ Đang xử lý..."
                : modalMode === "edit"
                  ? "💾 Cập nhật"
                  : "➕ Thêm mới"}
            </button>
          </div>
        </form>
      </Modal>

      <ImagePicker
        show={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={handleImageSelect}
        currentImage={form.image}
      />
    </div>
  );
}

export default ProductManagement;
