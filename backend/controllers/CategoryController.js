import { Sequelize } from "sequelize";
import db from "../models/index.js";
const { Op } = Sequelize;

export async function getCategories(req, res) {
  const { search = "", page = 1 } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  let whereClause = {};
  if (search.trim() !== "") {
    whereClause = {
      [Op.or]: [{ name: { [Op.like]: `%${search}%` } }],
    };
  }

  const [categories, totalCategories] = await Promise.all([
    db.Category.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
    }),
    db.Category.count({
      where: whereClause,
    }),
  ]);

  res.status(200).json({
    message: "Lấy danh sách danh mục thành công",
    data: categories,
    currentPage: parseInt(page, 10),
    totalPage: Math.ceil(totalCategories / pageSize),
    totalCategories,
  });
}

export async function getAllCategories(req, res) {
  const { search = "", page = 1 } = req.query;
  const pageSize = 100;
  const offset = (page - 1) * pageSize;

  let whereClause = {};
  if (search.trim() !== "") {
    whereClause = {
      [Op.or]: [{ name: { [Op.like]: `%${search}%` } }],
    };
  }

  const [categories, totalCategories] = await Promise.all([
    db.Category.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
    }),
    db.Category.count({
      where: whereClause,
    }),
  ]);

  res.status(200).json({
    message: "Lấy danh sách danh mục thành công",
    data: categories,
    currentPage: parseInt(page, 10),
    totalPage: Math.ceil(totalCategories / pageSize),
    totalCategories,
  });
}

export async function getCategoryById(req, res) {
  const { id } = req.params;
  const category = await db.Category.findByPk(id); //Tìm sản phẩm theo Id

  if (!category) {
    return res.status(404).json({
      message: "Không tìm thấy danh mục sản phẩm !",
    });
  }

  res.status(200).json({
    message: "Lấy thông tin danh mục thành công.",
    data: category,
  });
}

export async function insertCategory(req, res) {
  const { name } = req.body;

  const existingCategoryName = await db.Category.findOne({
    where: { name: name.trim() },
  });
  if (existingCategoryName) {
    return res.status(400).json({
      message: "Tên danh mục trùng. Vui lòng nhập lại tên danh mục.",
    });
  }

  const category = await db.Category.create(req.body);
  if (category) {
    return res.status(201).json({
      message: "Thêm mới danh mục sản phẩm thành công.",
      data: category,
    });
  }
  return res.status(400).json({
    message: "Thêm danh mục không thành công.",
    data: category,
  });
}

export async function updateCategory(req, res) {
  const { id } = req.params;
  const { name, image } = req.body;

  if (name !== undefined) {
    const existingCategoryName = await db.Category.findOne({
      where: { name: name.trim(), id: { [Sequelize.Op.ne]: id } },
    });
    if (existingCategoryName) {
      return res.status(400).json({
        message: "Tên danh mục trùng. Vui lòng nhập lại tên danh mục.",
      });
    }
  }

  const [updatedCategory] = await db.Category.update(
    {
      name: name?.trim(),
      image: image,
    },
    {
      where: { id },
    },
  );

  if (updatedCategory) {
    return res.status(200).json({
      message: "Cập nhật danh mục sản phẩm thành công",
    });
  }

  return res.status(404).json({
    message: "Không tìm thấy danh mục sản phẩm",
  });
}

export async function deleteCategory(req, res) {
  const { id } = req.params;

  const deleted = await db.Category.destroy({
    where: { id },
  });

  if (deleted) {
    return res.status(200).json({
      message: "Xóa danh mục sản phẩm thành công",
    });
  }

  return res.status(404).json({
    message: "Không tìm thấy danh mục sản phẩm",
  });
}
