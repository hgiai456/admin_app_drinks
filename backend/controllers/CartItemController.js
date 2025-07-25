import db from "../models";
import { Sequelize, where } from "sequelize";
const { Op } = Sequelize;

export async function getCartItems(req, res) {
  const { cart_id } = req.query;

  let whereClause = {};
  if (cart_id) {
    whereClause.cart_id = cart_id;
  }

  const items = await db.CartItem.findAll({
    where: whereClause,
    include: db.ProDetail,
    as: "product_details",
  });

  res.status(200).json({
    message: "Lấy danh sách sản phẩm trong giỏ hàng thành công",
    data: items,
  });
}

export async function getCartItemByCartId(req, res) {
  const { cart_id } = req.params;

  const cartItems = await db.CartItem.findAll({
    where: { cart_id: cart_id },
    include: {
      model: db.ProDetail,
      as: "product_details",
      include: {
        model: db.Product,
        as: "product",
      },
    },
  });

  res.status(200).json({
    message: "Lấy sản phẩm trong giỏ hàng thành công",
    data: cartItems,
  });
}

export async function insertCartItem(req, res) {
  //check if produ
  const { cart_id, product_detail_id, quantity } = req.body;

  const cart = await db.Cart.findByPk(cart_id);
  if (!cart) {
    return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
  }

  const productDetailExists = await db.ProDetail.findByPk(product_detail_id);
  if (!productDetailExists) {
    return res.status(404).json({ message: "Sản phẩm chi tiết không tồn tại" });
  }
  if (productDetailExists.quantity < quantity) {
    return res.status(400).json({
      message: `Số lượng trong kho không đủ. Chỉ còn lại ${productDetailExists.quantity} sản phẩm.`,
    });
  }
  // check if productDetailExists.quantity < quantity => send error
  const existingItem = await db.CartItem.findOne({
    where: {
      cart_id: cart_id,
      product_detail_id: product_detail_id,
    },
  });
  if (existingItem) {
    if (quantity === 0) {
      // Nếu số lượng = 0, xóa CartItem
      await existingItem.destroy();
      return res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ hàng" });
    } else {
      // Nếu đã tồn tại, cập nhật số lượng
      existingItem.quantity = quantity;
      await existingItem.save();
      return res.status(200).json({
        message: "Cập nhật số lượng sản phẩm trong giỏ hàng thành công",
        data: existingItem,
      });
    }
  } else {
    if (quantity > 0) {
      const newItem = await db.CartItem.create({
        cart_id,
        product_detail_id,
        quantity,
      });

      return res.status(201).json({
        message: "Thêm sản phẩm vào giỏ hàng thành công",
        data: newItem,
      });
    }
    // Nếu chưa tồn tại, tạo mới
  }
  return res.status(201).json({
    message: "Thêm sản phẩm vào giỏ thành công",
    data: cartItem,
  });
}

export async function updateCartItem(req, res) {
  const { id } = req.params;
  const { quantity } = req.body;

  const [updated] = await db.CartItem.update({ quantity }, { where: { id } });

  if (updated) {
    return res.status(200).json({
      message: "Cập nhật số lượng sản phẩm thành công",
    });
  }

  return res.status(404).json({
    message: "Không tìm thấy sản phẩm trong giỏ hàng",
  });
}

export async function deleteCartItem(req, res) {
  const { id } = req.params;

  const deleted = await db.CartItem.destroy({ where: { id } });

  if (deleted) {
    return res.status(200).json({
      message: "Xóa sản phẩm khỏi giỏ hàng thành công",
    });
  }

  return res.status(404).json({
    message: "Không tìm thấy sản phẩm trong giỏ hàng",
  });
}
