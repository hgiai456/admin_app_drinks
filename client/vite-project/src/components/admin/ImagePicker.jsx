import { useState, useEffect } from "react";
import MediaLibraryService from "@services/medialibrary.service.js";
import "@styles/components/_image-picker.scss";
import { X } from "lucide-react";

function ImagePicker({ show, onClose, onSelect, currentImage = "" }) {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState(currentImage);

  const [uploadFile, setUploadFile] = useState(null);
  const [uploadAltText, setUploadAltText] = useState("");

  // MULTIPLE UPLOAD STATES
  const [uploadFiles, setUploadFiles] = useState([]); // MỚI
  const [previewUrls, setPreviewUrls] = useState([]); // MỚI
  const [uploadProgress, setUploadProgress] = useState(0); // MỚI

  const [previewUrl, setPreviewUrl] = useState(""); // Local preview URL
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadMode, setUploadMode] = useState("single"); // MỚI: "single" hoặc "multiple"
  const [uploadError, setUploadError] = useState(""); // Error state
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    if (show) {
      fetchMediaLibrary();
    }
  }, [show, page, search]);

  const fetchMediaLibrary = async () => {
    setLoading(true);
    try {
      const result = await MediaLibraryService.getMediaLibrary({
        page,
        search,
      });
      setMediaItems(result.data || []);
      setTotalPage(result.pagination.totalPage || 1);
    } catch (error) {
      console.error("Error loading media library:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMediaLibrary();
  };

  const handleMultipleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || uploadFile.length === 0) return;

    setLoading(true);
    setUploadProgress(0);
    try {
      const result = await MediaLibraryService.uploadMultipleMedia(
        uploadFiles,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      setMediaItems([...result.items, ...mediaItems]);

      setUploadFiles([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setShowUploadForm(false);
      setUploadProgress(0);

      const { summary, errors } = result;
      let message = `Đã tải lên ${summary.success}/${summary.total} ảnh`;

      if (errors.length > 0) {
        message += `\n\nLỗi ${errors.length} file:\n`;
        message += errors.map((e) => `- ${e.fileName}: ${e.error}`).join("\n");
      }

      alert("✅ " + message);
    } catch (error) {
      console.error("Error uploading multiple files:", error);
      alert("Lỗi tải lên: " + error.message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Vui lòng chọn một tệp hình ảnh hợp lệ.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File ảnh không được vượt quá 10MB!");
      return;
    }
    setUploadError("");
    setUploadFile(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setLoading(true);
    try {
      const newMedia = await MediaLibraryService.uploadMedia(
        uploadFile,
        uploadAltText
      );
      setMediaItems([newMedia, ...mediaItems]);
      setUploadFile(null);
      setUploadAltText("");
      setShowUploadForm(false);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }
      alert("✅ Tải ảnh lên thành công!");
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Lỗi tải lên: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (e, imageId, imagePath) => {
    e.stopPropagation();
    if (!window.confirm("Bạn có chắc chắn muốn xóa ảnh này không?")) {
      return;
    }

    setDeleteLoading(imageId);
    try {
      await MediaLibraryService.deleteMedia(imageId);
      //Xóa ảnh khỏi danh sách hiển thị
      setMediaItems((prev) => {
        const newItems = prev.filter((item) => item.getId() !== imageId);
        console.log("Media items after delete:", newItems.length);
        return newItems;
      });

      //Nếu ảnh được chọn, bỏ chọn
      if (selectedImage === imagePath) {
        setSelectedImage("");
      }

      alert("✅ Xóa ảnh thành công!");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Lỗi xóa ảnh: " + error.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSelectImage = (filePath) => {
    setSelectedImage(filePath);
  };

  const handleConfirm = () => {
    onSelect(selectedImage);
    onClose();
  };

  if (!show) return null;
  return (
    <div className="image-picker-overlay" onClick={onClose}>
      <div className="image-picker-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="image-picker-header">
          <h3>📚 Thư viện ảnh</h3>
          <button className="btn-close" onClick={onClose}>
            ❌
          </button>
        </div>

        {/* TOOLBAR */}
        <div className="image-picker-toolbar">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Tìm kiếm ảnh..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn-search">
              🔍
            </button>
          </form>
          <button
            className="btn-upload"
            onClick={() => setShowUploadForm(!showUploadForm)}
          >
            {showUploadForm ? "❌ Đóng" : "📤 Tải ảnh lên"}
          </button>
        </div>

        {/* UPLOAD FORM */}
        {showUploadForm && (
          <div className="upload-form-container">
            {/* TOGGLE UPLOAD MODE */}
            <div className="upload-mode-toggle">
              <button
                type="button"
                className={`mode-btn ${
                  uploadMode === "single" ? "active" : ""
                }`}
                onClick={() => {
                  setUploadMode("single");
                  setUploadFiles([]);
                  previewUrls.forEach((url) => URL.revokeObjectURL(url));
                  setPreviewUrls([]);
                }}
              >
                📄 Tải 1 ảnh
              </button>
              <button
                type="button"
                className={`mode-btn ${
                  uploadMode === "multiple" ? "active" : ""
                }`}
                onClick={() => {
                  setUploadMode("multiple");
                  setUploadFile(null);
                  if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl("");
                  }
                }}
              >
                📚 Tải nhiều ảnh
              </button>
            </div>

            {/* SINGLE UPLOAD FORM */}
            {uploadMode === "single" && (
              <form onSubmit={handleSingleUpload} className="upload-form">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  required
                />
                <input
                  type="text"
                  placeholder="Mô tả ảnh (tùy chọn)"
                  value={uploadAltText}
                  onChange={(e) => setUploadAltText(e.target.value)}
                />

                {previewUrl && uploadFile && (
                  <div className="upload-preview">
                    <img src={previewUrl} alt="Preview" />
                    <div className="preview-info">
                      <span>📄 {uploadFile?.name}</span>
                      <span>📊 {(uploadFile?.size / 1024).toFixed(2)} KB</span>
                    </div>
                  </div>
                )}

                <button type="submit" disabled={loading}>
                  {loading ? "Đang tải..." : "Tải lên"}
                </button>

                {uploadError && (
                  <div className="upload-error">❌ {uploadError}</div>
                )}
              </form>
            )}

            {/* MULTIPLE UPLOAD FORM */}
            {uploadMode === "multiple" && (
              <form onSubmit={handleMultipleUpload} className="upload-form">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleFilesSelect}
                  required
                />

                {uploadFiles.length > 0 && (
                  <div className="multiple-preview-info">
                    <p>
                      📊 Đã chọn {uploadFiles.length} ảnh (
                      {(
                        uploadFiles.reduce((sum, f) => sum + f.size, 0) /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB)
                    </p>
                  </div>
                )}

                {previewUrls.length > 0 && (
                  <div className="upload-preview-grid">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="preview-item">
                        <img src={url} alt={`Preview ${index + 1}`} />
                        <span className="preview-name">
                          {uploadFiles[index]?.name}
                        </span>
                        <span className="preview-size">
                          {(uploadFiles[index]?.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {loading && uploadProgress > 0 && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="progress-text">{uploadProgress}%</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || uploadFiles.length === 0}
                >
                  {loading
                    ? `Đang tải... ${uploadProgress}%`
                    : `Tải ${uploadFiles.length} ảnh lên`}
                </button>

                {uploadError && (
                  <div className="upload-error">❌ {uploadError}</div>
                )}
              </form>
            )}
          </div>
        )}

        {/* IMAGE GRID */}
        <div className="image-picker-grid">
          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : mediaItems.length === 0 ? (
            <div className="empty-state">Không có ảnh nào</div>
          ) : (
            mediaItems.map((item) => (
              <div
                key={item.id}
                className={`image-item ${
                  selectedImage === item.getFilePath() ? "selected" : ""
                }`}
                onClick={() => handleSelectImage(item.getFilePath())}
              >
                <button
                  className="btn-delete-image"
                  onClick={(e) =>
                    handleDeleteImage(e, item.getId(), item.getFilePath())
                  }
                  disabled={deleteLoading === item.getId()}
                  title="Xóa ảnh"
                >
                  {deleteLoading === item.getId() ? (
                    "⏳"
                  ) : (
                    <X className="text-white" size={24} />
                  )}
                </button>

                <img
                  src={item.getFilePath()}
                  alt={item.getFileName()}
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />

                <div className="image-info">
                  <span>{item.getFileName()}</span>
                  <span className="file-size">
                    {item.getFormattedFileSize()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {totalPage > 1 && (
          <div className="image-picker-pagination">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1 || loading}
            >
              ⬅️ Trước
            </button>
            <span>
              Trang {page} / {totalPage}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPage, page + 1))}
              disabled={page === totalPage || loading}
            >
              Sau ➡️
            </button>
          </div>
        )}

        {/* FOOTER */}
        <div className="image-picker-footer">
          <button className="btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button
            className="btn-confirm"
            onClick={handleConfirm}
            disabled={!selectedImage}
          >
            Chọn ảnh
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImagePicker;
