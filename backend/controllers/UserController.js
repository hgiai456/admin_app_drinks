import { Sequelize } from 'sequelize';
import db from '../models';
const { Op } = Sequelize;
import ResponseUser from '../dtos/responses/user/ReponseUser.js';
import argon2 from 'argon2';
import { UserRole } from '../constants'; //Hãy nhớ nếu export 1 const thì phải có ngoặc ví dụ {UserRole}
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

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

export async function registerUser(req, res) {
    //allow user register by phone and email
    //at least phone or email must be not null

    const { email, phone, password, name } = req.body;

    // 1. Kiểm tra ít nhất 1 trong 2: email hoặc phone
    if (!email && !phone) {
        return res.status(400).json({
            message: 'Phải cung cấp ít nhất email hoặc số điện thoại.'
        });
    }
    if (email) {
        const existing_user_email = await db.User.findOne({
            where: { email }
        });
        if (existing_user_email) {
            return res.status(409).json({
                message: 'Email hoặc số điện thoại đã tồn tại.'
            });
        }
    }
    if (phone) {
        const existing_user_phone = await db.User.findOne({
            where: { phone }
        });
        if (existing_user_phone) {
            return res.status(409).json({
                message: 'Email hoặc số điện thoại đã tồn tại.'
            });
        }
    }

    const hashedPassword = password ? await argon2.hash(password) : null;
    // 4. Tạo người dùng
    const user = await db.User.create({
        ...req.body,
        email,
        phone,
        name,
        password: hashedPassword,
        role: UserRole.USER
    });
    if (user) {
        return res.status(201).json({
            message: 'Đã đăng ký người dùng thành công.',
            data: new ResponseUser(user)
        });
    }

    return res.status(400).json({
        message: 'Lỗi khi thêm người dùng.'
    });
}

export async function login(req, res) {
    const { email, phone, password } = req.body;

    // 1. Kiểm tra email hoặc phone phải có ít nhất 1
    if (!email && !phone) {
        return res.status(400).json({
            message: 'Cần cung cấp email hoặc số điện thoại.'
        });
    }

    // 2. Tìm user theo email hoặc phone
    const condition = {};
    if (email) condition.email = email;
    if (phone) condition.phone = phone;

    const user = await db.User.findOne({ where: condition });

    if (!user) {
        return res.status(404).json({
            message: 'Tên hoặc mật khẩu không chính xác.'
        });
    }

    // 3. Kiểm tra mật khẩu
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
        return res.status(401).json({
            message: 'Tên hoặc mật khẩu không chính xác.'
        });
    }

    const token = jwt.sign(
        {
            id: user.id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRATION
        }
    );

    // 4. Trả về thông tin người dùng nếu hợp lệ
    return res.status(200).json({
        message: 'Đăng nhập thành công.',
        data: {
            user: new ResponseUser(user),
            token
        }
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
