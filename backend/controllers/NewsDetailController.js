import { Sequelize } from "sequelize";
import db from "../models/index.js";
const { Op } = Sequelize;

export async function getNewsDetails(req, res) {
  const { page = 1 } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  const [newsDetails, total] = await Promise.all([
    db.NewsDetail.findAll({
      limit: pageSize,
      offset,
      include: [
        {
          model: db.News,
          as: "news", //alias nếu đã định nghĩa trong model
        },
        {
          model: db.Product,
          as: "product", //alias nếu đã định nghĩa trong model
        },
      ],
    }),
    db.NewsDetail.count(),
  ]);

  return res.status(200).json({
    message: "Lấy danh sách tin tức kèm sản phẩm thành công",
    data: newsDetails,
    currentPage: parseInt(page, 10),
    totalPage: Math.ceil(total / pageSize),
    total,
  });
}

export async function getNewsDetailById(req, res) {
  try {
    const { id } = req.params;

    const newsDetail = await db.NewsDetail.findByPk(id, {
      include: [
        {
          model: db.News,
          as: "news", // Thêm alias nếu đã định nghĩa trong model
        },
        {
          model: db.Product,
          as: "product", // Thêm alias nếu đã định nghĩa trong model
        },
      ],
    });

    if (!newsDetail) {
      return res.status(404).json({
        message: "Không tìm thấy liên kết tin tức – sản phẩm",
      });
    }

    return res.status(200).json({
      message: "Lấy thông tin liên kết thành công",
      data: newsDetail,
    });
  } catch (error) {
    console.error("Error in getNewsDetailById:", error);
    return res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
}

/**
 * POST: Thêm NewsDetail
 */
export async function insertNewsDetail(req, res) {
  try {
    const { news_id, product_id } = req.body;

    // 1. Check product tồn tại
    const existedProduct = await db.Product.findByPk(product_id);
    if (!existedProduct) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại",
      });
    }

    // 2. Check news tồn tại
    const existedNews = await db.News.findByPk(news_id);
    if (!existedNews) {
      return res.status(404).json({
        message: "Tin tức không tồn tại",
      });
    }

    // 3. Check trùng lặp
    const existed = await db.NewsDetail.findOne({
      where: { news_id, product_id },
    });

    if (existed) {
      return res.status(409).json({
        message: "Mối quan hệ giữa sản phẩm và tin tức đã tồn tại",
      });
    }

    // 4. Tạo NewsDetail
    const newsDetail = await db.NewsDetail.create(req.body);

    return res.status(201).json({
      message: "Thêm liên kết tin tức – sản phẩm thành công",
      data: newsDetail,
    });
  } catch (error) {
    console.error("Error in insertNewsDetail:", error);

    // Xử lý lỗi foreign key
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ: news_id hoặc product_id không tồn tại",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Thêm liên kết không thành công",
      error: error.message,
    });
  }
}

/**
 * PUT: Cập nhật NewsDetail
 */
export async function updateNewsDetail(req, res) {
  const { id } = req.params;
  const { news_id, product_id } = req.body;

  const newsDetail = await db.NewsDetail.findByPk(id);
  if (!newsDetail) {
    return res.status(404).json({
      message: "Không tìm thấy NewsDetail",
    });
  }

  //  Check duplicate (trùng product_id + news_id nhưng KHÔNG phải record hiện tại)
  const existingDuplicate = await db.NewsDetail.findOne({
    where: {
      product_id,
      news_id,
      id: {
        [Op.ne]: id, // loại trừ chính record đang update
      },
    },
  });

  if (existingDuplicate) {
    return res.status(409).json({
      message:
        "Mối quan hệ giữa sản phẩm và tin tức đã tồn tại trong bản ghi khác",
    });
  }

  // 3️⃣ Update
  await db.NewsDetail.update({ product_id, news_id }, { where: { id } });

  // 4️⃣ Lấy lại data sau update
  const updatedNewsDetail = await db.NewsDetail.findByPk(id);

  return res.status(200).json({
    message: "Cập nhật NewsDetail thành công",
    data: updatedNewsDetail,
  });
}

/**
 * DELETE: Xóa NewsDetail
 */
export async function deleteNewsDetail(req, res) {
  const { id } = req.params;

  const deleted = await db.NewsDetail.destroy({
    where: { id },
  });

  if (deleted) {
    return res.status(200).json({
      message: "Xóa liên kết tin tức – sản phẩm thành công",
    });
  }

  return res.status(404).json({
    message: "Không tìm thấy liên kết",
  });
}
