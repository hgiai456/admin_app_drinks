import { useState } from "react";
import ImageAPI from "../api/imageapi";

function ImageComponent() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Vui lòng chọn file ảnh!");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await ImageAPI.uploadToGoogle(file);
      setImageUrl(res.file);
      setMessage(res.message || "Tải ảnh lên thành công!");
    } catch (err) {
      setMessage("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!imageUrl) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await ImageAPI.deleteImage(imageUrl);
      setMessage(res.message || "Đã xóa ảnh thành công!");
      setImageUrl("");
      setFile(null);
    } catch (err) {
      setMessage("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h2>Upload Ảnh (Google Storage)</h2>
      <form onSubmit={handleUpload} style={{ marginBottom: 16 }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          type="submit"
          disabled={loading}
          style={{ marginLeft: 12, padding: "6px 18px" }}
        >
          {loading ? "Đang tải..." : "Tải lên"}
        </button>
      </form>
      {imageUrl && (
        <div style={{ margin: "16px 0" }}>
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{
              maxWidth: 300,
              maxHeight: 200,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
          <div style={{ marginTop: 8 }}>
            <button
              onClick={handleDelete}
              disabled={loading}
              style={{
                color: "white",
                background: "#dc3545",
                border: "none",
                padding: "6px 16px",
                borderRadius: 4,
              }}
            >
              Xóa ảnh
            </button>
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#555",
              marginTop: 6,
              wordBreak: "break-all",
            }}
          >
            {imageUrl}
          </div>
        </div>
      )}
      {message && (
        <div
          style={{
            marginTop: 12,
            color: message.startsWith("Lỗi") ? "red" : "green",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default ImageComponent;
