import { useEffect, useState } from "react";
import UserService from "@services/user.service.js";
import Modal from "@components/admin/ModelComponent.jsx";
import "@styles/pages/_admin.scss";
import { Coffee, Users, Users2 } from "lucide-react";
import Loading from "../../components/common/Loading";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    role: 0,
    avatar: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (!loadingData) {
      fetchUsers(page, search);
    }
  }, [page, search, loadingData]);

  const fetchUsers = async (pageNum = 1, searchTerm = "") => {
    setLoading(true);
    try {
      console.log(
        `🔄 fetchUsers called with: page=${pageNum}, search="${searchTerm}"`,
      );

      const response = await UserService.getPaging({
        page: pageNum || 1,
        search: searchTerm || "",
      });

      if (!response || !response.data) {
        setUsers([]);
        setTotalPage(1);
        setTotalItems(0);
        setPage(1);
        return;
      }

      const usersData = response.data || [];
      const pagination = response.pagination || {};

      const processedUsers = usersData.map((user) => ({
        ...user,
      }));

      const currentPage = pagination.currentPage || pageNum || 1;
      const totalPageCount = pagination.totalPage || 1;
      const totalItemsCount = pagination.totalItems || 0;

      setUsers(processedUsers);
      setPage(currentPage);
      setTotalPage(totalPageCount);
      setTotalItems(totalItemsCount);

      console.log(`✅ State updated: ${usersData.length} users loaded`);
    } catch (error) {
      console.error("❌ Error in fetchUsers:", error);
      setMessage(`❌ ${error.message}`);

      setUsers([]);
      setTotalPage(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  // ✅ MODAL FUNCTIONS - CHỈ CREATE
  const openCreateModal = () => {
    setForm({
      email: "",
      password: "",
      name: "",
      role: 0,
      avatar: "",
      phone: "",
      address: "",
    });
    setModalMode("create");
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({
      email: "",
      password: "",
      name: "",
      role: 0,
      avatar: "",
      phone: "",
      address: "",
    });
    setErrors({});
  };

  const openDetailModal = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedUser(null);
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

    if (!form.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!form.name.trim()) {
      newErrors.name = "Tên người dùng là bắt buộc";
    } else if (form.name.length > 255) {
      newErrors.name = "Tên không được dài quá 255 ký tự";
    }

    if (!form.password.trim()) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (form.phone && !/^(0[3|5|7|8|9])+([0-9]{8})$/.test(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
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
      const userData = {
        email: form.email.trim(),
        password: form.password.trim(),
        name: form.name.trim(),
        avatar: form.avatar.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      };

      console.log("🔄 Đang tạo user mới");
      const result = await UserService.create(userData);
      setMessage("✅ Thêm người dùng thành công!");

      console.log("✅ Kết quả:", result);

      closeModal();
      await fetchUsers(page, search);

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ Lỗi submit form:", error);
      setMessage("❌ " + error.message);
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

  const getRoleText = (role) => {
    const roles = {
      1: "Khách hàng",
      2: "Quản trị viên",
    };
    return roles[role] || "Không xác định";
  };

  const getRoleBadgeClass = (role) => {
    const classes = {
      1: "role-customer",
      2: "role-manager",
    };
    return classes[role] || "role-default";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (loadingData) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <div className="loading-spinner">
            <Coffee size={48} />
          </div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // ✅ MAIN RENDER
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
          <Users size={30} className="header-icon" />
          <h2>Quản lý người dùng</h2>
        </div>

        <button
          className="btn btn-success"
          onClick={openCreateModal}
          disabled={loading}
        >
          ➕ Thêm người dùng
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-info">
          Tổng <strong>{totalItems}</strong> người dùng
        </div>
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            name="search"
            className="search-input"
            placeholder="Tìm kiếm người dùng..."
            defaultValue={search}
          />
          <button type="submit" className="btn-search">
            🔍 Tìm kiếm
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Avatar</th>
              <th>Thông tin</th>
              <th>Quyền</th>
              <th>Liên hệ</th>
              <th>Địa chỉ</th>
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
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#999",
                  }}
                >
                  👤 Không có dữ liệu
                </td>
              </tr>
            ) : (
              users.map((item) => (
                <tr key={item.id}>
                  <td className="table-id">{item.id}</td>
                  <td className="user-avatar">
                    {item.avatar ? (
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        height={50}
                        width={50}
                        borderRadius={180}
                      />
                    ) : null}
                    <div>
                      <Users2 size={30} />
                    </div>
                  </td>
                  <td className="user-info">
                    <div style={{ maxWidth: "200px" }}>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "14px",
                          marginBottom: "4px",
                        }}
                      >
                        {item.name || "-"}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                        }}
                      >
                        {item.email || "-"}
                      </div>
                    </div>
                  </td>
                  <td className="user-role">
                    <span
                      className={`role-badge ${getRoleBadgeClass(item.role)}`}
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        backgroundColor:
                          item.role === 3
                            ? "#dc3545"
                            : item.role === 2
                              ? "#fd7e14"
                              : item.role === 1
                                ? "#20c997"
                                : "#6c757d",
                        color: "white",
                      }}
                    >
                      {getRoleText(item.role)}
                    </span>
                  </td>
                  <td className="user-contact">
                    <div style={{ fontSize: "12px" }}>
                      {formatPhone(item.phone)}
                    </div>
                  </td>
                  <td className="user-address">
                    <div
                      style={{
                        maxWidth: "150px",
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
                  <td className="date">{formatDate(item.createdAt)}</td>
                  <td className="actions">
                    <div className="action-buttons">
                      {/* ✅ CHỈ CÓ BUTTON XEM CHI TIẾT */}
                      <button
                        className="btn-view"
                        onClick={() => openDetailModal(item)}
                        disabled={loading}
                        style={{
                          backgroundColor: "#17a2b8",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        👁️ Xem chi tiết
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
            Trang {page} / {totalPage} - Tổng {totalItems} người dùng
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

      {/* ✅ MODAL TẠO MỚI NGƯỜI DÙNG */}
      <Modal
        show={showModal}
        onClose={closeModal}
        title="➕ Thêm người dùng mới"
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">📧 Email *</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="Nhập email..."
                required
              />
              {errors.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">🔒 Mật khẩu *</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="Nhập mật khẩu..."
                required
              />
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">👤 Tên người dùng *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? "error" : ""}`}
              placeholder="Nhập tên người dùng..."
              required
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">📞 Số điện thoại</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? "error" : ""}`}
                placeholder="Nhập số điện thoại..."
              />
              {errors.phone && (
                <span className="form-error">{errors.phone}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">🖼️ Avatar (URL)</label>
            <input
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              className="form-input"
              placeholder="URL hình đại diện..."
              type="url"
            />
            {form.avatar && (
              <div style={{ marginTop: "8px" }}>
                <img
                  src={form.avatar}
                  alt="Avatar Preview"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "2px solid #ddd",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">🏠 Địa chỉ</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="form-input"
              rows="3"
              placeholder="Nhập địa chỉ..."
            />
          </div>

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
              {loading ? "⏳ Đang xử lý..." : "➕ Thêm mới"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ✅ MODAL XEM CHI TIẾT NGƯỜI DÙNG */}
      <Modal
        show={showDetailModal}
        onClose={closeDetailModal}
        title={`👁️ Chi tiết người dùng #${selectedUser?.id}`}
        size="lg"
      >
        {selectedUser && (
          <div className="user-detail-content">
            {/* Avatar Section */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              {selectedUser.avatar ? (
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "4px solid #ddd",
                    marginBottom: "16px",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  backgroundColor: "#f0f0f0",
                  display: selectedUser.avatar ? "none" : "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  fontSize: "48px",
                  color: "#666",
                  margin: "0 auto 16px",
                }}
              >
                👤
              </div>
              <h3 style={{ margin: "0", color: "#333" }}>
                {selectedUser.name}
              </h3>
            </div>

            {/* User Information */}
            <div
              className="detail-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div className="detail-item">
                <label
                  style={{
                    fontWeight: "bold",
                    color: "#555",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  🆔 ID người dùng:
                </label>
                <span style={{ color: "#333" }}>{selectedUser.id}</span>
              </div>

              <div className="detail-item">
                <label
                  style={{
                    fontWeight: "bold",
                    color: "#555",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  📧 Email:
                </label>
                <span style={{ color: "#333" }}>{selectedUser.email}</span>
              </div>

              <div className="detail-item">
                <label
                  style={{
                    fontWeight: "bold",
                    color: "#555",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  🎭 Quyền hạn:
                </label>
                <span
                  className={`role-badge ${getRoleBadgeClass(
                    selectedUser.role,
                  )}`}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    backgroundColor:
                      selectedUser.role === 3
                        ? "#dc3545"
                        : selectedUser.role === 2
                          ? "#fd7e14"
                          : selectedUser.role === 1
                            ? "#20c997"
                            : "#6c757d",
                    color: "white",
                    display: "inline-block",
                  }}
                >
                  {getRoleText(selectedUser.role)}
                </span>
              </div>

              <div className="detail-item">
                <label
                  style={{
                    fontWeight: "bold",
                    color: "#555",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  📞 Số điện thoại:
                </label>
                <span style={{ color: "#333" }}>
                  {formatPhone(selectedUser.phone)}
                </span>
              </div>

              <div className="detail-item" style={{ gridColumn: "1 / -1" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    color: "#555",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  🏠 Địa chỉ:
                </label>
                <span style={{ color: "#333" }}>
                  {selectedUser.address || "Chưa cập nhật"}
                </span>
              </div>

              <div className="detail-item">
                <label
                  style={{
                    fontWeight: "bold",
                    color: "#555",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  📅 Ngày tạo:
                </label>
                <span style={{ color: "#333" }}>
                  {formatDate(selectedUser.createdAt)}
                </span>
              </div>

              <div className="detail-item">
                <label
                  style={{
                    fontWeight: "bold",
                    color: "#555",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  🔄 Cập nhật lần cuối:
                </label>
                <span style={{ color: "#333" }}>
                  {formatDate(selectedUser.updatedAt)}
                </span>
              </div>
            </div>

            {/* ✅ KHÔNG HIỂN THỊ MẬT KHẨU */}
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid #dee2e6",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: "0",
                  color: "#6c757d",
                  fontSize: "14px",
                }}
              >
                🔒 Thông tin mật khẩu được bảo mật và không hiển thị
              </p>
            </div>

            {/* Close Button */}
            <div
              style={{
                marginTop: "24px",
                textAlign: "center",
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={closeDetailModal}
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                }}
              >
                ❌ Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default UserManagement;
