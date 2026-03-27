// banner.service.js

import api from "../index.js";
import BaseService from "./base.service.js";
import { ENDPOINTS } from "../endpoints.js";

class BannerService extends BaseService {
  constructor() {
    super(ENDPOINTS.BANNERS.BASE);
  }
  //  Get with pagination
  async getPaging(params = { page: 1, search: "" }) {
    try {
      const response = await api.get(this.endpoint, { params });
      return response.data;
    } catch (error) {
      return new Error(
        "Lỗi khi tải danh sách banner phân trang: " + error.message,
      );
    }
  }
}

export default new BannerService();
