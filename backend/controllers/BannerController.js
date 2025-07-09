import { Sequelize, where } from 'sequelize';
import db from '../models';
const { Op } = Sequelize;
import { BannerStatus } from '../constants';

// Lấy danh sách banner (phân trang + tìm kiếm)
export async function getBanners(req, res) {
    const { search = '', page = 1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    let whereClause = {};
    if (search.trim() !== '') {
        whereClause = {
            [Op.or]: [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ]
        };
    }

    const [banners, totalBanners] = await Promise.all([
        db.Banner.findAll({
            where: whereClause,
            limit: pageSize,
            offset: offset
        }),
        db.Banner.count({
            where: whereClause
        })
    ]);

    res.status(200).json({
        message: 'Lấy danh sách banner thành công',
        data: banners,
        currentPage: parseInt(page, 10),
        totalPage: Math.ceil(totalBanners / pageSize),
        totalBanners
    });
}

// Lấy banner theo ID
export async function getBannerById(req, res) {
    const { id } = req.params;
    const banner = await db.Banner.findByPk(id);

    if (!banner) {
        return res.status(404).json({
            message: 'Không tìm thấy banner'
        });
    }

    res.status(200).json({
        message: 'Lấy thông tin banner thành công',
        data: banner
    });
}

// Thêm mới banner
export async function insertBanner(req, res) {
    const { name } = req.body;
    const existingBanner = await db.Banner.findOne({
        where: { name: name.trim() }
    });
    if (existingBanner) {
        return res.status(409).json({
            message: 'Tên banner đã tồn tại, vui lòng chọn tên khác.'
        });
    }
    const bannerData = {
        ...req.body,
        status: BannerStatus.ACTIVE
    };
    const banner = await db.Banner.create(bannerData);

    if (banner) {
        return res.status(200).json({
            message: 'Thêm banner thành công.',
            data: banner
        });
    }

    return res.status(400).json({
        message: 'Lỗi khi thêm banner'
    });
}

// Cập nhật banner
export async function updateBanner(req, res) {
    const { id } = req.params;
    const { name, image, status } = req.body;

    const existingBanner = await db.Banner.findOne({
        where: { name: name.trim(), id: { [Sequelize.Op.ne]: id } }
    });
    if (existingBanner) {
        return res.status(409).json({
            message: 'Tên banner đã tồn tại, vui lòng chọn tên khác.'
        });
    }

    const [updatedBanner] = await db.Banner.update(
        { name, image, status },
        { where: { id } }
    );
    if (updatedBanner) {
        return res.status(200).json({
            message: 'Cập nhật banner thành công.'
        });
    }
    return res.status(400).json({
        message: 'Lỗi khi sửa banner'
    });
}
// Xóa banner
export async function deleteBanner(req, res) {
    const { id } = req.params;

    const deleted = await db.Banner.destroy({
        where: { id }
    });

    if (deleted) {
        return res.status(200).json({
            message: 'Xóa banner thành công'
        });
    }

    return res.status(404).json({
        message: 'Không tìm thấy banner'
    });
}
