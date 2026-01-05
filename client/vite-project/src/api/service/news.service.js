import News from "@models/news.js";
import BaseService from "./base.service";
import api from "../index.js";
import { ENDPOINTS } from "../endpoints.js";

class NewsService extends BaseService {
  constructor() {
    super(ENDPOINTS.NEWS.BASE);
  }
  async getAll() {
    try {
      const response = await api.get(`${this.endpoint}`);
      const data = response.data;
      const newsList = data.data || data.news || data || [];

      return newsList.map((item) => News.fromApiResponse(item));
    } catch (error) {
      console.error("Error fetching news:", error);
      throw error;
    }
  }

  async getPaging({ page = 1, search = "" } = {}) {
    try {
      const params = { page, search };
      const response = await api.get(this.endpoint, { params });
      const data = response.data;

      return {
        data: (data.data || []).map((item) => News.fromApiResponse(item)),
        pagination: {
          currentPage: data.currentPage || page,
          totalPage: data.totalPage || 1,
          totalItems: data.totalNews || data.totalItems || 0,
        },
      };
    } catch (error) {
      console.error(" Error loading news paging:", error);
      throw error;
    }
  }
  async getById(id) {
    try {
      const response = await api.get(ENDPOINTS.NEWS.BY_ID(id));
      const data = response.data;

      return News.fromApiResponse(data.data || data);
    } catch (error) {
      console.error(" Error loading news detail:", error);
      throw error;
    }
  }

  async create(newsData) {
    try {
      console.log(" Đang tạo tin tức:", newsData);
      const payload = {
        title: newsData.title,
        content: newsData.content,
        image: newsData.image,
        products_ids: newsData.products_ids || [],
      };

      console.log(" Payload gửi lên server:", payload);
      const response = await api.post(this.endpoint, payload);
      const data = response.data;
      console.log(" Raw Create Response:", data);
      const newsResponse = data.data || data.news || data;
      return News?.fromApiResponse(newsResponse)
        ? News.fromApiResponse(newsResponse)
        : newsResponse;
    } catch (error) {
      console.error(" Error creating news:", error);
      throw error;
    }
  }

  async update(id, newsData) {
    try {
      const payload = {
        title: newsData.title,
        content: newsData.content,
        image: newsData.image,
      };
      const response = await api.put(ENDPOINTS.NEWS.BY_ID(id), payload);

      const data = response.data;

      const newsResponse = data.data || data.news || data;
      return News?.fromApiResponse
        ? News.fromApiResponse(newsResponse)
        : newsResponse;
    } catch (error) {
      console.error(" Error creating news:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      console.log("🔗 Đang xóa tin tức:", id);

      const response = await api.delete(`${this.endpoint}/${id}`);
      const data = response.data;

      return data.data || data.news || data;
    } catch (error) {
      console.error(" Lỗi trong delete News:", error);
      throw error;
    }
  }
}

export default new NewsService();
