import express from "express";
import * as CartController from "../controllers/CartController.js";
import * as CartItemController from "../controllers/CartItemController.js";
import asyncHandle from "../middlewares/asyncHandle.js";
import validate from "../middlewares/validate.js";
import InsertCartRequest from "../dtos/requests/cart/InsertCartRequest.js";
import InsertCartItemRequest from "../dtos/requests/cart_item/InserCartItemRequest.js";

const route = express.Router();

// GET /api/carts
route.get("/", asyncHandle(CartController.getCarts));
route.get("/all", asyncHandle(CartController.getAll));

// GET /api/carts/by-session
route.get("/by-session", asyncHandle(CartController.getCartBySessionId));

// GET /api/carts/user/:user_id
route.get("/user/:user_id", asyncHandle(CartController.getCartByUserId));

// GET /api/carts/:id
route.get("/:id", asyncHandle(CartController.getCartById));

// POST /api/carts
route.post(
  "/",
  validate(InsertCartRequest),
  asyncHandle(CartController.insertCart),
);

// POST /api/carts/checkout
route.post("/checkout", asyncHandle(CartController.checkoutCart));

// DELETE /api/carts/:id
route.delete("/:id", asyncHandle(CartController.deleteCart));

// DELETE /api/carts/:id/clear
route.delete("/:id/clear", asyncHandle(CartController.clearCart));

// ===== CART ITEM ROUTES =====
// GET /api/carts/items
route.get("/items/all", asyncHandle(CartItemController.getCartItems));

// GET /api/carts/items/:id
route.get("/items/:id", asyncHandle(CartItemController.getCartItemByCartId));

// GET /api/carts/items/cart/:cart_id
route.get(
  "/items/cart/:cart_id",
  asyncHandle(CartItemController.getCartItemByCartId),
);

// POST /api/carts/items
route.post(
  "/items",
  validate(InsertCartItemRequest),
  asyncHandle(CartItemController.insertCartItem),
);

// PUT /api/carts/items/:id
route.put("/items/:id", asyncHandle(CartItemController.updateCartItem));

// DELETE /api/carts/items/:id
route.delete("/items/:id", asyncHandle(CartItemController.deleteCartItem));

export default route;
