import express from "express";
import * as NewsController from "../controllers/NewsController.js";
import asyncHandle from "../middlewares/asyncHandle.js";
import { requireRoles } from "../middlewares/jwtMiddleware.js";
import UserRole from "../constants/UserRole.js";
import validateImageExists from "../middlewares/validateImageExists.js";
import validate from "../middlewares/validate.js";
import InsertNewsRequest from "../dtos/requests/news/InsertNewsRequest.js";

const route = express.Router();

route.get("/", asyncHandle(NewsController.getNewsArticles));
route.get("/all", asyncHandle(NewsController.getAllNewsArticles));
route.get("/:id", asyncHandle(NewsController.getNewsArticleById));
route.post(
  "/",
  requireRoles([UserRole.ADMIN]),
  validate(InsertNewsRequest),
  validateImageExists,
  asyncHandle(NewsController.insertNewsArticle)
);
route.put(
  "/:id",
  requireRoles([UserRole.ADMIN]),
  validateImageExists,
  asyncHandle(NewsController.updateNews)
);
route.delete(
  "/:id",
  requireRoles([UserRole.ADMIN]),
  asyncHandle(NewsController.deleteNews)
);

export default route;
