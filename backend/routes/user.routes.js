import express from "express";
import * as UserController from "../controllers/UserController.js";
import asyncHandle from "../middlewares/asyncHandle.js";
import { requireRoles } from "../middlewares/jwtMiddleware.js";
import UserRole from "../constants/UserRole.js";

const route = express.Router();

// GET /api/users
route.get("/", asyncHandle(UserController.getUsers));
route.get("/all", asyncHandle(UserController.getAllUsers));
// GET /api/users/:id
route.get("/:id", asyncHandle(UserController.getUserById));

// PUT /api/users/:id
route.put("/:id", asyncHandle(UserController.updateUser));

// DELETE /api/users/:id
route.delete(
  "/:id",
  requireRoles([UserRole.ADMIN]),
  asyncHandle(UserController.deleteUser),
);

export default route;
