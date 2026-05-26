import { useEffect, useState } from "react";
import StoreService from "@services/store.service.js";
import Modal from "@components/admin/ModelComponent.jsx";
import "@styles/pages/_admin.scss";

import ImagePicker from "@components/admin/ImagePicker";
import ImageComponent from "@components/common/Image.jsx";
import Button from "@components/common/Button.jsx";
import { Image, Store } from "lucide-react";
import Loading from "../../components/common/Loading";

function StoreManagement() {
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

  const [showImagePicker, setShowImagePicker] = useState(false);

  const [form, setForm] = useState({
    storeName: "",
    address: "",
    phoneNumber: "",
    image: "",
    openTime: "",
    closeTime: "",
  });

  const loadingInitialData = async () => {
    setLoadingData(true);
    try {
      console.log("🔄 Đang tải dữ liệu ban đầu...");
      await fetchStores(1, "");
    } catch (error) {
      console.error("❌ Lỗi tải dữ liệu ban đầu:", error);
      setMessage("❌ Lỗi tải dữ liệu: " + error.message);
    } finally {
      setLoadingData(false);
    }
  };

  // ✅ USEEFFECTS
  useEffect(() => {
    loadingInitialData();
  }, []);

  useEffect(() => {
    if (!loadingData) {
      fetchStores(page, search);
    }
  }, [page, search, loadingData]);

  const fetchStores = async (pageNum = 1, searchTerm = "") => {
    setLoading(true);
    try {
      console.log(
        `🔄 fetchStores called with: page=${pageNum}, search="${searchTerm}"`,
      );

      // Try to use getPaging if available, otherwise use getAll
      let response;
      try {
        response = await StoreService.getPaging({
          page: pageNum || 1,
          search: searchTerm || "",
        });
      } catch (error) {
        // Fallback to getAll if getPaging not implemented
        console.log("📝 Fallback to getAll method");
        const allStores = await StoreService.getAll();

        // Filter by search term if provided
        const filteredStores = searchTerm
          ? allStores.filter(
              (store) =>
                store.storeName
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                store.address?.toLowerCase().includes(searchTerm.toLowerCase()),
            )
          : allStores;

        // Manual pagination
        const itemsPerPage = 10;
        const startIndex = (pageNum - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = filteredStores.slice(startIndex, endIndex);

        response = {
          data: paginatedData,
          pagination: {
            currentPage: pageNum,
            totalPage: Math.ceil(filteredStores.length / itemsPerPage),
            totalItems: filteredStores.length,
          },
        };
      }

      console.log("✅ Response từ StoreAPI:", response);

      if (!response || !response.data) {
        setStores([]);
        setTotalPage(1);
        setTotalItems(0);
        setPage(1);
        return;
      }

      const storesData = response.data || [];
      const pagination = response.pagination || {};

      console.log("📊 Stores Data:", storesData);
      console.log("📊 Pagination:", pagination);

      const currentPage = pagination.currentPage || pageNum || 1;
      const totalPageCount = pagination.totalPage || 1;
      const totalItemsCount = pagination.totalItems || 0;

      setStores(storesData);
      setPage(currentPage);
      setTotalPage(totalPageCount);
      setTotalItems(totalItemsCount);

      console.log(`✅ State updated: ${storesData.length} stores loaded`);
    } catch (error) {
      console.error("❌ Error in fetchStores:", error);
      setMessage(`❌ ${error.message}`);
      setStores([]);
      setTotalPage(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setForm({
      storeName: "",
      address: "",
      phoneNumber: "",
      image: "",
      openTime: "",
      closeTime: "",
    });
    setModalMode("create");
    setEditingId(null);
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setForm({
      storeName: item.storeName || "",
      address: item.address || "",
      phoneNumber: item.phoneNumber || "",
      image: item.image || "",
      openTime: item.openTime || "",
      closeTime: item.closeTime || "",
    });
    setModalMode("edit");
    setEditingId(item.id);
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({
      storeName: "",
      address: "",
      phoneNumber: "",
      image: "",
      openTime: "",
      closeTime: "",
    });
    setEditingId(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.storeName.trim()) {
      newErrors.storeName = "Tên cửa hàng là bắt buộc";
    } else if (form.storeName.length > 255) {
      newErrors.storeName = "Tên cửa hàng không được dài quá 255 ký tự";
    }

    if (!form.address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc";
    } else if (form.address.length > 500) {
      newErrors.address = "Địa chỉ không được dài quá 500 ký tự";
    }

    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = "Số điện thoại là bắt buộc";
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(form.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ (VD: 0901234567)";
    }

    if (form.image && !isValidUrl(form.image)) {
      newErrors.image = "URL hình ảnh không hợp lệ";
    }

    if (form.openTime && form.closeTime) {
      if (form.openTime >= form.closeTime) {
        newErrors.closeTime = "Giờ đóng cửa phải sau giờ mở cửa";
      }
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
      const storeData = {
        storeName: form.storeName.trim(),
        address: form.address.trim(),
        phoneNumber: form.phoneNumber.trim(),
        image: form.image.trim() || null,
        openTime: form.openTime || null,
        closeTime: form.closeTime || null,
      };

      let result;
      if (modalMode === "edit") {
        console.log("🔄 Đang cập nhật cửa hàng:", editingId);
        result = await StoreService.update(editingId, storeData);
        setMessage("✅ Cập nhật cửa hàng thành công!");
      } else {
        console.log("🔄 Đang tạo cửa hàng mới");
        result = await StoreService.create(storeData);
        setMessage("✅ Thêm cửa hàng thành công!");
      }

      console.log("✅ Kết quả:", result);

      closeModal();
      await fetchStores(page, search);

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ Lỗi submit form:", error);
      setMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa cửa hàng này không?")) {
      return;
    }

    setLoading(true);
    try {
      console.log("🗑️ Đang xóa cửa hàng:", id);

      await StoreService.delete(id);
      setMessage("✅ Xóa cửa hàng thành công!");

      await fetchStores(page, search);

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ Lỗi xóa cửa hàng:", error);
      setMessage("❌ Lỗi xóa cửa hàng: " + error.message);
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

  const formatPhone = (phone) => {
    if (!phone) return "-";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(
        7,
      )}`;
    }
    return phone;
  };

  const formatWorkingHours = (openTime, closeTime) => {
    if (!openTime || !closeTime) return "Chưa cập nhật";
    return `${openTime.slice(0, 5)} - ${closeTime.slice(0, 5)}`;
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
          <Store size={30} className="header-icon" />
          <h2>Quản lý cửa hàng</h2>
        </div>

        <button
          className="btn btn-success"
          onClick={openCreateModal}
          disabled={loading}
        >
          ➕ Thêm cửa hàng
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-info">
          Tổng <strong>{totalItems}</strong> cửa hàng
        </div>
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            name="search"
            className="search-input"
            placeholder="Tìm kiếm cửa hàng..."
            defaultValue={search}
          />
          <button type="submit" className="btn-search">
            🔍 Tìm kiếm
          </button>
        </form>
      </div>

      {/* Stores Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên cửa hàng</th>
              <th>Địa chỉ</th>
              <th>Điện thoại</th>
              <th>Giờ hoạt động</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                  }}
                >
                  <Loading variant="skeleton" rows={8} cols={8} />
                </td>
              </tr>
            ) : stores.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#999",
                  }}
                >
                  🏪 Không có dữ liệu
                </td>
              </tr>
            ) : (
              stores.map((item) => (
                <tr key={item.id}>
                  <td className="table-id">{item.id}</td>
                  <td className="store-image">
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
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: "#f0f0f0",
                        display: item.image ? "none" : "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "4px",
                        fontSize: "20px",
                      }}
                    >
                      🏪
                    </div>
                  </td>
                  <td className="store-name">
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                        maxWidth: "150px",
                      }}
                    >
                      {item.storeName || "-"}
                    </div>
                  </td>
                  <td className="store-address">
                    <div
                      style={{
                        maxWidth: "200px",
                        fontSize: "12px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={item.address}
                    >
                      {item.address || "-"}
                    </div>
                  </td>
                  <td className="store-phone">
                    <div style={{ fontSize: "12px" }}>
                      {formatPhone(item.phoneNumber)}
                    </div>
                  </td>
                  <td className="store-hours">
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
                      {formatWorkingHours(item.openTime, item.closeTime)}
                    </div>
                  </td>
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
            Trang {page} / {totalPage} - Tổng {totalItems} cửa hàng
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
            ? "➕ Thêm cửa hàng mới"
            : `✏️ Chỉnh sửa cửa hàng #${editingId}`
        }
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">🏪 Tên cửa hàng *</label>
              <input
                name="storeName"
                value={form.storeName}
                onChange={handleChange}
                className={`form-input ${errors.storeName ? "error" : ""}`}
                placeholder="Nhập tên cửa hàng..."
                required
              />
              {errors.storeName && (
                <span className="form-error">{errors.storeName}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">📞 Số điện thoại *</label>
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className={`form-input ${errors.phoneNumber ? "error" : ""}`}
                placeholder="VD: 0901234567"
                required
              />
              {errors.phoneNumber && (
                <span className="form-error">{errors.phoneNumber}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">🏠 Địa chỉ *</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className={`form-input ${errors.address ? "error" : ""}`}
              placeholder="Nhập địa chỉ cửa hàng..."
              rows="3"
              required
            />
            {errors.address && (
              <span className="form-error">{errors.address}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">🕐 Giờ mở cửa</label>
              <input
                name="openTime"
                type="time"
                value={form.openTime}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">🕕 Giờ đóng cửa</label>
              <input
                name="closeTime"
                type="time"
                value={form.closeTime}
                onChange={handleChange}
                className={`form-input ${errors.closeTime ? "error" : ""}`}
              />
              {errors.closeTime && (
                <span className="form-error">{errors.closeTime}</span>
              )}
            </div>
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
            {errors.image && <span className="form-error">{errors.image}</span>}
            {form.image && (
              <div style={{ marginTop: "8px" }}>
                <img
                  src={form.image}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
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

export default StoreManagement;
