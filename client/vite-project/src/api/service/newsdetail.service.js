import api from "../index.js";
import { ENDPOINTS } from "../endpoints.js";
import NewsDetail from "@models/newsdetail.js";
import BaseService from "./base.service.js";

class NewsDetailService extends BaseService {
  constructor() {
    super(ENDPOINTS.NEWSDETAILS.BASE); // "/news-details"
  }

  async getAll() {
    try {
      console.log(" Fetching all news-details");

      const response = await api.get(this.endpoint);
      const data = response.data;

      const newsDetails = data.data || [];

      return newsDetails.map((item) => NewsDetail.fromApiResponse(item));
    } catch (error) {
      console.error(" Error loading news-details:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      console.log(" Fetching news-detail by ID:", id);

      const response = await api.get(`${this.endpoint}/${id}`);
      const data = response.data;

      return NewsDetail.fromApiResponse(data.data || data);
    } catch (error) {
      console.error(" Error loading news-detail by ID:", error);
      throw error;
    }
  }

  async create(newsDetailData) {
    try {
      console.log(" Creating news-detail:", newsDetailData);

      const response = await api.post(this.endpoint, newsDetailData);
      const data = response.data;

      console.log(" News-detail created:", data);

      return NewsDetail.fromApiResponse(data.data || data);
    } catch (error) {
      console.error(" Error creating news-detail:", error);
      throw error;
    }
  }

  async update(id, newsDetailData) {
    try {
      console.log("🔗 Updating news-detail:", id, newsDetailData);

      const response = await api.put(`${this.endpoint}/${id}`, newsDetailData);
      const data = response.data;

      console.log(" News-detail updated:", data);

      return NewsDetail.fromApiResponse(data.data || data);
    } catch (error) {
      console.error(" Error updating news-detail:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      console.log("🔗 Deleting news-detail:", id);

      const response = await api.delete(`${this.endpoint}/${id}`);
      const data = response.data;

      console.log(" News-detail deleted:", data);

      return data.data || data;
    } catch (error) {
      console.error(" Error deleting news-detail:", error);
      throw error;
    }
  }

  async getByNewsId(newsId) {
    try {
      console.log(" Fetching news-details by news_id:", newsId);

      const allDetails = await this.getAll();
      return allDetails.filter((detail) => detail.news_id === newsId);
    } catch (error) {
      console.error(" Error loading news-details by news_id:", error);
      throw error;
    }
  }

  async getByProductId(productId) {
    try {
      console.log(" Fetching news-details by product_id:", productId);

      const allDetails = await this.getAll();
      return allDetails.filter((detail) => detail.product_id === productId);
    } catch (error) {
      console.error(" Error loading news-details by product_id:", error);
      throw error;
    }
  }
}

export default new NewsDetailService();
