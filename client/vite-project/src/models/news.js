export default class News {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.image = data.image || null;
    this.product_ids = data.product_ids || [];
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
  }
  //Chuyển từ data API => instance của News
  static fromApiResponse(data) {
    return new News({
      ...data,
      product_ids: data.product_ids || [],
    });
  }
  //Chuyển từ instance của News => data API
  toApiFormat() {
    return {
      title: this.title,
      image: this.image,
      content: this.content,
      product_ids: this.product_ids || [],
    };
  }
  getFormattedDate() {
    if (!this.createdAt) return "-";
    return this.createdAt.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  //Get excerpt (đoạn trích)
  getExcerpt(length = 150) {
    if (this.content.length <= length) return this.content;
    return this.content.substring(0, length) + "...";
  }

  validate() {
    const errors = {};

    if (!this.title || this.title.trim() === "") {
      errors.title = "Tiêu đề không được để trống";
    } else if (this.title.length < 10) {
      errors.title = "Tiêu đề phải có ít nhất 10 ký tự";
    } else if (this.title.length > 200) {
      errors.title = "Tiêu đề không được quá 200 ký tự";
    }

    if (!this.content || this.content.trim() === "") {
      errors.content = "Nội dung không được để trống";
    } else if (this.content.length < 50) {
      errors.content = "Nội dung phải có ít nhất 50 ký tự";
    }

    if (this.image && !this.isValidUrl(this.image)) {
      errors.image = "URL hình ảnh không hợp lệ";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
}
