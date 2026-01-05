class Brand {
  constructor(id, name, image = null, createdAt = null, updatedAt = null) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // ✅ STATIC METHOD - fromApiResponse (giống Category và Product)
  static fromApiResponse(data) {
    if (!data) {
      console.error("❌ Data trống trong Brand fromApiResponse");
      return null;
    }

    return new Brand(
      data.id,
      data.name || "",
      data.image || null,
      data.createdAt,
      data.updatedAt
    );
  }

  // ✅ INSTANCE METHOD - toApiFormat (giống Category và Product)
  toApiFormat() {
    return {
      id: this.id,
      name: this.name,
      image: this.image,
    };
  }

  // ✅ GETTERS
  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getImage() {
    return this.image;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  // ✅ ENHANCED GETTERS - Business Logic
  getFormattedName() {
    return this.name ? this.name.trim() : "";
  }

  getImageUrl() {
    if (!this.image) return "/default-brand.png";
    if (this.image.startsWith("http")) return this.image;
    if (this.image.startsWith("/")) return this.image;
    return `/images/brands/${this.image}`;
  }

  // ✅ SETTERS
  setName(name) {
    this.name = name;
  }

  setImage(image) {
    this.image = image;
  }

  setUpdatedAt(time) {
    this.updatedAt = time;
  }

  // ✅ UTILITY METHODS
  isValid() {
    return !!(this.name && this.name.trim().length > 0);
  }

  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push("Tên thương hiệu không được trống");
    } else if (this.name.trim().length < 2) {
      errors.push("Tên thương hiệu phải có ít nhất 2 ký tự");
    } else if (this.name.length > 255) {
      errors.push("Tên thương hiệu không được dài quá 255 ký tự");
    }

    return errors;
  }
}

export default Brand;
