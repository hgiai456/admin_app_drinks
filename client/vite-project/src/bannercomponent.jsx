import { useEffect, useState } from "react";
import { BannerAPI } from "../api/bannerApi";
import Banner from "../models/bannermodel";

function BannerComponent() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({
    title: "",
    image: "",
    status: 1,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await BannerAPI.getAll();
      setBanners(data);
    } catch (err) {
      setError("Không thể tải danh sách banner: " + err.message);
      console.error("Error fetching banners:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "status" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      // Tạo object dữ liệu theo cấu trúc API
      const bannerData = {
        name: form.title,
        image: form.image || null,
        status: form.status,
      };

      if (editingId) {
        // Cập nhật banner
        await BannerAPI.update(editingId, bannerData);
      } else {
        // Tạo banner mới
        await BannerAPI.create(bannerData);
      }

      // Reset form
      setForm({ title: "", image: "", status: 1 });
      setEditingId(null);

      // Tải lại danh sách
      await fetchBanners();
    } catch (err) {
      setError("Có lỗi xảy ra: " + err.message);
      console.error("Error saving banner:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa banner này?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await BannerAPI.delete(id);
      await fetchBanners();
    } catch (err) {
      setError("Không thể xóa banner: " + err.message);
      console.error("Error deleting banner:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner) => {
    setForm({
      title: banner.name || "",
      image: banner.image || "",
      status: banner.status || 1,
    });
    setEditingId(banner.id);
  };

  const handleCancel = () => {
    setForm({ title: "", image: "", status: 1 });
    setEditingId(null);
  };

  const getStatusText = (status) => {
    return status === 1 ? "Hoạt động" : "Không hoạt động";
  };

  const getStatusColor = (status) => {
    return status === 1 ? "#4CAF50" : "#f44336";
  };

  if (loading && banners.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>Đang tải...</div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
      <h2>Quản lý Banner</h2>

      {error && (
        <div
          style={{
            color: "red",
            backgroundColor: "#ffebee",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "20px",
            border: "1px solid #f44336",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: 30,
          backgroundColor: "#f5f5f5",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      >
        <div style={{ marginBottom: 15 }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Tên Banner:
          </label>
          <input
            name="title"
            placeholder="Nhập tên banner"
            value={form.title}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Link ảnh:
          </label>
          <input
            name="image"
            placeholder="Nhập URL ảnh"
            value={form.image}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Trạng thái:
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            <option value={1}>Hoạt động</option>
            <option value={0}>Không hoạt động</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#2196F3",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              marginRight: "10px",
              fontSize: "14px",
            }}
          >
            {loading ? "Đang xử lý..." : editingId ? "Cập nhật" : "Thêm mới"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              style={{
                backgroundColor: "#757575",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid #dee2e6",
                  fontWeight: "bold",
                }}
              >
                ID
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid #dee2e6",
                  fontWeight: "bold",
                }}
              >
                Tên Banner
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid #dee2e6",
                  fontWeight: "bold",
                }}
              >
                Ảnh
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid #dee2e6",
                  fontWeight: "bold",
                }}
              >
                URL Ảnh
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid #dee2e6",
                  fontWeight: "bold",
                }}
              >
                Trạng thái
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "center",
                  borderBottom: "2px solid #dee2e6",
                  fontWeight: "bold",
                }}
              >
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#666",
                  }}
                >
                  Chưa có banner nào
                </td>
              </tr>
            ) : (
              banners.map((banner, index) => (
                <tr
                  key={banner.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#fff" : "#f8f9fa",
                  }}
                >
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    {banner.id}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    {banner.name}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    {banner.image ? (
                      <img
                        src={banner.image}
                        alt={banner.name}
                        style={{
                          width: "80px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          border: "1px solid #ddd",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "80px",
                          height: "50px",
                          backgroundColor: "#f0f0f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          color: "#666",
                          fontSize: "12px",
                        }}
                      >
                        Không có ảnh
                      </div>
                    )}
                    <div
                      style={{
                        display: "none",
                        color: "#666",
                        fontSize: "12px",
                      }}
                    >
                      Không thể tải ảnh
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "13px",
                        color: "#666",
                      }}
                    >
                      {banner.image || "Chưa có ảnh"}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: getStatusColor(banner.status),
                      }}
                    >
                      {getStatusText(banner.status)}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #dee2e6",
                      textAlign: "center",
                    }}
                  >
                    <button
                      onClick={() => handleEdit(banner)}
                      disabled={loading}
                      style={{
                        backgroundColor: "#FF9800",
                        color: "white",
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: loading ? "not-allowed" : "pointer",
                        marginRight: "5px",
                        fontSize: "12px",
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      disabled={loading}
                      style={{
                        backgroundColor: "#f44336",
                        color: "white",
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: "12px",
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BannerComponent;
