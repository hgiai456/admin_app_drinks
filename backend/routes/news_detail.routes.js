import express from "express";
import * as NewsDetailController from "../controllers/NewsDetailController.js";
import asyncHandle from "../middlewares/asyncHandle.js";
import { requireRoles } from "../middlewares/jwtMiddleware.js";
import UserRole from "../constants/UserRole.js";
import InsertNewsDetailRequest from "../dtos/requests/news_detail/InsertNewsDetailRequest.js";
import validate from "../middlewares/validate.js";

const route = express.Router();

// GET /api/news-details - Lấy danh sách liên kết tin tức - sản phẩm (có phân trang)
route.get("/", asyncHandle(NewsDetailController.getNewsDetails));

// GET /api/news-details/:id - Lấy chi tiết 1 liên kết
route.get("/:id", asyncHandle(NewsDetailController.getNewsDetailById));

// ===== ADMIN ROUTES =====
// POST /api/news-details - Thêm liên kết tin tức - sản phẩm
route.post(
  "/",
  requireRoles([UserRole.ADMIN]),
  validate(InsertNewsDetailRequest),
  asyncHandle(NewsDetailController.insertNewsDetail)
);

// PUT /api/news-details/:id - Cập nhật liên kết
route.put(
  "/:id",
  requireRoles([UserRole.ADMIN]),
  asyncHandle(NewsDetailController.updateNewsDetail)
);

// DELETE /api/news-details/:id - Xóa liên kết
route.delete(
  "/:id",
  requireRoles([UserRole.ADMIN]),
  asyncHandle(NewsDetailController.deleteNewsDetail)
);

export default route;
