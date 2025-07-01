import { Sequelize } from 'sequelize';
import db from '../models/index.js';
const { Op } = Sequelize;

export async function getSizes(req, res) {
    const { search = '', page = 1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    let whereClause = {};
    if (search.trim() !== '') {
        whereClause = {
            [Op.or]: [{ name: { [Op.like]: `%${search}%` } }]
        };
    }

    const [sizes, totalSizes] = await Promise.all([
        db.Size.findAll({
            where: whereClause,
            limit: pageSize,
            offset: offset
        }),
        db.Size.count({
            where: whereClause
        })
    ]);

    res.status(200).json({
        message: 'Lấy danh sách size thành công',
        data: sizes,
        currentPage: parseInt(page, 10),
        totalPage: Math.ceil(totalSizes / pageSize),
        totalSizes
    });
}

export async function getSizeById(req, res) {
    try {
        const { id } = req.params;
        const size = await db.Size.findByPk(id);

        if (!size) {
            return res.status(404).json({
                message: 'Không tìm thấy kích thước'
            });
        }

        res.status(200).json({
            message: 'Lấy thông tin kích thước thành công',
            data: size
        });
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi khi lấy kích thước',
            error: error.message
        });
    }
}

export async function insertSize(req, res) {
    try {
        const size = await db.Size.create(req.body);
        res.status(201).json({
            message: 'Thêm kích thước thành công',
            data: size
        });
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi khi thêm kích thước',
            error: error.message
        });
    }
}

export async function updateSize(req, res) {
    const { id } = req.params;
    try {
        const size = await db.Size.findByPk(id);
        if (!size) {
            return res.status(404).json({ message: 'Size không tìm thấy' });
        }
        await size.update(req.body);
        res.status(200).json({
            message: 'Cập nhật size thành công.',
            data: size
        });
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi khi cập nhật size',
            errors: [error.message]
        });
    }
}

/**
 * DELETE /sizes/:id
 * Xoá size theo ID
 */
export async function deleteSize(req, res) {
    const { id } = req.params;
    try {
        const size = await db.Size.findByPk(id);
        if (!size) {
            return res.status(404).json({ message: 'Size không tìm thấy' });
        }
        await size.destroy();
        res.status(200).json({ message: 'Xóa size thành công.' });
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi khi xóa size',
            errors: [error.message]
        });
    }
}
