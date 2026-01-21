// src/prodetailcomponent.jsx
import { useEffect, useState } from "react";
import ProdetailService from "@services/prodetail.service.js";
import ProductService from "@services/product.service.js";
import SizeSerivice from "@services/size.service.js";
import StoreService from "@services/store.service.js";
import Prodetail from "@models/prodetail";
import "@styles/pages/_admin.scss";
import Modal from "@components/admin/ModelComponent.jsx";
import { FileText } from "lucide-react";

function ProdetailManagement() {
  const [prodetails, setProdetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [stores, setStores] = useState([]);
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

  const [priceInputMode, setPriceInputMode] = useState("select"); // 'select' hoặc 'manual'
  const [oldPriceInputMode, setOldPriceInputMode] = useState("select");

  const [form, setForm] = useState({
    name: "",
    product_id: "",
    size_id: "",
    store_id: "",
    buyturn: "",
    specification: "",
    price: "",
    oldprice: "",
    quantity: "",
    img1: "",
    img2: "",
    img3: "",
  });

  const loadInitialData = async () => {
    setLoadingData(true);
    try {
      console.log("🔄 Đang tải dữ liệu ban đầu...");

      const [productsData, sizesData, storesData] = await Promise.all([
        ProductService.getAllProducts().catch((err) => {
          console.warn("⚠️ Không thể tải products:", err.message);
          return [];
        }),
        SizeSerivice.getAll().catch((err) => {
          console.warn("⚠️ Không thể tải sizes:", err.message);
          return [];
        }),
        StoreService.getAll().catch((err) => {
          console.warn("⚠️ Không thể tải stores:", err.message);
          return [];
        }),
      ]);

      console.log("✅ Products loaded:", productsData.length);
      console.log("✅ Sizes loaded:", sizesData.length);
      console.log("✅ Stores loaded:", storesData.length);

      setProducts(productsData || []);
      setSizes(sizesData || []);
      setStores(storesData || []);
    } catch (error) {
      console.error("❌ Lỗi khi tải dữ liệu ban đầu:", error);
      setMessage("❌ Lỗi khi tải dữ liệu: " + error.message);
    } finally {
      setLoadingData(false);
    }
  };

  // ✅ FETCH PRODETAILS VỚI PHÂN TRANG
  const fetchProdetails = async (pageNum = 1, searchTerm = "") => {
    setLoading(true);
    try {
      console.log(
        `🔍 Đang tải prodetails - Trang: ${pageNum}, Tìm kiếm: "${searchTerm}"`,
      );

      const response = await ProdetailService.getPaging({
        page: pageNum,
        search: searchTerm,
        limit: 10,
      });

      console.log("📦 API Response:", response);

      if (response && response.data && Array.isArray(response.data)) {
        const prodetailInstances = response.data.map((item) => {
          try {
            return Prodetail.fromApiResponse
              ? Prodetail.fromApiResponse(item)
              : item;
          } catch (error) {
            console.warn("⚠️ Lỗi khi tạo Prodetail instance:", error);
            return item;
          }
        });

        setProdetails(prodetailInstances);
        setTotalPage(response.totalPage || 1);
        setPage(response.currentPage || pageNum);
        setTotalItems(response.totalProDetails || 0);

        console.log(`✅ Loaded ${prodetailInstances.length} prodetails`);
      } else {
        console.warn("⚠️ Invalid response format:", response);
        setProdetails([]);
        setTotalPage(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("❌ Lỗi khi fetch prodetails:", error);
      setMessage("❌ Lỗi: " + error.message);
      setProdetails([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ USEEFFECTS
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!loadingData) {
      fetchProdetails(page, search);
    }
  }, [page, search, loadingData]);

  const isPriceInOptions = (price) => {
    return priceOptions.some((opt) => opt.value === Number(price));
  };

  const openCreateModal = () => {
    setForm({
      name: "",
      product_id: "",
      size_id: "",
      store_id: "",
      price: "",
      oldprice: "",
      quantity: "",
      buyturn: "",
      specification: "",
      img1: "",
      img2: "",
      img3: "",
    });
    setModalMode("create");
    setEditingId(null);
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (item) => {
    const priceValue = item.price?.toString() || "";
    const oldPriceValue = item.oldprice?.toString() || "";

    // Kiểm tra xem giá có trong dropdown không
    const priceInOptions = isPriceInOptions(item.price);
    const oldPriceInOptions = isPriceInOptions(item.oldprice);

    // Tự động chuyển sang manual mode nếu giá không có trong options
    setPriceInputMode(priceInOptions ? "select" : "manual");
    setOldPriceInputMode(
      oldPriceInOptions || !item.oldprice ? "select" : "manual",
    );

    setForm({
      name: item.name || "",
      product_id: item.product_id?.toString() || "",
      size_id: item.size_id?.toString() || "",
      store_id: item.store_id?.toString() || "",
      price: priceValue,
      oldprice: oldPriceValue,
      quantity: item.quantity?.toString() || "",
      buyturn: item.buyturn?.toString() || "",
      specification: item.specification || "",
      img1: item.img1 || "",
      img2: item.img2 || "",
      img3: item.img3 || "",
    });
    setModalMode("edit");
    setEditingId(item.id);
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setModalMode("create");
      setEditingId(null);
      setErrors({});
      setPriceInputMode("select");
      setOldPriceInputMode("select");
    }, 300);
  };

  // ✅ FORM HANDLERS
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error khi user bắt đầu nhập
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Tên sản phẩm là bắt buộc";
    if (!form.product_id) newErrors.product_id = "Vui lòng chọn sản phẩm";
    if (!form.size_id) newErrors.size_id = "Vui lòng chọn size";
    if (!form.store_id) newErrors.store_id = "Vui lòng chọn cửa hàng";
    if (!form.price || isNaN(form.price) || form.price <= 0) {
      newErrors.price = "Giá phải là số dương";
    }
    if (form.oldprice && (isNaN(form.oldprice) || form.oldprice <= 0)) {
      newErrors.oldprice = "Giá cũ phải là số dương";
    }
    if (!form.quantity || isNaN(form.quantity) || form.quantity < 0) {
      newErrors.quantity = "Số lượng phải là số không âm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const formData = {
        ...form,
        product_id: parseInt(form.product_id),
        size_id: parseInt(form.size_id),
        store_id: parseInt(form.store_id),
        price: parseFloat(form.price),
        oldprice: form.oldprice ? parseFloat(form.oldprice) : null,
        quantity: parseInt(form.quantity),
        buyturn: form.buyturn ? parseInt(form.buyturn) : 0,
      };

      if (modalMode === "edit") {
        await ProdetailService.update(editingId, formData);
        setMessage("✅ Cập nhật thành công!");
      } else {
        await ProdetailService.create(formData);
        setMessage("✅ Thêm mới thành công!");
      }

      closeModal();
      await fetchProdetails(page, search);
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("❌ Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ACTION HANDLERS
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    setLoading(true);
    try {
      await ProdetailService.delete(id);
      setMessage("✅ Xóa thành công!");
      await fetchProdetails(page, search);
    } catch (error) {
      setMessage("❌ Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchValue = formData.get("search");
    setSearch(searchValue);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage && newPage !== page && !loading) {
      setPage(newPage);
    }
  };

  // ✅ HELPER FUNCTIONS
  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : `ID: ${productId}`;
  };

  const getSizeName = (sizeId) => {
    const size = sizes.find((s) => s.id === sizeId);
    return size ? size.name || size.size_name : `ID: ${sizeId}`;
  };

  const getStoreName = (storeId) => {
    const store = stores.find((s) => s.id === storeId);
    return store ? store.name || store.store_name : `ID: ${storeId}`;
  };
  const priceOptions = [
    { value: 9000, label: "9.000 ₫" },
    { value: 15000, label: "15.000 ₫" },
    { value: 19000, label: "19.000 ₫" },
    { value: 20000, label: "20.000 ₫" },
    { value: 22000, label: "22.000 ₫" },
    { value: 25000, label: "25.000 ₫" },
    { value: 29000, label: "29.000 ₫" },
    { value: 30000, label: "30.000 ₫" },
    { value: 32000, label: "32.000 ₫" },
    { value: 33000, label: "33.000 ₫" },
    { value: 35000, label: "35.000 ₫" },
    { value: 39000, label: "39.000 ₫" },
    { value: 45000, label: "45.000 ₫" },
    { value: 49000, label: "49.000 ₫" },
    { value: 55000, label: "55.000 ₫" },
  ];
  const formatPrice = (price) => {
    if (!price) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // ✅ LOADING STATE
  if (loadingData) {
    return (
      <div className="prodetail-container">
        <div className="loading-state">
          <div className="loading-text">🔄 Đang tải dữ liệu...</div>
          <div
            style={{
              fontSize: "14px",
              color: "#999",
              marginTop: "8px",
            }}
          >
            Đang tải Products, Sizes, Stores...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="prodetail-container">
      {/* Message */}
      {message && (
        <div
          className={`message ${message.includes("✅") ? "success" : "error"}`}
          style={{
            padding: "12px 16px",
            marginBottom: "20px",
            borderRadius: "6px",
            fontWeight: "500",
          }}
        >
          {message}
          <button
            onClick={() => setMessage("")}
            style={{
              float: "right",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="header">
        <div className="header-title">
          <FileText size={30} className="header-icon" />
          <h2>Quản lý sản phẩm chi tiết</h2>
        </div>
        <button
          className="btn btn-success"
          onClick={openCreateModal}
          disabled={loading}
        >
          ➕ Thêm sản phẩm
        </button>
      </div>

      {/* Search */}
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

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Sản phẩm</th>
              <th>Size</th>
              <th>Cửa hàng</th>
              <th>Giá</th>
              <th>Giá cũ</th>
              <th>SL</th>
              <th>Lượt mua</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="10"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                  }}
                >
                  🔄 Đang tải...
                </td>
              </tr>
            ) : prodetails.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
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
              prodetails.map((item) => (
                <tr key={item.id}>
                  <td className="table-id">{item.id}</td>
                  <td className="product-name">{item.name}</td>
                  <td className="product-info">
                    {getProductName(item.product_id)}
                  </td>
                  <td>
                    <span className="size-badge">
                      {getSizeName(item.size_id)}
                    </span>
                  </td>
                  <td className="store-name">{getStoreName(item.store_id)}</td>
                  <td className="price">{formatPrice(item.price)}</td>
                  <td className="old-price">
                    {item.oldprice ? formatPrice(item.oldprice) : "-"}
                  </td>
                  <td
                    className={`quantity ${
                      item.quantity > 0 ? "in-stock" : "out-of-stock"
                    }`}
                  >
                    {item.quantity}
                  </td>
                  <td style={{ textAlign: "center" }}>{item.buyturn || 0}</td>
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
      {totalPage > 1 && (
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

            {Array.from({ length: Math.min(5, totalPage) }, (_, i) => {
              const pageNum =
                Math.max(1, Math.min(totalPage - 4, page - 2)) + i;
              if (pageNum > totalPage) return null;

              return (
                <button
                  key={pageNum}
                  className={`btn-page ${pageNum === page ? "active" : ""}`}
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

      {/* Modal */}
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
            <label className="form-label">🛍️ Sản phẩm *</label>
            <select
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
              className={`form-input ${errors.product_id ? "error" : ""}`}
              required
            >
              <option value="">-- Chọn sản phẩm --</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  [{product.id}] {product.name}
                </option>
              ))}
            </select>
            {errors.product_id && (
              <span className="form-error">{errors.product_id}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">📏 Size *</label>
              <select
                name="size_id"
                value={form.size_id}
                onChange={handleChange}
                className={`form-input ${errors.size_id ? "error" : ""}`}
                required
              >
                <option value="">-- Chọn size --</option>
                {sizes.map((size) => (
                  <option key={size.id} value={size.id}>
                    [{size.id}] {size.name}
                  </option>
                ))}
              </select>
              {errors.size_id && (
                <span className="form-error">{errors.size_id}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">🏪 Cửa hàng *</label>
              <select
                name="store_id"
                value={form.store_id}
                onChange={handleChange}
                className={`form-input ${errors.store_id ? "error" : ""}`}
                required
              >
                <option value="">-- Chọn cửa hàng --</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    [{store.id}] {store.storeName}
                  </option>
                ))}
              </select>
              {errors.store_id && (
                <span className="form-error">{errors.store_id}</span>
              )}
            </div>
          </div>

          {/* ✅ GIÁ BÁN - CÓ THỂ CHỌN HOẶC NHẬP */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                💰 Giá bán *
                <div
                  className="input-mode-toggle"
                  style={{
                    display: "inline-flex",
                    marginLeft: "10px",
                    gap: "8px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setPriceInputMode("select")}
                    style={{
                      padding: "2px 8px",
                      fontSize: "11px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      background:
                        priceInputMode === "select" ? "#4CAF50" : "#fff",
                      color: priceInputMode === "select" ? "#fff" : "#333",
                      cursor: "pointer",
                    }}
                  >
                    📋 Chọn
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriceInputMode("manual")}
                    style={{
                      padding: "2px 8px",
                      fontSize: "11px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      background:
                        priceInputMode === "manual" ? "#2196F3" : "#fff",
                      color: priceInputMode === "manual" ? "#fff" : "#333",
                      cursor: "pointer",
                    }}
                  >
                    ✏️ Nhập
                  </button>
                </div>
              </label>

              {priceInputMode === "select" ? (
                <select
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className={`form-input ${errors.price ? "error" : ""}`}
                  required
                >
                  <option value="">-- Chọn giá bán --</option>
                  {priceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                  {/* ✅ Thêm option cho giá hiện tại nếu không có trong list */}
                  {form.price && !isPriceInOptions(form.price) && (
                    <option value={form.price}>
                      {formatPrice(form.price)} (Giá hiện tại)
                    </option>
                  )}
                </select>
              ) : (
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className={`form-input ${errors.price ? "error" : ""}`}
                  placeholder="Nhập giá bán (VND)..."
                  min="1000"
                  step="1000"
                  required
                />
              )}

              {errors.price && (
                <span className="form-error">{errors.price}</span>
              )}
              {form.price && (
                <small
                  style={{
                    color: "#4CAF50",
                    fontSize: "12px",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  💵 Giá hiện tại: <strong>{formatPrice(form.price)}</strong>
                </small>
              )}
            </div>

            {/* ✅ GIÁ CŨ - CÓ THỂ CHỌN HOẶC NHẬP */}
            <div className="form-group">
              <label className="form-label">
                💸 Giá cũ
                <div
                  className="input-mode-toggle"
                  style={{
                    display: "inline-flex",
                    marginLeft: "10px",
                    gap: "8px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOldPriceInputMode("select")}
                    style={{
                      padding: "2px 8px",
                      fontSize: "11px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      background:
                        oldPriceInputMode === "select" ? "#4CAF50" : "#fff",
                      color: oldPriceInputMode === "select" ? "#fff" : "#333",
                      cursor: "pointer",
                    }}
                  >
                    📋 Chọn
                  </button>
                  <button
                    type="button"
                    onClick={() => setOldPriceInputMode("manual")}
                    style={{
                      padding: "2px 8px",
                      fontSize: "11px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      background:
                        oldPriceInputMode === "manual" ? "#2196F3" : "#fff",
                      color: oldPriceInputMode === "manual" ? "#fff" : "#333",
                      cursor: "pointer",
                    }}
                  >
                    ✏️ Nhập
                  </button>
                </div>
              </label>

              {oldPriceInputMode === "select" ? (
                <select
                  name="oldprice"
                  value={form.oldprice}
                  onChange={handleChange}
                  className={`form-input ${errors.oldprice ? "error" : ""}`}
                >
                  <option value="">-- Không có giá cũ --</option>
                  {priceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                  {/* ✅ Thêm option cho giá cũ hiện tại nếu không có trong list */}
                  {form.oldprice && !isPriceInOptions(form.oldprice) && (
                    <option value={form.oldprice}>
                      {formatPrice(form.oldprice)} (Giá cũ hiện tại)
                    </option>
                  )}
                </select>
              ) : (
                <input
                  type="number"
                  name="oldprice"
                  value={form.oldprice}
                  onChange={handleChange}
                  className={`form-input ${errors.oldprice ? "error" : ""}`}
                  placeholder="Nhập giá cũ (VND)..."
                  min="1000"
                  step="1000"
                />
              )}

              {errors.oldprice && (
                <span className="form-error">{errors.oldprice}</span>
              )}
              {form.oldprice && (
                <small
                  style={{
                    color: "#ff9800",
                    fontSize: "12px",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  🏷️ Giá cũ: <strong>{formatPrice(form.oldprice)}</strong>
                  {form.price && Number(form.oldprice) > Number(form.price) && (
                    <span style={{ color: "#4CAF50", marginLeft: "8px" }}>
                      (Giảm{" "}
                      {Math.round(
                        (1 - Number(form.price) / Number(form.oldprice)) * 100,
                      )}
                      %)
                    </span>
                  )}
                </small>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">📦 Số lượng *</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                className={`form-input ${errors.quantity ? "error" : ""}`}
                placeholder="0"
                min="0"
                required
              />
              {errors.quantity && (
                <span className="form-error">{errors.quantity}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">🔢 Lượt mua</label>
              <input
                type="number"
                name="buyturn"
                value={form.buyturn}
                onChange={handleChange}
                className="form-input"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">📋 Mô tả/Thông số</label>
            <textarea
              name="specification"
              value={form.specification}
              onChange={handleChange}
              className="form-input"
              rows="3"
              placeholder="Nhập mô tả chi tiết sản phẩm..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">🖼️ Hình ảnh</label>
            <input
              name="img1"
              value={form.img1}
              onChange={handleChange}
              className="form-input"
              placeholder="URL hình ảnh chính..."
              type="url"
            />
            <input
              name="img2"
              value={form.img2}
              onChange={handleChange}
              className="form-input"
              placeholder="URL hình ảnh phụ 1..."
              type="url"
              style={{ marginTop: "8px" }}
            />
            <input
              name="img3"
              value={form.img3}
              onChange={handleChange}
              className="form-input"
              placeholder="URL hình ảnh phụ 2..."
              type="url"
              style={{ marginTop: "8px" }}
            />
          </div>

          {/* Form buttons */}
          <div
            className="form-buttons"
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid #dee2e6",
            }}
          >
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
    </div>
  );
}

export default ProdetailManagement;
