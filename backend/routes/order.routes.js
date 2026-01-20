import express from "express";
import * as OrderController from "../controllers/OrderController.js";
import * as OrderDetailController from "../controllers/OrderDetailController.js";
import asyncHandle from "../middlewares/asyncHandle.js";
import { requireRoles } from "../middlewares/jwtMiddleware.js";
import UserRole from "../constants/UserRole.js";

const route = express.Router();

// ===== ORDER ROUTES =====
// GET /api/orders
route.get("/", asyncHandle(OrderController.getOrders));
route.get("/all", asyncHandle(OrderController.getAll)); // Lấy tất cả đơn hàng (dùng cho Dashboard)

// GET /api/orders/user/:user_id
route.get("/user/:user_id", asyncHandle(OrderController.getOrdersByUserId));

// GET /api/orders/:id
route.get("/:id", asyncHandle(OrderController.getOrderById));

// PUT /api/orders/:id
route.put(
  "/:id",
  requireRoles([UserRole.ADMIN]),
  asyncHandle(OrderController.updateOrder),
);

// DELETE /api/orders/:id
route.delete(
  "/:id",
  requireRoles([UserRole.ADMIN]),
  asyncHandle(OrderController.deleteOrder),
);

// ===== ORDER DETAIL ROUTES =====
// GET /api/orders/details
route.get("/details/all", asyncHandle(OrderDetailController.getOrderDetails));

// GET /api/orders/details/:id
route.get(
  "/details/:id",
  asyncHandle(OrderDetailController.getOrderDetailById),
);

// POST /api/orders/details
route.post(
  "/details",
  requireRoles([UserRole.ADMIN]),
  asyncHandle(OrderDetailController.insertOrderDetail),
);

// PUT /api/orders/details/:id
route.put("/details/:id", asyncHandle(OrderDetailController.updateOrderDetail));

// DELETE /api/orders/details/:id
route.delete(
  "/details/:id",
  requireRoles([UserRole.ADMIN]),
  asyncHandle(OrderDetailController.deleteOrderDetail),
);

export default route;
