import { Sequelize, where } from 'sequelize';
import db from '../models/index.js';
const { Op } = Sequelize;
import ResponseUser from '../dtos/responses/user/ReponseUser.js';
import argon2 from 'argon2';
// Lấy danh sách người dùng với tìm kiếm và phân trang
export async function getUsers(req, res) {
    const { search = '', page = 1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    let whereClause = {};
    if (search.trim() !== '') {
        whereClause = {
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ]
        };
    }

    const [users, totalUsers] = await Promise.all([
        db.User.findAll({
            where: whereClause,
            limit: pageSize,
            offset: offset
        }),
        db.User.count({
            where: whereClause
        })
    ]);

    res.status(200).json({
        message: 'Lấy danh sách người dùng thành công',
        data: users,
        currentPage: parseInt(page, 10),
        totalPage: Math.ceil(totalUsers / pageSize),
        totalUsers
    });
}

// Lấy người dùng theo ID
export async function getUserById(req, res) {
    const { id } = req.params;
    const user = await db.User.findByPk(id);

    if (!user) {
        return res.status(404).json({
            message: 'Người dùng không tìm thấy'
        });
    }

    res.status(200).json({
        message: 'Lấy thông tin người dùng thành công.',
        data: user
    });
}

// Thêm người dùng mới
export async function insertUser(req, res) {
    //Kiểm tra email đã tồn tại chưa
    const existingUser = await db.User.findOne({
        where: { email: req.body.email }
    });
    if (existingUser) {
        return res.status(409).json({
            message: 'Email đã tồn tại.'
        });
    }
    const hashedPassword = await argon2.hash('password');
    const user = await db.User.create({
        ...req.body,
        password: hashedPassword
    });
    if (user) {
        return res.status(201).json({
            message: 'Thêm mới người dùng thành công.',
            data: new ResponseUser(user)
        });
    }

    return res.status(400).json({
        message: 'Lỗi khi thêm người dùng.'
    });
}

// Cập nhật người dùng
export async function updateUser(req, res) {
    const { id } = req.params;

    const [updated] = await db.User.update(req.body, {
        where: { id }
    });

    if (updated) {
        return res.status(200).json({
            message: 'Cập nhật người dùng thành công.'
        });
    } else {
        return res.status(404).json({
            message: 'Người dùng không tìm thấy.'
        });
    }
}

// Xoá người dùng
export async function deleteUser(req, res) {
    const { id } = req.params;
    const deleted = await db.User.destroy({ where: { id } });

    if (deleted) {
        return res.status(200).json({
            message: 'Xóa người dùng thành công.'
        });
    } else {
        return res.status(404).json({
            message: 'Người dùng không tìm thấy.'
        });
    }
}
