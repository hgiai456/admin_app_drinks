import { useEffect, useState } from "react";
import BannerService from "@services/banner.service.js";
import Modal from "@components/admin/ModelComponent.jsx";
import "@styles/pages/_admin.scss";
import ImagePicker from "@components/admin/ImagePicker";
import ImageComponent from "@components/common/Image.jsx";
import Button from "@components/common/Button.jsx";
import { Image, ImageIcon } from "lucide-react";
import Loading from "@components/common/Loading.jsx";

function BannerManagement() {
  const [banners, setBanners] = useState([]);
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
  const [showImagePicker, setShowImagePicker] = useState(false);

  const [form, setForm] = useState({
    name: "",
    image: "",
    status: 1,
  });

  const loadingInitialData = async () => {
    setLoadingData(true);
    try {
      console.log("🔄 Đang tải dữ liệu ban đầu...");
      await fetchBanners(1, "");
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
      fetchBanners(page, search);
    }
  }, [page, search, loadingData]);

  const fetchBanners = async (pageNum = 1, searchTerm = "") => {
    setLoading(true);
    try {
      console.log(
        `🔄 fetchBanners called with: page=${pageNum}, search="${searchTerm}"`,
      );

      const result = await BannerService.getAll();

      if (!result || !result.success) {
        setBanners([]);
        setTotalPage(1);
        setTotalItems(0);
        setPage(1);
        return;
      }

      let bannersData = result.data || [];

      // Filter by search term if provided
      if (searchTerm) {
        bannersData = bannersData.filter((banner) =>
          banner.name?.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      // Manual pagination
      const itemsPerPage = 10;
      const startIndex = (pageNum - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = bannersData.slice(startIndex, endIndex);

      const currentPage = pageNum || 1;
      const totalPageCount = Math.ceil(bannersData.length / itemsPerPage);
      const totalItemsCount = bannersData.length;

      setBanners(paginatedData);
      setPage(currentPage);
      setTotalPage(totalPageCount);
      setTotalItems(totalItemsCount);

      console.log(`✅ State updated: ${paginatedData.length} banners loaded`);
    } catch (error) {
      console.error("❌ Error in fetchBanners:", error);
      setMessage(`❌ ${error.message}`);
      setBanners([]);
      setTotalPage(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setForm({
      name: "",
      image: "",
      status: 1,
    });
    setModalMode("create");
    setEditingId(null);
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setForm({
      name: item.name || "",
      image: item.image || "",
      status: item.status || 1,
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
      image: "",
      status: 1,
    });
    setEditingId(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "status" ? parseInt(value) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Tên banner là bắt buộc";
    } else if (form.name.length > 255) {
      newErrors.name = "Tên banner không được dài quá 255 ký tự";
    }

    if (form.image && !isValidUrl(form.image)) {
      newErrors.image = "URL hình ảnh không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage("❌ Vui lòng kiểm tra lại thông tin");
      return;
    }

    setLoading(true);

    try {
      const bannerData = {
        name: form.name.trim(),
        image: form.image.trim() || null,
        status: form.status,
      };

      let result;
      if (modalMode === "edit") {
        console.log("🔄 Đang cập nhật banner:", editingId);
        result = await BannerService.update(editingId, bannerData);
        setMessage("✅ Cập nhật banner thành công!");
      } else {
        console.log("🔄 Đang tạo banner mới");
        result = await BannerService.create(bannerData);
        setMessage("✅ Thêm banner thành công!");
      }

      console.log("✅ Kết quả:", result);

      closeModal();
      await fetchBanners(page, search);

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ Lỗi submit form:", error);
      setMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa banner này không?")) {
      return;
    }

    setLoading(true);
    try {
      console.log("🗑️ Đang xóa banner:", id);

      await BannerService.delete(id);
      setMessage("✅ Xóa banner thành công!");

      await fetchBanners(page, search);

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ Lỗi xóa banner:", error);
      setMessage("❌ Lỗi xóa banner: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchTerm = formData.get("search") || "";
    setSearch(searchTerm);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage && newPage !== page && !loading) {
      setPage(newPage);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handleImageSelect = (imagePath) => {
    setForm((prev) => ({ ...prev, image: imagePath }));
    setShowImagePicker(false);
  };

  const getStatusText = (status) => {
    return status === 1 ? "Hoạt động" : "Không hoạt động";
  };

  const getStatusClass = (status) => {
    return status === 1 ? "active" : "inactive";
  };

  if (loadingData) {
    return <Loading variant="fullpage" text="Đang tải dữ liệu..." size="lg" />;
  }

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
          <ImageIcon size={30} className="header-icon" />
          <h2> Quản lý Banner</h2>
        </div>
        <button
          className="btn btn-success"
          onClick={openCreateModal}
          disabled={loading}
        >
          ➕ Thêm banner
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-info">
          Tổng <strong>{totalItems}</strong> banner
        </div>
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            name="search"
            className="search-input"
            placeholder="Tìm kiếm banner..."
            defaultValue={search}
          />
          <button type="submit" className="btn-search">
            🔍 Tìm kiếm
          </button>
        </form>
      </div>

      {/* Banners Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên banner</th>
              <th>Hình ảnh</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Ngày cập nhật</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td>
                  <Loading
                    variant="fullpage"
                    animation="spin"
                    text="Loading..."
                  />
                </td>
              </tr>
            ) : (
              banners.map((item) => (
                <tr key={item.id}>
                  <td className="table-id">{item.id}</td>
                  <td className="banner-name">
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {item.name || "-"}
                    </div>
                  </td>
                  <td className="banner-image">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "100px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          border: "1px solid #ddd",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      style={{
                        width: "100px",
                        height: "60px",
                        backgroundColor: "#f0f0f0",
                        display: item.image ? "none" : "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "4px",
                        fontSize: "24px",
                      }}
                    >
                      🎨
                    </div>
                  </td>
                  <td className="status">
                    <span
                      className={`status-badge ${getStatusClass(item.status)}`}
                    >
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td className="date">{formatDate(item.createdAt)}</td>
                  <td className="date">{formatDate(item.updatedAt)}</td>
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
            Trang {page} / {totalPage} - Tổng {totalItems} banner
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
            ? "➕ Thêm banner mới"
            : `✏️ Chỉnh sửa banner #${editingId}`
        }
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">🎨 Tên banner *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? "error" : ""}`}
              placeholder="Nhập tên banner..."
              required
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
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
              <div style={{ marginTop: "12px" }}>
                <ImageComponent
                  src={form.image}
                  alt={form.name}
                  width={300}
                  height={180}
                  style={{ borderRadius: "8px" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">📊 Trạng thái *</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Không hoạt động</option>
            </select>
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

export default BannerManagement;
