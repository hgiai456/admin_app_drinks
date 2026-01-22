import { Sequelize } from "sequelize";
import db from "../models/index.js";
const { Op } = Sequelize;

export async function getStores(req, res) {
  const { search = "", page = 1 } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  let whereClause = {};
  if (search.trim() !== "") {
    whereClause = {
      [Op.or]: [{ name: { [Op.like]: `%${search}%` } }],
    };
  }

  const [stores, totalStores] = await Promise.all([
    db.Store.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
    }),
    db.Store.count({
      where: whereClause,
    }),
  ]);

  res.status(200).json({
    message: "Lấy danh sách cửa hàng thành công",
    data: stores,
    currentPage: parseInt(page, 10),
    totalPage: Math.ceil(totalStores / pageSize),
    totalStores,
  });
}

export async function getStoreById(req, res) {
  try {
    const { id } = req.params;
    const store = await db.Store.findByPk(id);

    if (!store) {
      return res.status(404).json({
        message: "Không tìm thấy cửa hàng",
      });
    }

    res.status(200).json({
      message: "Lấy thông tin cửa hàng thành công",
      data: store,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy cửa hàng",
      error: error.message,
    });
  }
}

export async function insertStore(req, res) {
  try {
    const store = await db.Store.create(req.body);
    res.status(201).json({
      message: "Thêm cửa hàng thành công",
      data: store,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi thêm cửa hàng",
      error: error.message,
    });
  }
}

export async function updateStore(req, res) {
  const { id } = req.params;
  const updateProduct = await db.Store.update(req.body, { where: { id } });
  if (updateProduct[0] > 0) {
    return res.status(200).json({ message: "Cập nhật cửa hàng thành công." });
  } else {
    return res.status(404).json({ message: "Cửa hàng không tìm thấy" });
  }
}

/**
 * DELETE /stores/:id
 * Xoá cửa hàng theo ID
 */
export async function deleteStore(req, res) {
  const { id } = req.params;
  const deleted = await db.Store.destroy({
    where: { id },
  });

  if (deleted) {
    return res.status(200).json({ message: "Xóa cửa hàng thành công." });
  } else {
    return res.status(400).json({ message: "Xóa cửa hàng thất b." });
  }
}
