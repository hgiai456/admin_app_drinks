import { when } from 'joi';
import db from '../models/index.js';
import { Sequelize } from 'sequelize';
const { Op } = Sequelize;

export async function getCarts(req, res) {
    const { search = '', page = 1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    let whereClause = {};
    if (search.trim()) {
        whereClause = {
            session_id: { [Op.like]: `%${search.trim()}%` }
        };
    }

    const [carts, totalCarts] = await Promise.all([
        db.Cart.findAll({
            where: whereClause,
            include: {
                model: db.CartItem,
                as: 'cart_items'
            },
            limit: pageSize,
            offset
        }),
        db.Cart.count({ where: whereClause })
    ]);

    res.status(200).json({
        message: 'Lấy danh sách giỏ hàng thành công',
        data: carts,
        currentPage: parseInt(page),
        totalPage: Math.ceil(totalCarts / pageSize),
        totalCarts
    });
}

export async function getCartById(req, res) {
    const { id } = req.params;
    const cart = await db.Cart.findByPk(id, {
        include: {
            model: db.CartItem,
            include: db.ProDetail
        }
    });

    if (!cart) {
        return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
    }

    res.status(200).json({
        message: 'Lấy thông tin giỏ hàng thành công',
        data: cart
    });
}

export async function insertCart(req, res) {
    const cart = await db.Cart.create(req.body);
    const { session_id } = req.body;

    const existingCart = await db.Cart.findOne({
        where: { session_id }
    });
    if (existingCart) {
        return res.status(409).json({
            message: 'Một giỏ hàng với cùng session đã tồn tại .',
            data: cart
        });
    }
    if (cart) {
        return res.status(201).json({
            message: 'Thêm giỏ hàng thành công',
            data: cart
        });
    }

    return res.status(400).json({
        message: 'Thêm giỏ hàng thất bại'
    });
}

export async function addCartItem(req, res) {
    const { cart_id, product_detail_id, quantity } = req.body;

    const cart = await db.Cart.findByPk(cart_id);
    if (!cart)
        return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });

    const item = await db.CartItem.create({
        cart_id,
        product_detail_id,
        quantity
    });

    if (item) {
        return res.status(201).json({
            message: 'Thêm sản phẩm vào giỏ thành công',
            data: item
        });
    }

    return res.status(400).json({
        message: 'Thêm sản phẩm vào giỏ thất bại'
    });
}

export async function deleteCart(req, res) {
    const { id } = req.params;

    const deleted = await db.Cart.destroy({ where: { id } });

    if (deleted) {
        return res.status(200).json({ message: 'Xóa giỏ hàng thành công' });
    }

    return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
}
