import News from "./news.js";
import Brand from "./product.js";

export default class NewsDetail {
  constructor(data) {
    this.id = data.id;
    this.news_id = data.news_id;
    this.product_id = data.product_id;
    this.detail = data.detail;
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
    this.product = data.product ? Brand.fromApiResponse(data.product) : null;
    this.news = data.news ? News.fromApiResponse(data.news) : null;
  }

  static fromApiResponse(data) {
    return new NewsDetail(data);
  }

  getNewsTitle() {
    return this.news?.title || "No title";
  }

  getNewsImage() {
    return this.news?.image || "/default-news.jpg";
  }

  toApiFormat() {
    return {
      product_id: this.product_id,
      news_id: this.news_id,
    };
  }
}
