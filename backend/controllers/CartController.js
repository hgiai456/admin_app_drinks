import db from '../models/index.js';
import { Sequelize, where } from "sequelize";
import { OrderStatus } from "../constants";
import EmailService from "../services/EmailService";
const { Op } = Sequelize;

export async function getCarts(req, res) {
  const { search = "", page = 1 } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  let whereClause = {};
  if (search.trim()) {
    whereClause = {
      session_id: { [Op.like]: `%${search.trim()}%` },
    };
  }

  const [carts, totalCarts] = await Promise.all([
    db.Cart.findAll({
      where: whereClause,
      include: {
        model: db.CartItem,
        as: "cart_items",
      },
      limit: pageSize,
      offset,
    }),
    db.Cart.count({ where: whereClause }),
  ]);

  res.status(200).json({
    message: "Lấy danh sách giỏ hàng thành công.",
    data: carts,
    currentPage: parseInt(page),
    totalPage: Math.ceil(totalCarts / pageSize),
    totalCarts,
  });
}

export async function getCartById(req, res) {
  const { id } = req.params;

  const cart = await db.Cart.findByPk(id, {
    include: {
      model: db.CartItem,
      as: "cart_items",
      include: [
        {
          model: db.ProDetail,
          as: "product_details",
          include: [
            {
              model: db.Product,
              as: "product",
            },
          ],
        },
      ],
    },
  });

  if (!cart) {
    return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
  }

  res.status(200).json({
    message: "Lấy thông tin giỏ hàng thành công",
    data: cart,
  });
}

// Tìm giỏ hàng theo user_id
export async function getCartByUserId(req, res) {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        message: "Vui lòng cung cấp user_id",
      });
    }

    const cart = await db.Cart.findOne({
      where: { user_id },
      include: [
        {
          model: db.CartItem,
          as: "cart_items",
          include: [
            {
              model: db.ProDetail,
              as: "product_details",
              include: [
                {
                  model: db.Product,
                  as: "product",
                  attributes: ["id", "name", "image"],
                },
                {
                  model: db.Size,
                  as: "sizes",
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!cart) {
      return res.status(404).json({
        message: "Không tìm thấy giỏ hàng cho user này",
      });
    }

    // Calculate total amount
    const totalAmount = cart.cart_items.reduce((total, item) => {
      return total + item.quantity * item.product_details.price;
    }, 0);

    res.status(200).json({
      message: "Lấy giỏ hàng theo user thành công",
      data: {
        ...cart.toJSON(),
        totalAmount,
        totalItems: cart.cart_items.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy giỏ hàng",
      error: error.message,
    });
  }
}

export async function getCartBySessionId(req, res) {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({
        message: "Vui lòng cung cấp user_id",
      });
    }

    const cart = await db.Cart.findOne({
      where: { session_id },
      include: [
        {
          model: db.CartItem,
          as: "cart_items",
          include: [
            {
              model: db.ProDetail,
              as: "product_details",
              include: [
                {
                  model: db.Product,
                  as: "product",
                  attributes: ["id", "name", "image"],
                },
                {
                  model: db.Size,
                  as: "sizes",
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!cart) {
      return res.status(404).json({
        message: "Không tìm thấy giỏ hàng cho user này",
      });
    }

    // Calculate total amount
    const totalAmount = cart.cart_items.reduce((total, item) => {
      return total + item.quantity * item.product_details.price;
    }, 0);

    res.status(200).json({
      message: "Lấy giỏ hàng theo user thành công",
      data: {
        ...cart.toJSON(),
        totalAmount,
        totalItems: cart.cart_items.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy giỏ hàng",
      error: error.message,
    });
  }
}

export async function insertCart(req, res) {
  try {
    const { session_id, user_id } = req.body;

    // Validation: chỉ được có 1 trong 2
    if ((session_id && user_id) || (!session_id && !user_id)) {
      return res.status(400).json({
        message:
          "Chỉ được cung cấp một giá trị trong session_id hoặc user_id, không được có đồng thời và ngược lại.",
      });
    }

    // Logic kiểm tra đúng
    let whereClause = {};
    if (session_id) {
      whereClause.session_id = session_id;
    }
    if (user_id) {
      whereClause.user_id = user_id;
    }

    const existingCart = await db.Cart.findOne({
      where: whereClause,
    });

    if (existingCart) {
      return res.status(409).json({
        message: session_id
          ? "Một giỏ hàng với cùng session_id đã tồn tại"
          : "Một giỏ hàng với cùng user_id đã tồn tại",
      });
    }

    const cart = await db.Cart.create(req.body);

    return res.status(201).json({
      message: "Thêm giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi tạo giỏ hàng",
      error: error.message,
    });
  }
}
export async function checkoutCart(req, res) {
  const { cart_id, total, note, phone, address, user_id } = req.body;

  const transaction = await db.sequelize.transaction();

  try {
    // ===== 1. KIỂM TRA GIỎ HÀNG (FIX: THÊM INCLUDE) =====
    const cart = await db.Cart.findByPk(cart_id, {
      include: {
        model: db.CartItem,
        as: "cart_items",
        include: [
          {
            model: db.ProDetail,
            as: "product_details",
            include: [
              {
                model: db.Product,
                as: "product",
                attributes: ["id", "name", "image", "description"],
              },
              {
                model: db.Size,
                as: "sizes",
                attributes: ["id", "name"],
              },
            ],
          },
        ],
      },
    });

    if (!cart || !cart.cart_items.length) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Giỏ hàng không tồn tại hoặc đã rỗng",
      });
    }

    // ===== 2. KIỂM TRA USER =====
    const user = await db.User.findByPk(user_id);
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Người dùng không tồn tại",
      });
    }

    // ===== 3. KIỂM TRA TỒN KHO (FIX: SỬA LOGIC) =====
    const outOfStockItems = [];
    const insufficientStockItems = [];

    for (let item of cart.cart_items) {
      const productDetail = item.product_details;

      // ✅ FIX: Kiểm tra quantity thay vì stock
      if (!productDetail || productDetail.quantity <= 0) {
        outOfStockItems.push({
          product_name: productDetail?.product?.name || "Unknown",
          size_name: productDetail?.sizes?.name || "Unknown",
          requested_quantity: item.quantity,
          available_quantity: 0,
        });
        continue;
      }

      if (productDetail.quantity < item.quantity) {
        insufficientStockItems.push({
          product_name: productDetail.product.name,
          size_name: productDetail.sizes.name,
          requested_quantity: item.quantity,
          available_quantity: productDetail.quantity,
        });
      }
    }

    if (outOfStockItems.length > 0 || insufficientStockItems.length > 0) {
      await transaction.rollback();

      let errorMessage = "❌ Không thể thanh toán do:\n";

      if (outOfStockItems.length > 0) {
        errorMessage += "\n🚫 Sản phẩm đã hết hàng:\n";
        outOfStockItems.forEach((item) => {
          errorMessage += `  • ${item.product_name} (${item.size_name}) - Yêu cầu: ${item.requested_quantity}, Còn lại: 0\n`;
        });
      }

      if (insufficientStockItems.length > 0) {
        errorMessage += "\n⚠️ Sản phẩm không đủ số lượng:\n";
        insufficientStockItems.forEach((item) => {
          errorMessage += `  • ${item.product_name} (${item.size_name}) - Yêu cầu: ${item.requested_quantity}, Còn lại: ${item.available_quantity}\n`;
        });
      }

      return res.status(400).json({
        message: errorMessage.trim(),
        outOfStockItems: outOfStockItems,
        insufficientStockItems: insufficientStockItems,
      });
    }

    // ===== 4. TẠO ĐƠN HÀNG MỚI =====
    const calculatedTotal = cart.cart_items.reduce(
      (acc, item) => acc + item.quantity * item.product_details.price,
      0,
    );

    const newOrder = await db.Order.create(
      {
        session_id: cart.session_id,
        user_id: user_id,
        total: total || calculatedTotal,
        note: note || "",
        status: OrderStatus.PENDING,
        phone: phone,
        address: address,
      },
      {
        transaction: transaction,
      },
    );

    console.log(`✅ Created Order ID: ${newOrder.id}`);

    // ===== 5. TẠO ORDER DETAILS + CẬP NHẬT QUANTITY & BUYTURN =====
    const orderDetails = [];

    for (let item of cart.cart_items) {
      // Tạo order detail
      const orderDetail = await db.OrderDetail.create(
        {
          order_id: newOrder.id,
          product_detail_id: item.product_detail_id,
          quantity: item.quantity,
          price: item.product_details.price,
        },
        {
          transaction: transaction,
        },
      );

      // ✅ CẬP NHẬT QUANTITY (TRỪ) VÀ BUYTURN (CỘNG)
      const currentQuantity = item.product_details.quantity;
      const currentBuyturn = item.product_details.buyturn || 0;
      const purchasedQuantity = item.quantity;

      const newQuantity = currentQuantity - purchasedQuantity;
      const newBuyturn = currentBuyturn + purchasedQuantity;

      const [updatedRows] = await db.ProDetail.update(
        {
          quantity: newQuantity,
          buyturn: newBuyturn,
        },
        {
          where: { id: item.product_detail_id },
          transaction: transaction,
        },
      );

      console.log(`✅ Updated ProDetail ID ${item.product_detail_id}:`, {
        before: { quantity: currentQuantity, buyturn: currentBuyturn },
        after: { quantity: newQuantity, buyturn: newBuyturn },
        rowsAffected: updatedRows,
      });

      // ✅ VERIFY: Đọc lại giá trị sau khi update
      const verifyDetail = await db.ProDetail.findByPk(item.product_detail_id, {
        transaction,
      });
      console.log(`🔍 Verify ProDetail ID ${item.product_detail_id}:`, {
        quantity: verifyDetail.quantity,
        buyturn: verifyDetail.buyturn,
      });

      orderDetails.push({
        ...orderDetail.toJSON(),
        product_details: {
          ...item.product_details.toJSON(),
          quantity: newQuantity,
          buyturn: newBuyturn,
        },
      });
    }

    // ===== 6. XÓA GIỎ HÀNG VÀ CART ITEMS =====
    await db.CartItem.destroy({
      where: { cart_id: cart.id },
      transaction: transaction,
    });

    await cart.destroy({ transaction: transaction });

    // ===== 7. COMMIT TRANSACTION =====
    await transaction.commit();

    // ===== 8. GỬI EMAIL XÁC NHẬN =====
    EmailService.sendOrderConfirmation(user.email, {
      order: newOrder,
      user: user,
      orderDetails: orderDetails,
    }).catch((error) => {
      console.error("❌ Email sending failed:", error);
    });

    // ===== 9. TRẢ VỀ RESPONSE =====
    return res.status(201).json({
      message: "Thanh toán giỏ hàng thành công",
      data: {
        order: newOrder,
        orderDetails: orderDetails,
        totalItems: orderDetails.length,
        totalAmount: newOrder.total,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("❌ Checkout error:", error);
    return res.status(500).json({
      message: "Lỗi khi thanh toán giỏ hàng",
      error: error.message,
      stack: error.stack, // ← Thêm để debug
    });
  }
}

// Xóa toàn bộ cart items trong giỏ hàng nhưng giữ lại cart
export async function clearCart(req, res) {
  try {
    const { id } = req.params;

    // Tìm cart
    const cart = await db.Cart.findByPk(id, {
      include: {
        model: db.CartItem,
        as: "cart_items",
      },
    });

    if (!cart) {
      return res.status(404).json({
        message: "Không tìm thấy giỏ hàng",
      });
    }

    if (!cart.cart_items || cart.cart_items.length === 0) {
      return res.status(200).json({
        message: "Giỏ hàng đã rỗng",
        data: cart,
      });
    }

    // Xóa tất cả cart_items
    await db.CartItem.destroy({
      where: { cart_id: cart.id },
    });

    return res.status(200).json({
      message: "Xóa toàn bộ sản phẩm trong giỏ hàng thành công",
      data: { ...cart.toJSON(), cart_items: [] },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi xóa sản phẩm trong giỏ hàng",
      error: error.message,
    });
  }
}

export async function deleteCart(req, res) {
  const { id } = req.params;

  const deleted = await db.Cart.destroy({ where: { id } });

  if (deleted) {
    return res.status(200).json({ message: "Xóa giỏ hàng thành công" });
  }

  return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
}
