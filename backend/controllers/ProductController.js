import { col, fn, Sequelize, literal } from "sequelize";
import db from "../models/index.js";
const { Op } = Sequelize;

export async function getProducts(req, res) {
  const { search = "", page = 1 } = req.query;
  const pageSize = 4;
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
          attributes: ["price", "buyturn"],
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

export async function getAllProducts(req, res) {
  const { search = "", page = 1 } = req.query;
  const pageSize = 100;
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
  try {
  } catch (error) {}
  const [products, totalProducts] = await Promise.all([
    db.Product.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
      attributes: {
        include: [
          [
            literal(`(
                SELECT COALESCE(SUM(pd.buyturn), 0)
                FROM prodetails AS pd
                WHERE pd.product_id = Product.id
              )`),
            "total_buyturn",
          ],
        ],
      },
      include: [
        {
          model: db.ProDetail,
          as: "product_details",
          attributes: ["price", "buyturn"],
          limit: 1,
          order: [["price", "ASC"]],
        },
      ],
    }),
    db.Product.count({
      where: whereClause,
    }),
  ]);

  const formattedProducts = products.map((product) => {
    const productData = product.toJSON();
    return {
      ...productData,
      total_buyturn: parseInt(productData.total_buyturn) || 0,
    };
  });

  res.status(200).json({
    message: "Lấy danh sách sản phẩm thành công",
    data: formattedProducts,
    currentPage: parseInt(page, 10),
    totalPage: Math.ceil(totalProducts / pageSize), //ceil(11 / 5) = 2.1 => 3 (Lam tron)
    totalProducts,
  });
}

export async function getProductsCustomizeSizePage(req, res) {
  const { search = "", page = 1, pageSize = 4 } = req.query;

  const allowedPageSizes = [4, 8, 12, 16, 20, 24];

  let validatedPageSize = parseInt(pageSize, 10);

  if (isNaN(validatedPageSize) || validatedPageSize < 1) {
    validatedPageSize = 4; // Default
  } else if (!allowedPageSizes.includes(validatedPageSize)) {
    validatedPageSize = allowedPageSizes.reduce((prev, curr) =>
      Math.abs(curr - validatedPageSize) < Math.abs(prev - validatedPageSize)
        ? curr
        : prev,
    );
  }

  let validatedPage = parseInt(page, 10);
  if (isNaN(validatedPage) || validatedPage < 1) {
    validatedPage = 1;
  }

  const offset = (validatedPage - 1) * validatedPageSize;

  let whereClause = {};
  if (search.trim() !== "") {
    whereClause = {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ],
    };
  }

  try {
    const [products, totalProducts] = await Promise.all([
      db.Product.findAll({
        where: whereClause,
        limit: validatedPageSize,
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
        order: [["createdAt", "DESC"]],
      }),
      db.Product.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalProducts / validatedPageSize);

    res.status(200).json({
      message: "Lấy danh sách sản phẩm thành công",
      data: products,
      pagination: {
        currentPage: validatedPage,
        pageSize: validatedPageSize,
        totalPage: totalPages,
        totalProducts: totalProducts,
        hasNextPage: validatedPage < totalPages,
        hasPrevPage: validatedPage > 1,
        nextPage: validatedPage < totalPages ? validatedPage + 1 : null,
        prevPage: validatedPage > 1 ? validatedPage - 1 : null,
      },
    });
  } catch (error) {
    console.error("❌ Error in getProductsCustomizeSizePage:", error);
    res.status(500).json({
      message: "Lỗi server khi lấy danh sách sản phẩm",
      error: error.message,
    });
  }
}

export async function getAllProductsByCategory(req, res) {
  try {
    const { category_id, page = 1, limit = 12, search = "" } = req.query;

    if (!category_id) {
      return res.status(400).json({ message: "Thiếu category_id" });
    }

    const parsedCategoryId = parseInt(category_id, 10);

    let validatedPage = parseInt(page, 10);
    let validatedLimit = parseInt(limit, 10);
    const offset = (validatedPage - 1) * validatedLimit;
    if (isNaN(parsedCategoryId)) {
      // Kiểm tra nếu không phải số

      return res
        .status(400)
        .json({ message: "category_id không phải là số. " });
    }
    if (isNaN(validatedPage) || validatedPage < 1) {
      validatedPage = 1;
    }

    if (isNaN(validatedLimit) || validatedLimit < 1) {
      validatedLimit = 12;
    }

    const whereClause = {
      category_id: parsedCategoryId,
    };

    if (search && search.trim() !== "") {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search.trim()}%` } },
        { description: { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    const [products, totalProducts] = await Promise.all([
      db.Product.findAll({
        where: whereClause,
        limit: validatedLimit,
        offset: offset,
        include: [
          {
            model: db.ProDetail,
            as: "product_details",
            attributes: ["price"],
          },
        ],
        order: [["createdAt", "DESC"]],
      }),
      db.Product.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalProducts / validatedLimit);

    const wrongCategory = products.filter(
      (p) => p.category_id !== parsedCategoryId,
    );
    if (wrongCategory.length > 0) {
      console.error(
        "WARNING: Có sản phẩm không đúng category!",
        wrongCategory.map((p) => ({
          id: p.id,
          name: p.name,
          category_id: p.category_id,
        })),
      );
    }

    res.status(200).json({
      message: "Lấy toàn bộ sản phẩm theo danh mục thành công",
      data: products,
      totalProducts: totalProducts,
      pagination: {
        currentPage: validatedPage,
        pageSize: validatedLimit,
        totalPage: totalPages,
        totalProducts: totalProducts,
        hasNextPage: validatedPage < totalPages,
        hasPrevPage: validatedPage > 1,
        nextPage: validatedPage < totalPages ? validatedPage + 1 : null,
        prevPage: validatedPage > 1 ? validatedPage - 1 : null,
      },
    });
  } catch (error) {
    console.error("Error in getAllProductsByCategory:", error);
    return res.status(500).json({
      message: "Lỗi server khi lấy danh sách sản phẩm",
      error: error.message,
    });
  }
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
