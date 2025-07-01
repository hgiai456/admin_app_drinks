import { Sequelize, where } from 'sequelize';
import db from '../models/index.js';
import InsertOrderRequest from '../dtos/requests/order/InsertOrderRequest.js';
const { Op } = Sequelize;

export async function getOrders(req, res) {
    const { search = '', page = 1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    let whereClause = {};
    if (search.trim() !== '') {
        whereClause = {
            [Op.or]: [
                { phone: { [Op.like]: `%${search}%` } },
                { address: { [Op.like]: `%${search}%` } }
            ]
        };
    }

    const [orders, totalOrders] = await Promise.all([
        db.Order.findAll({
            where: whereClause,
            limit: pageSize,
            offset: offset
        }),
        db.Order.count({
            where: whereClause
        })
    ]);

    res.status(200).json({
        message: 'Lấy danh sách sản phẩm thành công',
        data: orders,
        currentPage: parseInt(page, 10),
        totalPage: Math.ceil(totalOrders / pageSize), //ceil(11 / 5) = 2.1 => 3 (Lam tron)
        totalOrders
    });
}
export async function getOrderById(req, res) {
    const { id } = req.params;
    const order = await db.Order.findByPk(id); // Tìm đơn hàng theo ID

    if (!order) {
        return res.status(404).json({
            message: 'Đơn hàng không tìm thấy.'
        });
    }

    res.status(200).json({
        message: 'Lấy thông tin đơn hàng thành công.',
        data: order
    });
}

export async function insertOrder(req, res) {
    // Kiểm tra user có tồn tại không
    const user = await db.User.findOne({
        where: { id: req.body.user_id }
    });

    if (!user) {
        return res.status(404).json({
            message: 'Người dùng không tồn tại.'
        });
    }

    // Kiểm tra dữ liệu đầu vào
    const { error } = InsertOrderRequest.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: 'Lỗi khi thêm đơn hàng.',
            error
        });
    }

    // Tạo đơn hàng
    db.Order.create(req.body)
        .then((order) => {
            res.status(201).json({
                message: 'Thêm mới đơn hàng thành công.',
                data: order
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Đã xảy ra lỗi khi thêm đơn hàng.',
                error: err.message
            });
        });
}

export async function updateOrder(req, res) {
    const { id } = req.params;

    const [updated] = await db.Order.update(req.body, { where: { id } });

    if (updated) {
        const updatedOrder = await db.Order.findByPk(id);
        return res.status(200).json({
            message: 'Cập nhật đơn hàng thành công.',
            data: updatedOrder
        });
    } else {
        return res.status(404).json({
            message: 'Đơn hàng không tìm thấy.'
        });
    }
}

export async function deleteOrder(req, res) {
    const { id } = req.params;
    const deleted = await db.Order.destroy({ where: { id } });

    if (deleted) {
        return res.status(200).json({
            message: 'Xóa đơn hàng thành công.'
        });
    } else {
        return res.status(404).json({
            message: 'Đơn hàng không tìm thấy.'
        });
    }
}
