import { required, when } from 'joi';
import db from '../models';
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
        message: 'Lấy danh sách giỏ hàng thành công.',
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
            as: 'cart_items',
            include: [
                {
                    model: db.ProDetail,
                    as: 'prodetail'
                }
            ]
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
    const { session_id, user_id } = req.body;

    if ((session_id && user_id) || (!session_id && user_id)) {
        return res.status(400).json({
            message:
                'Chỉ được cung cấp một giá trị trong session_id hoặc user_id, không được có đồng thời và ngược lại. ',
            data: cart
        });
    }
    const existingCart = await db.Cart.findOne({
        where: {
            [Op.or]: [
                { session_id: session_id ? session_id : null },
                { user_id: user_id ? user_id : null }
            ]
        }
    });
    if (existingCart) {
        return res.status(409).json({
            message: 'Một giỏ hàng với cùng session đã tồn tại .'
        });
    }
    const cart = await db.Cart.create(req.body);
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

export async function checkoutCart(req, res) {
    const { cart_id, total, note, phone, address } = req.body;

    const transaction = await db.sequelize.transaction();

    try {
        // 1. Kiểm tra giỏ hàng
        const cart = await db.Cart.findByPk(cart_id, {
            include: {
                model: db.CartItem,
                as: 'cart_items',
                include: [
                    {
                        model: db.ProDetail,
                        as: 'prodetail'
                    }
                ]
            }
        });

        if (!cart || !cart.cart_items.length) {
            return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
        }

        // 3. Tạo đơn hàng mới
        const newOrder = await db.Order.create(
            {
                session_id: cart.session_id,
                user_id: cart.user_id,
                total:
                    total ||
                    cart.cart_items.reduce(
                        (acc, item) =>
                            acc + item.quantity * item.prodetail.price,
                        0
                    ),
                note: note,
                phone: phone,
                address: address
            },
            {
                transaction: transaction,
                timestamps: false
            }
        );

        // 4. Thêm cart items to order_details
        for (let item of cart.cart_items) {
            await db.OrderDetail.create(
                {
                    order_id: newOrder.id,
                    product_detail_id: item.product_detail_id,
                    quantity: item.quantity,
                    price: item.prodetail.price
                },
                {
                    transaction: transaction,
                    timestamps: false
                }
            );
        }

        // 5. Xóa cart và cart_items
        await db.CartItem.destroy(
            {
                where: { cart_id: cart.id }
            },
            { transaction: transaction }
        );
        await cart.destroy({ transaction: transaction });

        await transaction.commit();
        return res.status(201).json({
            message: 'Thanh toán giỏ hàng thành công',
            data: newOrder
        });
    } catch (error) {
        await transaction.rollback();
        return res
            .status(500)
            .json({ message: 'Lỗi khi thanh toán', error: error.message });
    }
}

// export async function checkoutCart(req, res) {
//     const { cart_id, total, note } = req.body;
//     //check if Cart with cart_id exists, and cart_id.cart_items must NOT blank
//     //Insert session_id, user_id to db.Order
//     //After inserted, get order_id
//     //Insert cart_items to order_details, with order_id above
//     //if(total == null) then calculate using prodetail.price*quantity
//     //detele carts and cart_items above
//     //if any of these steps failed, rollback
// }

export async function deleteCart(req, res) {
    const { id } = req.params;

    const deleted = await db.Cart.destroy({ where: { id } });

    if (deleted) {
        return res.status(200).json({ message: 'Xóa giỏ hàng thành công' });
    }

    return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
}
