import { col, fn, Sequelize, literal } from "sequelize";
import db from "../models";
const { Op } = Sequelize;

export async function getProducts(req, res) {
  const { search = "", page = 1 } = req.query;
  const pageSize = 8;
  const offset = (page - 1) * pageSize;

  let whereClause = {};
  if (search.trim() !== "") {
    whereClause = {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ],
    };
  }

  const [products, totalProducts] = await Promise.all([
    db.Product.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
      include: [
        {
          model: db.ProDetail,
          as: "product_details",
          attributes: ["price"],
          limit: 1,
          order: [["price", "ASC"]],
        },
      ],
    }),
    db.Product.count({
      where: whereClause,
    }),
  ]);

  res.status(200).json({
    message: "Lấy danh sách sản phẩm thành công",
    data: products,
    currentPage: parseInt(page, 10),
    totalPage: Math.ceil(totalProducts / pageSize), //ceil(11 / 5) = 2.1 => 3 (Lam tron)
    totalProducts,
  });
}

export async function getAllProductsByCategory(req, res) {
  const { category_id } = req.query;
  if (!category_id) {
    return res.status(400).json({ message: "Thiếu category_id" });
  }

  const whereClause = { category_id: category_id };
  console.log("category_id:", category_id, "whereClause:", whereClause);
  const products = await db.Product.findAll({
    where: whereClause,
    include: [
      {
        model: db.ProDetail,
        as: "product_details",
        attributes: ["price"],
        limit: 1,
        order: [["price", "ASC"]],
      },
    ],
  });

  res.status(200).json({
    message: "Lấy toàn bộ sản phẩm theo danh mục thành công",
    data: products,
    totalProducts: products.length,
  });
}

export async function getProductsById(req, res) {
  const { id } = req.params;
  const product = await db.Product.findByPk(id, {
    include: [
      {
        model: db.ProDetail,
        as: "product_details",
        attributes: ["id", "size_id", "price", "oldprice", "quantity"],
        include: [
          {
            model: db.Size,
            as: "sizes",
            attributes: ["name"],
          },
        ],
      },
    ],
    // include: [
    //     {
    //         model: db.ProductImage,
    //         as: 'product_images',
    //         required: true
    //     }
    // ]
  }); //Tìm sản phẩm theo Id

  if (!product) {
    return res.status(404).json({
      message: "Sản phẩm không tìm thấy",
    });
  }

  const formattedSizes = product.product_details.map((detail) => ({
    product_detail: detail.id,
    size_id: detail.size_id,
    size_name: detail.sizes?.name,
    price: detail.price,
    oldprice: detail.oldprice,
    quantity: detail.quantity,
  }));

  res.status(200).json({
    message: "Lấy thông tin sản phẩm thành công.",
    id: product.id,
    name: product.name,
    description: product.description,
    image: product.image,
    sizes: formattedSizes,
  });
}

export async function insertProducts(req, res) {
  const { name } = req.body;
  const existingProduct = await db.Product.findOne({
    where: { name: name.trim() },
  });
  if (existingProduct) {
    return res.status(400).json({
      message: "Tên sản phẩm đã tồn tại. Vui lòng nhập lại tên sản phẩm.",
    });
  }

  const product = await db.Product.create(req.body);
  if (product) {
    return res.status(201).json({
      message: "Thêm mới sản phẩm thành công. ",
      data: product,
    });
  }

  return res.status(400).json({
    message: "Lỗi khi thêm sản phẩm mới.",
  });
}

export async function updateProducts(req, res) {
  const { id } = req.params;

  const { name } = req.body;

  if (name !== undefined) {
    const existingProduct = await db.Product.findOne({
      where: { name: name.trim(), id: { [Sequelize.Op.ne]: id } },
    });
    if (existingProduct) {
      return res.status(400).json({
        message: "Tên sản phẩm đã tồn tại. Vui lòng nhập lại tên sản phẩm.",
      });
    }
  }

  const [updateProduct] = await db.Product.update(req.body, {
    where: { id },
  });

  if (updateProduct) {
    return res.status(200).json({ message: "Cập nhật sản phẩm thành công." });
  } else {
    return res.status(404).json({ message: "Sản phẩm không tìm thấy." });
  }
}

export async function deleteProducts(req, res) {
  const { id } = req.params;
  const deleted = await db.Product.destroy({ where: { id } });

  if (deleted) {
    return res.status(200).json({ message: "Xóa sản phẩm thành công." });
  } else {
    return res.status(404).json({ message: "Sản phẩm không tìm thấy." });
  }
}
