import express from 'express';
import * as CartItemController from '../controllers/CartItemController.js';
import asyncHandle from '../middlewares/asyncHandle.js';
import validate from '../middlewares/validate.js';
import InsertCartItemRequest from '../dtos/requests/cart_item/InserCartItemRequest.js';

const route = express.Router();
 route.get('/', asyncHandle(CartItemController.getCartItems)); // Lấy danh sách item theo cart_id
    route.get(
        '/:id',
        asyncHandle(CartItemController.getCartItemByCartId)
    ); // Lấy item theo ID
    route.get(
        '/carts/:cart_id',
        asyncHandle(CartItemController.getCartItemByCartId)
    );
    route.post(
        '/',
        validate(InsertCartItemRequest),
        asyncHandle(CartItemController.insertCartItem)
    ); // Thêm item vào giỏ
    route.put(
        '/:id',
        asyncHandle(CartItemController.updateCartItem)
    ); // Cập nhật số lượng item
    route.delete(
        '/:id',
        asyncHandle(CartItemController.deleteCartItem)
    ); // Xoá item khỏi giỏ
export default route;