import { Sequelize } from 'sequelize';
import db from '../models/index.js';
const { Op } = Sequelize;

// Lấy danh sách hình ảnh sản phẩm
export const getProductImages = async (req, res) => {
    const { product_id } = req.query;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    let whereClause = {};
    if (product_id) {
        whereClause.product_id = product_id; // Filter theo product_id nếu có
    }

    try {
        const [productImages, totalProductImages] = await Promise.all([
            db.ProductImage.findAll({
                where: whereClause,
                limit: pageSize,
                offset: offset,
                include: [
                    {
                        model: db.Product,
                        as: 'Product' // Giả định đã đặt alias trong association
                    }
                ]
            }),
            db.ProductImage.count({
                where: whereClause
            })
        ]);

        return res.status(200).json({
            message: 'Lấy danh sách ảnh sản phẩm thành công',
            data: productImages,
            currentPage: page,
            totalPages: Math.ceil(totalProductImages / pageSize),
            totalProductImages
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi khi lấy danh sách ảnh sản phẩm',
            error: error.message
        });
    }
};

// Lấy hình ảnh sản phẩm theo ID
export async function getProductImageById(req, res) {
    const { id } = req.params;
    const image = await db.ProductImage.findByPk(id);

    if (!image) {
        return res.status(404).json({
            message: 'Không tìm thấy hình ảnh sản phẩm'
        });
    }

    res.status(200).json({
        message: 'Lấy thông tin hình ảnh sản phẩm thành công.',
        data: image
    });
}

// Thêm mới hình ảnh sản phẩm
export async function insertProductImage(req, res) {
    const { product_id, image_url } = req.body;
    const product = await db.Product.findByPk(product_id);
    if (!product) {
        return res.status(400).json({ message: 'Sản phẩm không tồn tại.' });
    }

    const existingImage = await db.ProductImage.findOne({
        where: {
            product_id: product_id,
            image_url: image_url
        }
    });

    if (existingImage) {
        return res.status(400).json({
            message: 'Hình ảnh này đã tồn tại cho sản phẩm.'
        });
    }

    const image = await db.ProductImage.create({
        product_id,
        image_url
    });

    if (image) {
        return res.status(201).json({
            message: 'Thêm hình ảnh sản phẩm thành công.',
            data: image
        });
    }

    return res.status(400).json({
        message: 'Thêm hình ảnh không thành công.'
    });
}

// // Cập nhật hình ảnh sản phẩm
// export async function updateProductImage(req, res) {
//     const { id } = req.params;
//     const { product_id, image_url } = req.body;

//     const [updatedImage] = await db.ProductImage.update(
//         {
//             product_id,
//             image_url
//         },
//         {
//             where: { id }
//         }
//     );

//     if (updatedImage) {
//         return res.status(200).json({
//             message: 'Cập nhật hình ảnh sản phẩm thành công.'
//         });
//     }

//     return res.status(404).json({
//         message: 'Không tìm thấy hình ảnh sản phẩm'
//     });
// }

// Xóa hình ảnh sản phẩm
export async function deleteProductImage(req, res) {
    const { id } = req.params;

    const deleted = await db.ProductImage.destroy({
        where: { id }
    });

    if (deleted) {
        return res.status(200).json({
            message: 'Xóa hình ảnh sản phẩm thành công.'
        });
    }

    return res.status(404).json({
        message: 'Không tìm thấy hình ảnh sản phẩm.'
    });
}
