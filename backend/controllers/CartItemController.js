import db from '../models/index.js';
import { Sequelize } from 'sequelize';
const { Op } = Sequelize;

export async function getCartItems(req, res) {
    const { cart_id } = req.query;

    let whereClause = {};
    if (cart_id) {
        whereClause.cart_id = cart_id;
    }

    const items = await db.CartItem.findAll({
        where: whereClause,
        include: db.ProDetail
    });

    res.status(200).json({
        message: 'Lấy danh sách sản phẩm trong giỏ hàng thành công',
        data: items
    });
}

export async function getCartItemById(req, res) {
    const { id } = req.params;

    const item = await db.CartItem.findByPk(id, {
        include: db.ProDetail
    });

    if (!item) {
        return res.status(404).json({
            message: 'Không tìm thấy sản phẩm trong giỏ hàng'
        });
    }

    res.status(200).json({
        message: 'Lấy sản phẩm trong giỏ hàng thành công',
        data: item
    });
}

export async function insertCartItem(req, res) {
    const { cart_id, product_detail_id, quantity } = req.body;

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

export async function updateCartItem(req, res) {
    const { id } = req.params;
    const { quantity } = req.body;

    const [updated] = await db.CartItem.update({ quantity }, { where: { id } });

    if (updated) {
        return res.status(200).json({
            message: 'Cập nhật số lượng sản phẩm thành công'
        });
    }

    return res.status(404).json({
        message: 'Không tìm thấy sản phẩm trong giỏ hàng'
    });
}

export async function deleteCartItem(req, res) {
    const { id } = req.params;

    const deleted = await db.CartItem.destroy({ where: { id } });

    if (deleted) {
        return res.status(200).json({
            message: 'Xóa sản phẩm khỏi giỏ hàng thành công'
        });
    }

    return res.status(404).json({
        message: 'Không tìm thấy sản phẩm trong giỏ hàng'
    });
}
