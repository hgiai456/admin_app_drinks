import db from '../models';
import { Sequelize } from 'sequelize';
import { OrderStatus } from '../constants';
import EmailService from '../services/EmailService';
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
                    as: 'product_details',
                    include: [
                        {
                            model: db.Product,
                            as: 'product'
                        }
                    ]
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

// Tìm giỏ hàng theo user_id
export async function getCartByUserId(req, res) {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({
                message: 'Vui lòng cung cấp user_id'
            });
        }

        const cart = await db.Cart.findOne({
            where: { user_id },
            include: [
                {
                    model: db.CartItem,
                    as: 'cart_items',
                    include: [
                        {
                            model: db.ProDetail,
                            as: 'product_details',
                            include: [
                                {
                                    model: db.Product,
                                    as: 'product',
                                    attributes: ['id', 'name', 'image']
                                },
                                {
                                    model: db.Size,
                                    as: 'sizes',
                                    attributes: ['id', 'name']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!cart) {
            return res.status(404).json({
                message: 'Không tìm thấy giỏ hàng cho user này'
            });
        }

        // Calculate total amount
        const totalAmount = cart.cart_items.reduce((total, item) => {
            return total + item.quantity * item.product_details.price;
        }, 0);

        res.status(200).json({
            message: 'Lấy giỏ hàng theo user thành công',
            data: {
                ...cart.toJSON(),
                totalAmount,
                totalItems: cart.cart_items.length
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi khi lấy giỏ hàng',
            error: error.message
        });
    }
}
export async function insertCart(req, res) {
    try {
        const { session_id, user_id } = req.body;

        // Validation: chỉ được có 1 trong 2
        if ((session_id && user_id) || (!session_id && !user_id)) {
            return res.status(400).json({
                message:
                    'Chỉ được cung cấp một giá trị trong session_id hoặc user_id, không được có đồng thời và ngược lại.'
            });
        }

        // Logic kiểm tra đúng
        let whereClause = {};
        if (session_id) {
            whereClause.session_id = session_id;
        }
        if (user_id) {
            whereClause.user_id = user_id;
        }

        const existingCart = await db.Cart.findOne({
            where: whereClause
        });

        if (existingCart) {
            return res.status(409).json({
                message: session_id
                    ? 'Một giỏ hàng với cùng session_id đã tồn tại'
                    : 'Một giỏ hàng với cùng user_id đã tồn tại'
            });
        }

        const cart = await db.Cart.create(req.body);

        return res.status(201).json({
            message: 'Thêm giỏ hàng thành công',
            data: cart
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi khi tạo giỏ hàng',
            error: error.message
        });
    }
}

export async function checkoutCart(req, res) {
    const { cart_id, total, note, phone, address, user_id } = req.body;

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
                        as: 'product_details'
                    }
                ]
            }
        });

        if (!cart || !cart.cart_items.length) {
            return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
        }

        const user = await db.User.findByPk(user_id);
        if (!user) {
            return res
                .status(404)
                .json({ message: 'Người dùng không tồn tại' });
        }
        // 3. Tạo đơn hàng mới
        const newOrder = await db.Order.create(
            {
                session_id: cart.session_id,
                user_id: user_id,
                total:
                    total ||
                    cart.cart_items.reduce(
                        (acc, item) =>
                            acc + item.quantity * item.product_details.price,
                        0
                    ),
                note: note,
                status: OrderStatus.PENDING,
                phone: phone,
                address: address
            },
            {
                transaction: transaction,
                timestamps: false
            }
        );

        // 4. Thêm cart items to order_details
        const orderDetails = [];
        for (let item of cart.cart_items) {
            const orderDetail = await db.OrderDetail.create(
                {
                    order_id: newOrder.id,
                    product_detail_id: item.product_detail_id,
                    quantity: item.quantity,
                    price: item.product_details.price
                },
                {
                    transaction: transaction,
                    timestamps: false
                }
            );

            orderDetails.push({
                ...orderDetail.toJSON(),
                product_details: item.product_details
            });
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

        EmailService.sendOrderConfirmation(user.email, {
            order: newOrder,
            user: user,
            orderDetails: orderDetails
        }).catch((error) => {
            console.error('Email sending failed:', error);
        });

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

// Xóa toàn bộ cart items trong giỏ hàng nhưng giữ lại cart
export async function clearCart(req, res) {
    try {
        const { id } = req.params;

        // Tìm cart
        const cart = await db.Cart.findByPk(id, {
            include: {
                model: db.CartItem,
                as: 'cart_items'
            }
        });

        if (!cart) {
            return res.status(404).json({
                message: 'Không tìm thấy giỏ hàng'
            });
        }

        if (!cart.cart_items || cart.cart_items.length === 0) {
            return res.status(200).json({
                message: 'Giỏ hàng đã rỗng',
                data: cart
            });
        }

        // Xóa tất cả cart_items
        await db.CartItem.destroy({
            where: { cart_id: cart.id }
        });

        return res.status(200).json({
            message: 'Xóa toàn bộ sản phẩm trong giỏ hàng thành công',
            data: { ...cart.toJSON(), cart_items: [] }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi khi xóa sản phẩm trong giỏ hàng',
            error: error.message
        });
    }
}

export async function deleteCart(req, res) {
    const { id } = req.params;

    const deleted = await db.Cart.destroy({ where: { id } });

    if (deleted) {
        return res.status(200).json({ message: 'Xóa giỏ hàng thành công' });
    }

    return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
}
