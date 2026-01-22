import VNPayService from "../services/VNPayService.js";
import SePayService from "../services/SePayService.js";
// import EmailService from "../services/EmailService.js";
import db from "../models/index.js";
import dotenv from "dotenv";

dotenv.config();

export async function createPayment(req, res) {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      cart_id,
      user_id,
      phone,
      address,
      note,
      total_amount,
      payment_method = "sepay",
    } = req.body;

    if (!cart_id || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc: cart_id, phone, address",
      });
    }

    const validPaymentMethods = ["cod", "vnpay", "sepay"];
    if (!validPaymentMethods.includes(payment_method)) {
      return res.status(400).json({
        success: false,
        message: `Phương thức thanh toán không hợp lệ Chỉ chấp nhận: ${validPaymentMethods.join(
          ", ",
        )}`,
      });
    }

    const cart = await db.Cart.findByPk(cart_id, {
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
      { transaction },
    );

    for (const item of cart.cart_items) {
      await db.OrderDetail.create(
        {
          order_id: order.id,
          product_detail_id: item.product_detail_id,
          quantity: item.quantity,
          price: item.product_details.price,
        },
        { transaction },
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
        },
      );

      console.log(`✅ Updated ProDetail ID ${item.product_detail_id}:`, {
        before: { quantity: currentQuantity, buyturn: currentBuyturn },
        after: { quantity: newQuantity, buyturn: newBuyturn },
      });
    }

    let paymentResult;
    let paymentUrl = null;
    let qrCode = null;

    if (payment_method === "sepay") {
      const paymentData = {
        orderId: order.id,
        amount: finalTotal,
        description: `Thanh toán đơn hàng #${order.id} - HG Coffee`,
      };
      paymentResult = await SePayService.createPaymentQRCode(paymentData);

      if (!paymentResult.success) {
        await transaction.rollback();
        return res.status(500).json({
          success: false,
          message: "Không thể tạo tạo mã qr thanh toán SePay",
          error: paymentResult.error,
        });
      }
      qrCode = paymentResult.qrCode;
      paymentUrl = null;
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
        transaction_id: order.id.toString(),
        payment_url: paymentUrl,
        callback_data: JSON.stringify(paymentResult || {}),
      },
      { transaction },
    );

    await transaction.commit();

    const responseData = {
      order_id: order.id,
      payment_id: payment.id,
      payment_method: payment_method,
      payment_url: paymentUrl,
      qr_code: qrCode,
      order_code: order.id,
      total_amount: finalTotal,
    };

    if (payment_method === "sepay" && paymentResult.accountInfo) {
      responseData.sepay_info = {
        account_number: paymentResult.accountInfo.accountNumber,
        account_name: paymentResult.accountInfo.accountName,
        bank_name: paymentResult.accountInfo.bankName,
        bank_code: paymentResult.accountInfo.bankCode,
        transfer_content: paymentResult.transferContent,
      };
    }

    res.status(200).json({
      success: true,
      message: "Tạo thanh toán thành công",
      data: responseData,
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

export async function checkSePayPayment(req, res) {
  try {
    const { orderId } = req.body;

    console.log("🔍 checkSePayPayment called with orderId:", orderId);

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu orderId",
      });
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
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin thanh toán",
      });
    }

    console.log("📦 Current payment status in DB:", payment.status);

    if (payment.status === "completed") {
      console.log("✅ Payment already completed in DB!");
      return res.status(200).json({
        success: true,
        message: "Thanh toán thành công!",
        data: {
          status: "completed",
          order_id: orderId,
          payment_id: payment.id,
          amount: payment.amount,
        },
      });
    }

    // BƯỚC 3: NẾU CHƯA COMPLETED → THỬ GỌI SEPAY API (optional)
    // Nếu API lỗi thì vẫn trả về pending, không block user
    try {
      const checkResult = await SePayService.checkTransaction(
        orderId,
        parseFloat(payment.amount),
      );

      console.log("📦 SePay API check result:", checkResult);

      // Nếu tìm thấy giao dịch qua API → Update DB
      if (checkResult.found && checkResult.transaction) {
        const transaction = await db.sequelize.transaction();

        try {
          await payment.update(
            {
              status: "completed",
              transaction_id:
                checkResult.transaction.reference || orderId.toString(),
              callback_data: JSON.stringify(checkResult.transaction),
            },
            { transaction },
          );

          await payment.order.update({ status: 2 }, { transaction });

          // Xóa giỏ hàng
          if (payment.order.user_id) {
            const cart = await db.Cart.findOne({
              where: { user_id: payment.order.user_id },
            });
            if (cart) {
              await db.CartItem.destroy({
                where: { cart_id: cart.id },
                transaction,
              });
            }
          }

          await transaction.commit();

          console.log("✅ Payment updated via API check!");

          return res.status(200).json({
            success: true,
            message: "Thanh toán thành công!",
            data: {
              status: "completed",
              order_id: orderId,
              payment_id: payment.id,
              amount: payment.amount,
            },
          });
        } catch (dbError) {
          await transaction.rollback();
          throw dbError;
        }
      }
    } catch (apiError) {
      // API lỗi → Bỏ qua, tiếp tục check DB lần nữa
      console.log("⚠️ SePay API error (ignored):", apiError.message);
    }

    // ✅ BƯỚC 4: CHECK DB LẦN CUỐI (có thể webhook đã update trong lúc gọi API)
    const refreshedPayment = await db.Payment.findOne({
      where: { order_id: orderId },
    });

    if (refreshedPayment?.status === "completed") {
      console.log("✅ Payment completed (detected on refresh)!");
      return res.status(200).json({
        success: true,
        message: "Thanh toán thành công!",
        data: {
          status: "completed",
          order_id: orderId,
          payment_id: refreshedPayment.id,
          amount: refreshedPayment.amount,
        },
      });
    }

    // ✅ BƯỚC 5: VẪN PENDING → Trả về pending
    console.log("⏳ Payment still pending");
    return res.status(200).json({
      success: true,
      message: "Đang chờ xác nhận thanh toán...",
      data: {
        status: "pending",
        order_id: orderId,
        hint: "Sau khi chuyển tiền, hệ thống sẽ tự động xác nhận trong 1-2 phút.",
      },
    });
  } catch (error) {
    console.error("❌ Check SePay payment error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi kiểm tra thanh toán",
      error: error.message,
    });
  }
}

//SePay WebHook Handler
export async function sepayWebhook(req, res) {
  try {
    const webhookData = req.body;
    console.log("Received SePay webhook:", webhookData);

    if (!SePayService.verifyWebhook(webhookData)) {
      console.error("❌ Invalid webhook - wrong account");
      return res.status(400).json({
        success: false,
        message: "Invalid account",
      });
    }

    const parsed = SePayService.parseWebhookData(webhookData);

    if (!parsed.isValid || !parsed.orderId) {
      console.log(
        "⚠️ Cannot parse orderId from webhook content:",
        webhookData.content,
      );
      // Vẫn trả về 200 để SePay không retry
      return res.status(200).json({
        success: true,
        message: "Webhook received but no matching order",
      });
    }

    const { orderId, amount, transactionId, content } = parsed;

    //Tim payment theo order id
    const payment = await db.Payment.findOne({
      where: { order_id: orderId },
      include: [{ model: db.Order, as: "order" }],
    });

    if (!payment) {
      console.error(" Payment not found for order:", orderId);
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (Math.abs(payment.amount - amount) > 1) {
      console.error("Amount mismatch:", {
        expected: payment.amount,
        received: amount,
      });
      return res.status(400).json({
        success: false,
        message: "Amount mismatch",
      });
    }

    if (payment.status === "completed") {
      console.log("⚠️ Payment already completed");
      return res.status(200).json({
        success: true,
        message: "Already completed",
      });
    }

    const transaction = await db.sequelize.transaction();

    try {
      await payment.update(
        {
          status: "completed",
          transaction_id: transactionId || orderId.toString(),
          callback_data: JSON.stringify(webhookData),
        },
        { transaction },
      );

      await payment.order.update(
        {
          status: 2, // Đã thanh toán
        },
        { transaction },
      );

      if (payment.order.user_id) {
        const cart = await db.Cart.findOne({
          where: { user_id: payment.order.user_id },
        });

        if (cart) {
          await db.CartItem.destroy({
            where: { cart_id: cart.id },
            transaction,
          });
          console.log(`Cleared cart for user ${payment.order.user_id}`);
        }
      }

      await transaction.commit();

      console.log("Payment completed via webhook:", {
        orderId,
        amount,
        transactionId,
      });

      // try {
      //   const user = await db.User.findByPk(payment.order.user_id);
      //   if (user?.email) {
      //     await EmailService.sendOrderConfirmation(user.email, {
      //       order: orderId,
      //       user: user.name,
      //       total: payment.amount,
      //     });
      //     console.log("📧 Email sent to:", user.email);
      //   }
      // } catch (emailError) {
      //   console.error("❌ Email error:", emailError.message);
      // }

      res.status(200).json({
        success: true,
        message: "Webhook processed successfully",
        data: {
          orderId: parseInt(orderId),
          status: payment.status,
          transactionId: payment.transaction_id,
        },
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("SePay webhook processing error:", error);
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
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
    const amount = parseInt(vnpayData.vnp_Amount) / 100;

    //Verify the signature
    const verification = VNPayService.verifyIpnCall(vnpayData);

    if (!verification.isValid) {
      console.error(" Invalid signature");
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
        { transaction },
      );

      if (payment.order) {
        await payment.order.update(
          {
            status: orderStatus,
          },
          { transaction },
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
            { transaction },
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
      `${process.env.CLIENT_URL}/payment-result?status=error&message=${error.message}`,
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
        { transaction },
      );

      await payment.order.update(
        {
          status: orderStatus,
          payment_status: paymentStatus,
        },
        { transaction },
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
        { transaction },
      );
      await payment.order.update(
        {
          status: orderStatus,
        },
        { transaction },
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
            { transaction },
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
                  as: "product_details",
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
    const { orderCode, payment_method } = req.query;

    if (!orderCode) {
      return res.status(400).json({
        success: false,
        message: "Thiếu orderCode",
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

    let finalStatus = payment.status;

    if (payment_method === "sepay") {
      finalStatus = payment.status;
    }

    res.status(200).json({
      success: true,
      message: "Xác thực thanh toán thành công",
      data: {
        status: finalStatus,
        order: payment.order,
        payment_info: {
          amount: payment.amount,
          payment_method: payment.payment_method,
          transaction_id: payment.transaction_id,
        },
      },
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xác thực thanh toán",
      error: error.message,
    });
  }
}

export async function confirmPaymentManual(req, res) {
  const transaction = await db.sequelize.transaction();

  try {
    const { orderId, transactionId, adminNote } = req.body;

    if (!orderId) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Thiếu orderId",
      });
    }

    console.log("🔧 Manual payment confirmation for order:", orderId);

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
                  as: "product_details",
                  include: [
                    { model: db.Product, as: "product" },
                    { model: db.Size, as: "sizes" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!payment) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin thanh toán",
      });
    }

    if (payment.status === "completed") {
      await transaction.rollback();
      return res.status(200).json({
        success: true,
        message: "Thanh toán đã được xác nhận trước đó",
        data: {
          status: "completed",
          order_id: orderId,
        },
      });
    }

    // Cập nhật payment
    await payment.update(
      {
        status: "completed",
        transaction_id: transactionId || `MANUAL-${orderId}-${Date.now()}`,
        callback_data: JSON.stringify({
          type: "manual_confirmation",
          adminNote: adminNote || "",
          confirmedAt: new Date().toISOString(),
        }),
      },
      { transaction },
    );

    // Cập nhật order status
    await payment.order.update(
      {
        status: 2, // Đã thanh toán
      },
      { transaction },
    );

    // Xóa giỏ hàng
    if (payment.order.user_id) {
      const cart = await db.Cart.findOne({
        where: { user_id: payment.order.user_id },
      });
      if (cart) {
        await db.CartItem.destroy({
          where: { cart_id: cart.id },
          transaction,
        });
        console.log(`🗑️ Cleared cart for user ${payment.order.user_id}`);
      }
    }

    await transaction.commit();

    // Gửi email xác nhận
    try {
      const user = await db.User.findByPk(payment.order.user_id);
      if (user?.email) {
        await sendOrderConfirmationEmail(user.email, {
          orderId: orderId,
          customerName: user.name,
          phone: payment.order.phone,
          address: payment.order.address,
          total: payment.amount,
          paymentMethod: "SePay (Chuyển khoản)",
          items: payment.order.order_details.map((detail) => ({
            name: detail.product_details?.product?.name || "Sản phẩm",
            size: detail.product_details?.sizes?.name || "",
            quantity: detail.quantity,
            price: detail.price,
          })),
        });
        console.log("📧 Confirmation email sent to:", user.email);
      }
    } catch (emailError) {
      console.error("❌ Email error:", emailError.message);
    }

    console.log("✅ Payment manually confirmed:", orderId);

    res.status(200).json({
      success: true,
      message: "Xác nhận thanh toán thành công!",
      data: {
        status: "completed",
        order_id: orderId,
        payment_id: payment.id,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("❌ Manual confirmation error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xác nhận thanh toán",
      error: error.message,
    });
  }
}

/**
 * ✅ API MỚI: User báo đã thanh toán (để Admin xác nhận)
 * POST /api/payments/report-paid
 */
export async function reportPaid(req, res) {
  try {
    const { orderId, transferInfo } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu orderId",
      });
    }

    const payment = await db.Payment.findOne({
      where: { order_id: orderId },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Cập nhật callback_data để lưu thông tin user báo
    const currentData = payment.callback_data
      ? JSON.parse(payment.callback_data)
      : {};

    await payment.update({
      callback_data: JSON.stringify({
        ...currentData,
        userReportedPaid: true,
        reportedAt: new Date().toISOString(),
        transferInfo: transferInfo || "",
      }),
    });

    console.log("📝 User reported payment for order:", orderId);

    res.status(200).json({
      success: true,
      message:
        "Đã ghi nhận thông tin thanh toán. Admin sẽ xác nhận trong giây lát.",
      data: {
        order_id: orderId,
        status: "pending_confirmation",
      },
    });
  } catch (error) {
    console.error("❌ Report paid error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
}
