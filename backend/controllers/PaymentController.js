import PayOSService from "../services/PayOSService.js";
import VNPayService from "../services/VNPayService.js";
import db from "../models/index.js";
import dotenv from "dotenv";

dotenv.config();

export async function createPayment(req, res) {
  // Nguyên lý hoạt động
  const transaction = await db.sequelize.transaction();

  try {
    const {
      cart_id,
      user_id,
      phone,
      address,
      note,
      total_amount,
      payment_method = "payos",
    } = req.body;

    if (!cart_id || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc: cart_id, phone, address",
      });
    }

    const cart = await db.Cart.findByPk(cart_id, {
      //
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
      transaction,
    });

    if (!cart || !cart.cart_items || cart.cart_items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng trống hoặc không tồn tại",
      });
    }

    let calculatedTotal = 0;
    const paymentItems = [];

    for (const item of cart.cart_items) {
      const itemTotal = item.quantity * item.product_details.price;
      calculatedTotal += itemTotal;

      paymentItems.push({
        name: `${item.product_details.product.name} (${item.product_details.sizes.name})`,
        quantity: item.quantity,
        price: Math.round(item.product_details.price),
      });
    }

    const finalTotal = total_amount || calculatedTotal;
    if (Math.abs(finalTotal - calculatedTotal) > 1) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Tổng tiền không khớp với giỏ hàng",
      });
    }

    const outOfStockItems = [];
    const insufficientStockItems = [];

    for (const item of cart.cart_items) {
      const productDetail = item.product_details;

      if (!productDetail || productDetail.quantity <= 0) {
        outOfStockItems.push({
          product_name: productDetail?.product?.name || "Unknown",
          size_name: productDetail?.sizes?.name || "Unknown",
          requested_quantity: item.quantity,
          available_quantity: 0,
        });
      } else if (productDetail.quantity < item.quantity) {
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

      let errorMessage = "Không thể thanh toán do:\n";

      if (outOfStockItems.length > 0) {
        errorMessage += "\n Sản phẩm đã hết hàng:\n";
        outOfStockItems.forEach((item) => {
          errorMessage += `  • ${item.product_name} (${item.size_name}) - Yêu cầu: ${item.requested_quantity}, Còn lại: 0\n`;
        });
      }

      if (insufficientStockItems.length > 0) {
        errorMessage += "\n Sản phẩm không đủ số lượng:\n";
        insufficientStockItems.forEach((item) => {
          errorMessage += `  • ${item.product_name} (${item.size_name}) - Yêu cầu: ${item.requested_quantity}, Còn lại: ${item.available_quantity}\n`;
        });
      }

      return res.status(400).json({
        success: false,
        message: errorMessage.trim(),
        outOfStockItems: outOfStockItems,
        insufficientStockItems: insufficientStockItems,
      });
    }

    const order = await db.Order.create(
      {
        user_id: user_id || null,
        phone: phone.trim(),
        address: address.trim(),
        note: note?.trim() || "",
        total: finalTotal,
        status: 1, // Chờ thanh toán
        payment_method: payment_method,
        payment_status: "pending",
      },
      { transaction }
    );

    for (const item of cart.cart_items) {
      await db.OrderDetail.create(
        {
          order_id: order.id,
          product_detail_id: item.product_detail_id,
          quantity: item.quantity,
          price: item.product_details.price,
        },
        { transaction }
      );

      const currentQuantity = item.product_details.quantity;
      const currentBuyturn = item.product_details.buyturn || 0;
      const purchasedQuantity = item.quantity;

      const newQuantity = currentQuantity - purchasedQuantity;
      const newBuyturn = currentBuyturn + purchasedQuantity;

      await db.ProDetail.update(
        {
          quantity: newQuantity,
          buyturn: newBuyturn,
        },
        {
          where: { id: item.product_detail_id },
          transaction: transaction,
        }
      );

      console.log(`✅ Updated ProDetail ID ${item.product_detail_id}:`, {
        before: { quantity: currentQuantity, buyturn: currentBuyturn },
        after: { quantity: newQuantity, buyturn: newBuyturn },
      });
    }

    let paymentResult;
    let paymentUrl = null;
    let qrCode = null;

    if (payment_method === "payos") {
      const paymentData = {
        orderId: order.id,
        amount: finalTotal,
        description: `Thanh toán đơn hàng #${order.id} - HG Coffee`,
        buyerName: "Khách hàng",
        buyerPhone: phone,
        buyerAddress: address,
        items: paymentItems,
      };

      paymentResult = await PayOSService.createPaymentLink(paymentData);

      if (!paymentResult.success) {
        await transaction.rollback();
        return res.status(500).json({
          success: false,
          message: "Không thể tạo liên kết thanh toán PayOS",
          error: paymentResult.error,
        });
      }

      paymentUrl = paymentResult.paymentUrl;
      qrCode = paymentResult.qrCode;
    } else if (payment_method === "vnpay") {
      const ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        "127.0.0.1";

      const vnpayData = {
        orderId: order.id,
        amount: finalTotal,
        orderDescription: `Thanh toán đơn hàng #${order.id} - HG Coffee`,
        orderType: "billpayment",
        locale: "vn",
      };

      paymentResult = await VNPayService.createPaymentUrl(vnpayData, ipAddr);

      if (!paymentResult.success) {
        await transaction.rollback();
        return res.status(500).json({
          success: false,
          message: "Không thể tạo liên kết thanh toán VNPAY",
          error: paymentResult.error,
        });
      }

      paymentUrl = paymentResult.paymentUrl;
    } else if (payment_method === "cod") {
      // COD - Không cần payment link
      paymentResult = {
        success: true,
        orderCode: order.id,
      };
    }

    const payment = await db.Payment.create(
      {
        order_id: order.id,
        payment_method: payment_method,
        amount: finalTotal,
        status: payment_method === "cod" ? "pending" : "pending",
        transaction_id:
          paymentResult.orderCode?.toString() || order.id.toString(),
        payment_url: paymentUrl,
        payos_order_code:
          payment_method === "payos" ? paymentResult.orderCode : null,
        callback_data: JSON.stringify(paymentResult),
      },
      { transaction }
    );

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Tạo thanh toán thành công",
      data: {
        order_id: order.id,
        payment_id: payment.id,
        payment_method: payment_method,
        payment_url: paymentUrl,
        qr_code: qrCode,
        order_code: paymentResult.orderCode || order.id,
        total_amount: finalTotal,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("❌ Create payment error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo thanh toán",
      error: error.message,
    });
  }
}

export async function vnpayReturn(req, res) {
  try {
    const vnpayData = req.query;
    const orderId = vnpayData.vnp_TxnRef;
    const responseCode = vnpayData.vnp_ResponseCode;
    const transactionNo = vnpayData.vnp_TransactionNo;
    const amount = parseInt(vnpayData.vnp_Amount) / 100; //VNPAY gửi amount nhân 100

    //Verify the signature
    const verification = VNPayService.verifyIpnCall(vnpayData);

    if (!verification.isValid) {
      console.error("❌ Invalid signature");
      const redirectUrl = `${
        process.env.CLIENT_URL || "http://localhost:5173"
      }/#payment-result?status=error&message=Invalid+signature&orderId=${orderId}`;
      console.log("🔗 Redirecting to:", redirectUrl);
      return res.redirect(redirectUrl);
    }

    const payment = await db.Payment.findOne({
      where: { order_id: orderId },
      include: [
        {
          model: db.Order,
          as: "order",
        },
      ],
    });

    if (!payment) {
      console.error("❌ Payment not found for order:", orderId);
      const redirectUrl = `${
        process.env.CLIENT_URL || "http://localhost:5173"
      }/#payment-result?status=error&message=Payment+not+found&orderId=${orderId}`;
      return res.redirect(redirectUrl);
    }
    console.log("📦 Found payment:", {
      payment_id: payment.id,
      order_id: payment.order_id,
      current_payment_status: payment.status,
      current_order_status: payment.order?.status,
    });
    const transaction = await db.sequelize.transaction();

    try {
      let paymentStatus = "pending";
      let orderStatus = 1;
      let redirectStatus = "pending";

      if (responseCode === "00") {
        paymentStatus = "completed";
        orderStatus = 2;
        redirectStatus = "success";
      } else {
        paymentStatus = "failed";
        orderStatus = 7; // Đã thất bại
        redirectStatus = "failed";
        console.log("❌ Payment FAILED with code:", responseCode);
      }

      await payment.update(
        {
          status: paymentStatus,
          transaction_id: transactionNo || orderId.toString(),
          callback_data: JSON.stringify(vnpayData),
        },
        { transaction }
      );

      if (payment.order) {
        await payment.order.update(
          {
            status: orderStatus,
          },
          { transaction }
        );
      }

      if (paymentStatus === "completed" && payment.order.user_id) {
        const cart = await db.Cart.findOne({
          where: { user_id: payment.order.user_id },
        });

        if (cart) {
          await db.CartItem.destroy(
            {
              where: { cart_id: cart.id },
            },
            { transaction }
          );
        }
      }
      await transaction.commit();
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      const redirectUrl = `${clientUrl}/#payment-result?status=${redirectStatus}&orderId=${orderId}&amount=${amount}`;

      console.log("🔗 Redirecting to:", redirectUrl);

      return res.redirect(redirectUrl);
    } catch (dbError) {
      await transaction.rollback();
      console.error("❌ Database error:", dbError);
      const redirectUrl = `${
        process.env.CLIENT_URL || "http://localhost:5173"
      }/#payment-result?status=error&message=Database+error&orderId=${orderId}`;
      return res.redirect(redirectUrl);
    }
  } catch (error) {
    console.error("❌ VNPAY return error:", error);
    return res.redirect(
      `${process.env.CLIENT_URL}/payment-result?status=error&message=${error.message}`
    );
  }
}

export async function vnpayIPN(req, res) {
  try {
    const vnpayData = req.query;
    console.log("📨 VNPAY IPN:", vnpayData);

    // Xác thực
    const verification = VNPayService.verifyIpnCall(vnpayData);

    if (!verification.isValid) {
      return res.status(200).json({
        RspCode: "97",
        Message: "Invalid signature",
      });
    }

    const { orderId, responseCode, amount, transactionNo } = verification;

    // Tìm payment
    const payment = await db.Payment.findOne({
      where: { transaction_id: orderId.toString() },
      include: [
        {
          model: db.Order,
          as: "order",
        },
      ],
    });

    if (!payment) {
      return res.status(200).json({
        RspCode: "01",
        Message: "Order not found",
      });
    }

    // Kiểm tra amount
    if (Math.abs(payment.amount - amount) > 1) {
      return res.status(200).json({
        RspCode: "04",
        Message: "Invalid amount",
      });
    }

    // Kiểm tra đã xử lý chưa
    if (payment.status !== "pending") {
      return res.status(200).json({
        RspCode: "02",
        Message: "Order already confirmed",
      });
    }

    const transaction = await db.sequelize.transaction();

    try {
      let paymentStatus = "pending";
      let orderStatus = 1;

      if (responseCode === "00") {
        paymentStatus = "completed";
        orderStatus = 2;
      } else {
        paymentStatus = "failed";
        orderStatus = 6;
      }

      await payment.update(
        {
          status: paymentStatus,
          transaction_id: transactionNo || orderId.toString(),
          callback_data: JSON.stringify(vnpayData),
        },
        { transaction }
      );

      await payment.order.update(
        {
          status: orderStatus,
          payment_status: paymentStatus,
        },
        { transaction }
      );

      await transaction.commit();

      return res.status(200).json({
        RspCode: "00",
        Message: "Confirm Success",
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("❌ VNPAY IPN error:", error);
    return res.status(200).json({
      RspCode: "99",
      Message: "Unknown error",
    });
  }
}

export async function paymentWebhook(req, res) {
  try {
    const webhookData = req.body;
    console.log("📨 Received PayOS webhook:", webhookData);

    const verification = await PayOSService.verifyWebhookData(webhookData);

    if (!verification.isValid) {
      console.error("❌ Invalid webhook signature");
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const { orderCode, code, desc, data } = webhookData;

    //Tim payment theo order code
    const payment = await db.Payment.findOne({
      where: { transaction_id: orderCode },
      include: [
        {
          model: db.Order,
          as: "order",
        },
      ],
    });

    if (!payment) {
      console.error("❌ Payment not found for order code:", orderCode);
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const transaction = await db.sequelize.transaction();

    try {
      let paymentStatus = "pending";
      let orderStatus = 1;

      if (code === "00") {
        // Thành công
        paymentStatus = "completed";
        orderStatus = 2; // Đã thanh toán
      } else if (code === "01") {
        // Thất bại
        paymentStatus = "failed";
        orderStatus = 6; // Đã hủy
      } else {
        // Pending hoặc processing
        paymentStatus = "processing";
        orderStatus = 1; // Chờ xác nhận
      }
      await payment.update(
        {
          status: paymentStatus,
          callback_data: JSON.stringify(webhookData),
        },
        { transaction }
      );
      await payment.order.update(
        {
          status: orderStatus,
        },
        { transaction }
      );
      //Nếu thanh toán thành công, xóa cart
      if (paymentStatus === "completed") {
        const cart = await db.Cart.findOne({
          where: { user_id: payment.order.user_id },
        });

        if (cart) {
          await db.CartItem.destroy(
            {
              where: { cart_id: cart.id },
            },
            { transaction }
          );
        }
      }

      await transaction.commit();
      console.log(`✅ Payment ${orderCode} updated to ${paymentStatus}`);

      res.status(200).json({
        success: true,
        message: "Webhook processed successfully",
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
      error: error.message,
    });
  }
}

export async function getPaymentStatus(req, res) {
  try {
    const { orderId } = req.params;

    const payment = await db.Payment.findOne({
      where: { order_id: orderId },
      include: [
        {
          model: db.Order,
          as: "order",
          include: [
            {
              model: db.OrderDetail,
              as: "order_details",
              include: [
                {
                  model: db.ProDetail,
                  as: "product_detail",
                  include: [
                    {
                      model: db.Product,
                      as: "product",
                      attributes: ["name", "image"],
                    },
                    {
                      model: db.Size,
                      as: "sizes",
                      attributes: ["name"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin thanh toán",
      });
    }
    res.status(200).json({
      success: true,
      message: "Lấy trạng thái thanh toán thành công",
      data: {
        payment_id: payment.id,
        order_id: payment.order_id,
        status: payment.status,
        amount: payment.amount,
        payment_method: payment.payment_method,
        transaction_id: payment.transaction_id,
        order: payment.order,
      },
    });
  } catch (error) {
    console.error("❌ Get payment status error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy trạng thái thanh toán",
      error: error.message,
    });
  }
}

export async function verifyPayment(req, res) {
  try {
    const { orderCode, status } = req.query;

    if (!orderCode) {
      return res.status(400).json({
        success: false,
        message: "Thiếu orderCode",
      });
    }
    const payosResult = await PayOSService.getPaymentLinkInformation(orderCode);

    if (!payosResult.success) {
      return res.status(400).json({
        success: false,
        message: "Không thể xác thực thanh toán",
      });
    }

    const payment = await db.Payment.findOne({
      where: { transaction_id: orderCode },
      include: [
        {
          model: db.Order,
          as: "order",
        },
      ],
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin thanh toán",
      });
    }

    const payosData = payosResult.data;
    let finalStatus = "pending";

    //Xac dinh trang thai cuoi cung
    // ✅ Xác định trạng thái cuối cùng
    if (payosData.status === "PAID") {
      finalStatus = "success";
    } else if (payosData.status === "CANCELLED") {
      finalStatus = "cancelled";
    } else if (payosData.status === "EXPIRED") {
      finalStatus = "failed";
    }

    res.status(200).json({
      success: true,
      message: "Xác thực thanh toán thành công",
      data: {
        status: finalStatus,
        order: payment.order,
        payment_info: payosData,
      },
    });
  } catch (error) {
    console.error("❌ Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xác thực thanh toán",
      error: error.message,
    });
  }
}
