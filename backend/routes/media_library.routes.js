import express from "express";
import * as MediaLibraryController from "../controllers/MediaLibraryController.js";
import asyncHandle from "../middlewares/asyncHandle.js";
import { requireRoles } from "../middlewares/jwtMiddleware.js";
import UserRole from "../constants/UserRole.js";
import uploadImageGoogleMiddleware from "../middlewares/imageGoogleUpload.js";

const route = express.Router();

route.get(
  "/",
  requireRoles([UserRole.ADMIN, UserRole.USER]),
  asyncHandle(MediaLibraryController.getMedia)
);

route.get(
  "/:id",
  requireRoles([UserRole.ADMIN, UserRole.USER]),
  asyncHandle(MediaLibraryController.getMediaById)
);

route.post(
  "/upload",
  requireRoles([UserRole.ADMIN, UserRole.USER]),
  uploadImageGoogleMiddleware.single("image"),
  asyncHandle(MediaLibraryController.uploadImage)
);

route.post(
  "/upload-multiple",
  requireRoles([UserRole.ADMIN, UserRole.USER]),
  uploadImageGoogleMiddleware.array("images", 10),
  asyncHandle(MediaLibraryController.uploadMultipleImages)
);

route.put(
  "/:id",
  requireRoles([UserRole.ADMIN]),
  asyncHandle(MediaLibraryController.updateMedia)
);

route.delete(
  "/:id",
  requireRoles([UserRole.ADMIN]),
  asyncHandle(MediaLibraryController.deleteMedia)
);

route.post(
  "/increment-usage",
  requireRoles([UserRole.ADMIN, UserRole.USER]),
  asyncHandle(MediaLibraryController.incrementUsageCount)
);

export default route;
