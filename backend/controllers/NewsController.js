import { Sequelize } from "sequelize";
import db from "../models/index.js";
const { Op } = Sequelize;

export async function getNewsArticles(req, res) {
  const { search = "", page = 1 } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  let whereClause = {};
  if (search.trim() !== "") {
    whereClause = {
      [Op.or]: [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
      ],
    };
  }

  const [news, totalNews] = await Promise.all([
    db.News.findAll({
      where: whereClause,
      limit: pageSize,
      offset,
      order: [["createdAt", "DESC"]],
    }),
    db.News.count({ where: whereClause }),
  ]);

  res.status(200).json({
    message: "Lấy danh sách tin tức thành công",
    data: news,
    currentPage: parseInt(page, 10),
    totalPage: Math.ceil(totalNews / pageSize),
    totalNews,
  });
}

/**
 * GET: Lấy toàn bộ News (dùng cho dropdown / admin)
 */
export async function getAllNewsArticles(req, res) {
  const { search = "", page = 1 } = req.query;
  const pageSize = 100;
  const offset = (page - 1) * pageSize;

  let whereClause = {};
  if (search.trim() !== "") {
    whereClause = {
      [Op.or]: [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
      ],
    };
  }

  const [news, totalNews] = await Promise.all([
    db.News.findAll({
      where: whereClause,
      limit: pageSize,
      offset,
      order: [["createdAt", "DESC"]],
    }),
    db.News.count({ where: whereClause }),
  ]);

  res.status(200).json({
    message: "Lấy danh sách tin tức thành công",
    data: news,
    currentPage: parseInt(page, 10),
    totalPage: Math.ceil(totalNews / pageSize),
    totalNews,
  });
}

/**
 * GET: Lấy News theo ID
 */
export async function getNewsArticleById(req, res) {
  const { id } = req.params;

  const news = await db.News.findByPk(id);

  if (!news) {
    return res.status(404).json({
      message: "Không tìm thấy tin tức",
    });
  }

  res.status(200).json({
    message: "Lấy thông tin tin tức thành công",
    data: news,
  });
}

export async function insertNewsArticle(req, res) {
  const transaction = await db.sequelize.transaction();

  try {
    const newsArticle = await db.News.create(req.body, { transaction });

    const productIds = req.body.product_ids || [];
    if (productIds && productIds.length) {
      const validProducts = await db.Product.findAll({
        where: {
          id: productIds,
        },
        transaction,
      });

      const validProductIds = validProducts.map((p) => p.id);

      const filteredProductIds = productIds.filter((id) =>
        validProductIds.includes(id),
      );

      const NewsDetailPromises = filteredProductIds.map((product_id) =>
        db.NewsDetail.create(
          {
            news_id: newsArticle.id,
            product_id: product_id,
          },
          { transaction },
        ),
      );

      await Promise.all(NewsDetailPromises);
    }

    await transaction.commit();

    return res.status(201).json({
      message: "Thêm tin tức thành công",
      data: newsArticle,
    });
  } catch (error) {
    await transaction.rollback();

    console.error(error);
    return res.status(500).json({
      message: "Thêm tin tức không thành công",
      error: error.message,
    });
  }
}

/**
 * PUT: Cập nhật News
 */
export async function updateNews(req, res) {
  const { id } = req.params;
  const { title, image, content } = req.body;

  if (title !== undefined) {
    const existingTitle = await db.News.findOne({
      where: {
        title: title.trim(),
        id: { [Op.ne]: id },
      },
    });

    if (existingTitle) {
      return res.status(400).json({
        message: "Tiêu đề tin tức đã tồn tại ở tin tức khác",
      });
    }
  }

  const [updated] = await db.News.update(
    {
      title: title?.trim(),
      image,
      content,
    },
    { where: { id } },
  );

  if (updated) {
    return res.status(200).json({
      message: "Cập nhật tin tức thành công",
    });
  }

  return res.status(404).json({
    message: "Không tìm thấy tin tức",
  });
}

/**
 * DELETE: Xóa News
 */
export async function deleteNews(req, res) {
  const { id } = req.params;
  const transaction = await db.sequelize.transaction();
  try {
    await db.NewsDetail.destroy({
      where: { news_id: id },
      transaction: transaction,
    });
    const deleted = await db.News.destroy({
      where: { id },
      transaction: transaction,
    });

    if (deleted) {
      await transaction.commit();
      return res.status(200).json({
        message: "Xóa tin tức thành công",
      });
    } else {
      await transaction.rollback();
      return res.status(404).json({
        message: "Không tìm thấy tin tức",
      });
    }
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({
      message: "Xóa tin tức không thành công",
      error: error.message,
    });
  }
  //delete db.NewsDetail where news_id = id
  //transaction
}
