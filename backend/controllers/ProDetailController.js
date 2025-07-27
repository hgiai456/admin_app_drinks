import { Sequelize } from "sequelize";
import db from "../models/index.js";
const { Op } = Sequelize;

// Lấy danh sách sản phẩm chi tiết
export async function getProDetails(req, res) {
  const { search = "", page = 1 } = req.query;
  const pageSize = 8;
  const offset = (page - 1) * pageSize;

  let whereClause = {};
  if (search.trim() !== "") {
    whereClause = {
      name: { [Op.like]: `%${search}%` },
    };
  }

  const [proDetails, totalProDetails] = await Promise.all([
    db.ProDetail.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
    }),
    db.ProDetail.count({
      where: whereClause,
    }),
  ]);

  res.status(200).json({
    message: "Lấy danh sách sản phẩm chi tiết thành công",
    data: proDetails,
    currentPage: parseInt(page, 10),
    totalPage: Math.ceil(totalProDetails / pageSize),
    totalProDetails,
  });
}

// Lấy sản phẩm chi tiết theo ID
export async function getProDetailById(req, res) {
  const { id } = req.params;
  const proDetail = await db.ProDetail.findByPk(id);

  if (!proDetail) {
    return res.status(404).json({
      message: "Sản phẩm chi tiết không tìm thấy",
    });
  }

  res.status(200).json({
    message: "Lấy thông tin sản phẩm chi tiết thành công.",
    data: proDetail,
  });
}
// Make sure this function exists and is exported
export async function findProDetailByProductAndSize(req, res) {
  try {
    const { product_id, size_id } = req.query;

    if (!product_id || !size_id) {
      return res.status(400).json({
        message: "Vui lòng cung cấp đầy đủ product_id và size_id",
      });
    }

    const proDetail = await db.ProDetail.findOne({
      where: {
        product_id: product_id,
        size_id: size_id,
      },
    });

    if (!proDetail) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm chi tiết",
      });
    }

    res.status(200).json({
      message: "Tìm sản phẩm chi tiết thành công",
      data: proDetail,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tìm sản phẩm chi tiết",
      error: error.message,
    });
  }
}

// Thêm mới sản phẩm chi tiết
export async function insertProDetail(req, res) {
  const { name } = req.body;

  const existingProDetail = await db.ProDetail.findOne({
    where: {
      name: name.trim(),
    },
  });

  if (existingProDetail) {
    return res.status(400).json({
      message: "Sản phẩm chi tiết đã tồn tại. Vui lòng nhập thông tin khác.",
    });
  }

  const proDetail = await db.ProDetail.create(req.body);
  if (proDetail) {
    return res.status(201).json({
      message: "Thêm sản phẩm chi tiết thành công.",
      data: proDetail,
    });
  }

  return res.status(400).json({
    message: "Lỗi khi thêm sản phẩm chi tiết.",
  });
}

// Cập nhật sản phẩm chi tiết
export async function updateProDetail(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  if (name) {
    const existingProDetail = await db.ProDetail.findOne({
      where: {
        name: name.trim(),
        id: { [Op.ne]: id },
      },
    });

    if (existingProDetail) {
      return res.status(400).json({
        message: "Sản phẩm chi tiết đã tồn tại với thông tin này.",
      });
    }
  }

  const [updated] = await db.ProDetail.update(req.body, {
    where: { id },
  });

  if (updated) {
    return res.status(200).json({
      message: "Cập nhật sản phẩm chi tiết thành công.",
    });
  }

  return res.status(404).json({
    message: "Không tìm thấy sản phẩm chi tiết.",
  });
}
export const getProductDetailByProductAndSize = async (req, res) => {
  try {
    const { pro_id, size_id } = req.query;

    if (!pro_id || !size_id) {
      return res.status(400).json({
        message: "Thiếu product_id hoặc size_id",
      });
      zz;
    }

    // Tìm ProductDetail theo product_id và size_id
    const productDetail = await db.ProDetail.findOne({
      where: {
        product_id: pro_id,
        size_id: size_id,
      },
    });

    if (!productDetail) {
      return res.status(404).json({
        message: "Không tìm thấy ProductDetail phù hợp",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Lấy ProductDetail thành công",
      data: productDetail,
    });
  } catch (error) {
    console.error("Error getProductDetailByProductAndSize:", error);
    return res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};
// Xóa sản phẩm chi tiết
export async function deleteProDetail(req, res) {
  const { id } = req.params;
  const deleted = await db.ProDetail.destroy({
    where: { id },
  });

  if (deleted) {
    return res.status(200).json({
      message: "Xóa sản phẩm chi tiết thành công.",
    });
  }

  return res.status(404).json({
    message: "Không tìm thấy sản phẩm chi tiết.",
  });
}
