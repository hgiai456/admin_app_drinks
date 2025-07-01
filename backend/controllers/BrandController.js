import { Sequelize } from 'sequelize';
import db from '../models/index.js';
const { Op } = Sequelize;

export async function getBrands(req, res) {
    const { search = '', page = 1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    let whereClause = {};
    if (search.trim() !== '') {
        whereClause = {
            [Op.or]: [{ name: { [Op.like]: `%${search}%` } }]
        };
    }

    const [brands, totalBrands] = await Promise.all([
        db.Brand.findAll({
            where: whereClause,
            limit: pageSize,
            offset: offset
        }),
        db.Brand.count({
            where: whereClause
        })
    ]);

    res.status(200).json({
        message: 'Lấy danh sách thương hiệu thành công',
        data: brands,
        currentPage: parseInt(page, 10),
        totalPage: Math.ceil(totalBrands / pageSize),
        totalBrands
    });
}

export async function getBrandById(req, res) {
    const { id } = req.params;
    const brand = await db.Brand.findByPk(id);

    if (!brand) {
        return res.status(404).json({
            message: 'Không tìm thấy thương hiệu !'
        });
    }

    res.status(200).json({
        message: 'Lấy thông tin thương hiệu thành công.',
        data: brand
    });
}

export async function insertBrand(req, res) {
    const { name } = req.body;

    const existingBrandName = await db.Brand.findOne({
        where: { name: name.trim() }
    });
    if (existingBrandName) {
        return res.status(400).json({
            message: 'Tên thương hiệu trùng. Vui lòng nhập lại tên thương hiệu.'
        });
    }

    const brand = await db.Brand.create(req.body);
    if (brand) {
        return res.status(201).json({
            message: 'Thêm mới thương hiệu thành công.',
            data: brand
        });
    }
    return res.status(400).json({
        message: 'Thêm thương hiệu không thành công.',
        data: brand
    });
}

export async function updateBrand(req, res) {
    const { id } = req.params;
    const { name, image } = req.body;

    if (name !== undefined) {
        const existingBrandName = await db.Brand.findOne({
            where: { name: name.trim(), id: { [Op.ne]: id } }
        });
        if (existingBrandName) {
            return res.status(400).json({
                message:
                    'Tên thương hiệu trùng. Vui lòng nhập lại tên thương hiệu.'
            });
        }
    }

    const [updatedBrand] = await db.Brand.update(
        {
            name: name?.trim(),
            image: image
        },
        {
            where: { id }
        }
    );

    if (updatedBrand) {
        return res.status(200).json({
            message: 'Cập nhật thương hiệu thành công'
        });
    }

    return res.status(404).json({
        message: 'Không tìm thấy thương hiệu'
    });
}

export async function deleteBrand(req, res) {
    const { id } = req.params;

    const deleted = await db.Brand.destroy({
        where: { id }
    });

    if (deleted) {
        return res.status(200).json({
            message: 'Xóa thương hiệu thành công'
        });
    }

    return res.status(404).json({
        message: 'Không tìm thấy thương hiệu'
    });
}
