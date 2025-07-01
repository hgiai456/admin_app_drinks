import { Sequelize } from 'sequelize';
import db from '../models/index.js';
const { Op } = Sequelize;

// Lấy danh sách banner detail (phân trang + tìm kiếm)
export async function getBannerDetails(req, res) {
    const { search = '', page = 1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    let whereClause = {};
    if (search.trim() !== '') {
        whereClause = {
            [Op.or]: [
                { product_id: { [Op.like]: `%${search}%` } },
                { banner_id: { [Op.like]: `%${search}%` } }
            ]
        };
    }

    const [bannerDetails, totalBannerDetails] = await Promise.all([
        db.BannerDetail.findAll({
            where: whereClause,
            limit: pageSize,
            offset: offset
        }),
        db.BannerDetail.count({
            where: whereClause
        })
    ]);

    res.status(200).json({
        message: 'Lấy danh sách banner detail thành công',
        data: bannerDetails,
        currentPage: parseInt(page, 10),
        totalPage: Math.ceil(totalBannerDetails / pageSize),
        totalBannerDetails
    });
}

// Lấy banner detail theo ID
export async function getBannerDetailById(req, res) {
    const { id } = req.params;
    const bannerDetail = await db.BannerDetail.findByPk(id);

    if (!bannerDetail) {
        return res.status(404).json({
            message: 'Không tìm thấy banner detail'
        });
    }

    res.status(200).json({
        message: 'Lấy thông tin banner detail thành công',
        data: bannerDetail
    });
}

// Thêm mới banner detail
export async function insertBannerDetail(req, res) {
    // Kiểm tra product_id có tồn tại không
    const { product_id, banner_id } = req.body;

    const productExists = await db.Product.findByPk(product_id);
    if (!productExists) {
        return res.status(404).json({
            message: `Không tìm thấy sản phẩm với ID: ${product_id}`
        });
    }

    const bannerExists = await db.Banner.findByPk(banner_id);
    if (!bannerExists) {
        return res.status(404).json({
            message: `Không tìm thấy banner với ID: ${banner_id}`
        });
    }

    // Kiểm tra trùng lặp banner_id + product_id
    const existingDetail = await db.BannerDetail.findOne({
        where: { banner_id, product_id }
    });

    if (existingDetail) {
        return res.status(409).json({
            message:
                'Chi tiết banner này đã tồn tại (trùng banner_id và product_id)'
        });
    }
    const bannerDetail = await db.BannerDetail.create(req.body);
    if (bannerDetail) {
        return res.status(201).json({
            message: 'Thêm banner detail thành công',
            data: bannerDetail
        });
    }
    return res.status(400).json({
        message: 'Lỗi khi thêm banner detail'
    });
}

// Cập nhật banner detail
export async function updateBannerDetail(req, res) {
    const { id } = req.params;
    const { product_id, banner_id } = req.body;

    // Kiểm tra trùng lặp với các bản ghi khác
    const existing = await db.BannerDetail.findOne({
        where: {
            product_id,
            banner_id,
            id: { [db.Sequelize.Op.ne]: id } // khác id hiện tại
        }
    });

    if (existing) {
        return res.status(409).json({
            message:
                'product_id và banner_id này đã tồn tại trong bảng BannerDetail.'
        });
    }

    const [updated] = await db.BannerDetail.update(req.body, {
        where: { id }
    });

    if (updated) {
        return res.status(200).json({
            message: 'Cập nhật banner detail thành công'
        });
    }
    return res.status(404).json({
        message: 'Không tìm thấy banner detail'
    });
}

// Xóa banner detail
export async function deleteBannerDetail(req, res) {
    const { id } = req.params;

    const deleted = await db.BannerDetail.destroy({
        where: { id }
    });

    if (deleted) {
        return res.status(200).json({
            message: 'Xóa banner detail thành công'
        });
    }

    return res.status(404).json({
        message: 'Không tìm thấy banner detail'
    });
}
