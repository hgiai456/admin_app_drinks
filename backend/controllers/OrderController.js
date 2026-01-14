import { Sequelize, where } from "sequelize";
import db from "../models";
import { OrderStatus } from "../constants";
const { Op } = Sequelize;

export async function getOrders(req, res) {
  const { search = "", page = 1, status } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  let whereClause = {};
  if (search.trim() !== "") {
    whereClause = {
      [Op.or]: [
        { phone: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } },
      ],
    };
  }
  if (status) {
    whereClause.status = status;
  }

  const [orders, totalOrders] = await Promise.all([
    db.Order.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
      attributes: [
        "id",
        "user_id",
        "phone",
        "address",
        "note",
        "total",
        "status",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: db.Payment,
          as: "payments",
          attributes: ["id", "payment_method", "status", "transaction_id"],
          required: false, // LEFT JOIN - order không có payment vẫn hiển thị
        },
      ],

      order: [["createdAt", "DESC"]],
    }),
    db.Order.count({
      where: whereClause,
    }),
  ]);
  const transformedOrders = orders.map((order) => {
    const orderData = order.toJSON();
    const payment = orderData.payments?.[0];

    return {
      ...orderData,
      payment_method: payment?.payment_method || "cod",
      payment_status: payment?.status || "pending",
      transaction_id: payment?.transaction_id || null,
    };
  });

  res.status(200).json({
    message: "Lấy danh sách sản phẩm thành công",
    data: transformedOrders,
    currentPage: parseInt(page, 10),
    totalPage: Math.ceil(totalOrders / pageSize), //ceil(11 / 5) = 2.1 => 3 (Lam tron)
    totalOrders,
  });
}
export async function getOrdersByUserId(req, res) {
  try {
    const { user_id } = req.params;
    const { page = 1, status } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    let whereClause = { user_id };

    if (status) {
      whereClause.status = status;
    }

    const [orders, totalOrders] = await Promise.all([
      db.Order.findAll({
        where: whereClause,
        limit: pageSize,
        offset: offset,
        include: [
          {
            model: db.OrderDetail,
            as: "order_details",
            attributes: ["quantity", "price"], // Chỉ lấy quantity và price từ OrderDetail
            include: [
              {
                model: db.ProDetail,
                as: "product_details",
                attributes: ["name"], // Chỉ lấy name và price từ ProDetail
                include: [
                  {
                    model: db.Product,
                    as: "product",
                    attributes: ["image"], // Chỉ lấy image từ Product
                  },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      }),
      db.Order.count({
        where: whereClause,
      }),
    ]);

    if (!orders.length) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng nào",
      });
    }

    res.status(200).json({
      message: "Lấy danh sách đơn hàng theo user thành công",
      data: orders,
      currentPage: parseInt(page, 10),
      totalPage: Math.ceil(totalOrders / pageSize),
      totalOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy đơn hàng",
      error: error.message,
    });
  }
}

export async function getOrderById(req, res) {
  const { id } = req.params;
  const order = await db.Order.findByPk(id, {
    include: [
      {
        model: db.OrderDetail,
        as: "order_details",
        include: [
          {
            model: db.ProDetail,
            as: "product_details",
          },
        ],
      },
      {
        model: db.Payment,
        as: "payments",
        attributes: [
          "id",
          "payment_method",
          "status",
          "transaction_id",
          "amount",
        ],
      },
    ],
  });

  if (!order) {
    return res.status(404).json({
      message: "Đơn hàng không tìm thấy.",
    });
  }
  const orderData = order.toJSON();
  const payment = orderData.payments?.[0];

  res.status(200).json({
    message: "Lấy thông tin đơn hàng thành công.",
    data: {
      ...orderData,
      payment_method: payment?.payment_method || "cod",
      payment_status: payment?.status || "pending",
      transaction_id: payment?.transaction_id || null,
    },
  });
}

export async function updateOrder(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  // 3. Tiến hành cập nhật
  const [updated] = await db.Order.update(
    { status: status },
    { where: { id } }
  );

  if (updated) {
    const updatedOrder = await db.Order.findByPk(id);
    return res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công.",
      data: updatedOrder,
    });
  } else {
    return res.status(404).json({
      message: "Đơn hàng không tìm thấy.",
    });
  }
}

export async function deleteOrder(req, res) {
  const { id } = req.params;

  // Tìm đơn hàng trước
  const [update] = await db.Order.update(
    { status: OrderStatus.FAILED },
    {
      where: { id },
    }
  );

  if (update) {
    return res.status(200).json({
      message: "Đơn hàng được đánh dấu là FAILED.",
    });
  } else {
    return res.status(404).json({
      message: "Không tìm thấy đơn hàng.",
    });
  }
}
