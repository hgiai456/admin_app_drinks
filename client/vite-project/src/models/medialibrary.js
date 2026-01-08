class MediaLibrary {
  constructor(
    id,
    fileName = "",
    filePath = "",
    fileSize = 0,
    mimeType = "",
    width = 0,
    height = 0,
    uploadedBy = null,
    usageCount = 0,
    tags = [],
    createdAt = null,
    updatedAt = null
  ) {
    this.id = id;
    this.fileName = fileName;
    this.filePath = filePath;
    this.fileSize = fileSize;
    this.mimeType = mimeType;
    this.width = width;
    this.height = height;
    this.uploadedBy = uploadedBy;
    this.usageCount = usageCount;
    this.tags = tags;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromApiResponse(data) {
    if (!data) {
      console.error("❌ Data trống trong MediaLibrary fromApiResponse");
      return null;
    }

    console.log("📥 Parsing MediaLibrary data:", data);

    return new MediaLibrary(
      data.id,
      data.file_name || data.fileName || "",
      data.file_url || data.filePath || "",
      data.file_size || data.fileSize || 0,
      data.mime_type || data.mimeType || "",
      data.width || 0,
      data.height || 0,
      data.uploaded_by || data.uploadedBy || null,
      data.usage_count || data.usageCount || 0,
      data.tags || [],
      data.createdAt || data.created_at,
      data.updatedAt || data.updated_at
    );
  }

  toApiFormat() {
    return {
      id: this.id,
      file_name: this.fileName,
      file_url: this.filePath,
      file_size: this.fileSize,
      mime_type: this.mimeType,
      width: this.width,
      height: this.height,
      uploaded_by: this.uploadedBy,
      usage_count: this.usageCount,
      tags: this.tags,
    };
  }

  getId() {
    return this.id;
  }

  getFileName() {
    return this.fileName;
  }

  getFilePath() {
    return this.filePath; // ✅ Đây là file_url từ API
  }

  getFileSize() {
    return this.fileSize;
  }

  getFormattedFileSize() {
    const sizes = ["B", "KB", "MB", "GB"];
    if (this.fileSize === 0) return "0 B";
    const i = Math.floor(Math.log(this.fileSize) / Math.log(1024));
    return (
      Math.round((this.fileSize / Math.pow(1024, i)) * 100) / 100 +
      " " +
      sizes[i]
    );
  }

  getMimeType() {
    return this.mimeType;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getUploadedBy() {
    return this.uploadedBy;
  }

  getUsageCount() {
    return this.usageCount;
  }

  getTags() {
    return this.tags;
  }

  isImage() {
    return this.mimeType?.startsWith("image/");
  }

  setTags(tags) {
    this.tags = tags;
  }

  incrementUsageCount() {
    this.usageCount += 1;
  }

  static add(list, item) {
    return [...list, item];
  }

  static remove(list, id) {
    return list.filter((item) => item.id !== id);
  }

  static update(list, id, newData) {
    return list.map((item) =>
      item.id === id ? { ...item, ...newData } : item
    );
  }

  static findById(list, id) {
    return list.find((item) => item.id === id);
  }
}

export default MediaLibrary;
