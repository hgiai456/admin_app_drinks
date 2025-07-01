import { Sequelize, where } from 'sequelize';
import db from '../models/index.js';
import InsertProductRequest from '../dtos/requests/product/InsertProductRequest.js';
const { Op } = Sequelize;

export async function getProducts(req, res) {
    const { search = '', page = 1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    let whereClause = {};
    if (search.trim() !== '') {
        whereClause = {
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ]
        };
    }

    const [products, totalProducts] = await Promise.all([
        db.Product.findAll({
            where: whereClause,
            limit: pageSize,
            offset: offset
        }),
        db.Product.count({
            where: whereClause
        })
    ]);

    res.status(200).json({
        message: 'Lấy danh sách sản phẩm thành công',
        data: products,
        currentPage: parseInt(page, 10),
        totalPage: Math.ceil(totalProducts / pageSize), //ceil(11 / 5) = 2.1 => 3 (Lam tron)
        totalProducts
    });
}

export async function getProductsById(req, res) {
    const { id } = req.params;
    const product = await db.Product.findByPk(id, {
        include: [
            {
                model: db.ProductImage,
                as: 'product_images',
                required: true
            }
        ]
    }); //Tìm sản phẩm theo Id

    if (!product) {
        return res.status(404).json({
            message: 'Sản phẩm không tìm thấy'
        });
    }
    res.status(200).json({
        message: 'Lấy thông tin sản phẩm thành công.',
        data: product
    });
}

export async function insertProducts(req, res) {
    const { name } = req.body;
    const existingProduct = await db.Product.findOne({
        where: { name: name.trim() }
    });
    if (existingProduct) {
        return res.status(400).json({
            message: 'Tên sản phẩm đã tồn tại. Vui lòng nhập lại tên sản phẩm.'
        });
    }

    const product = await db.Product.create(req.body);
    if (product) {
        return res.status(201).json({
            message: 'Thêm mới sản phẩm thành công. ',
            data: product
        });
    }

    return res.status(400).json({
        message: 'Lỗi khi thêm sản phẩm mới.'
    });
}

export async function updateProducts(req, res) {
    const { id } = req.params;

    const { name } = req.body;

    if (name !== undefined) {
        const existingProduct = await db.Product.findOne({
            where: { name: name.trim(), id: { [Sequelize.Op.ne]: id } }
        });
        if (existingProduct) {
            return res.status(400).json({
                message:
                    'Tên sản phẩm đã tồn tại. Vui lòng nhập lại tên sản phẩm.'
            });
        }
    }

    const [updateProduct] = await db.Product.update(req.body, {
        where: { id }
    });

    if (updateProduct) {
        return res
            .status(200)
            .json({ message: 'Cập nhật sản phẩm thành công.' });
    } else {
        return res.status(404).json({ message: 'Sản phẩm không tìm thấy.' });
    }
}

export async function deleteProducts(req, res) {
    const { id } = req.params;
    const deleted = await db.Product.destroy({ where: { id } });

    if (deleted) {
        return res.status(200).json({ message: 'Xóa sản phẩm thành công.' });
    } else {
        return res.status(404).json({ message: 'Sản phẩm không tìm thấy.' });
    }
}
/*
[
    {
      "name": "Espresso",
      "description": "A strong and bold coffee shot.",
      "image": "",
      "category_id": 4
    },
    {
      "name": "Latte",
      "description": "Smooth coffee with steamed milk.",
      "image": "",
      "category_id": 4
    },
    {
      "name": "Cappuccino",
      "description": "A coffee with steamed milk foam.",
      "image": "",
      "category_id": 4
    },
    {
      "name": "Americano",
      "description": "Espresso diluted with hot water.",
      "image": "",
      "category_id": 4
    },
    {
      "name": "Mocha",
      "description": "Chocolate flavored coffee drink.",
      "image": "",
      "category_id": 4
    },
    {
      "name": "Green Tea",
      "description": "A refreshing and healthy tea.",
      "image": "",
      "category_id": 5
    },
    {
      "name": "Black Tea",
      "description": "Classic strong flavored tea.",
      "image": "",
      "category_id": 5
    },
    {
      "name": "Oolong Tea",
      "description": "Traditional Chinese tea with rich aroma.",
      "image": "",
      "category_id": 5
    },
    {
      "name": "Peace Tea",
      "description": "Spiced tea with a blend of herbs.",
      "image": "",
      "category_id": 5
    },
    {
      "name": "Herbal Tea",
      "description": "Caffeine-free tea made from herbs.",
      "image": "",
      "category_id": 5
    }
  ]
*/
