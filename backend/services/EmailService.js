import nodemailer from "nodemailer";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

class EmailService {
  async sendOrderConfirmation(userEmail, orderData) {
    const { order, user, orderDetails } = orderData;
    //Calculate total items
    const totalitems = orderDetails.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    // Firebase logo URL
    const logoUrl =
      "https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751092040674-logo.png?alt=media&token=4b72bf76-9c9c-4257-9290-808098ceac2f";
    const orderItemsHtml = orderDetails
      .map((item) => {
        const productName = item.product_details?.name || "Sản phẩm";
        const quantity = item.quantity || 0;
        const price = item.price || 0;

        return `
                <tr>
                    <td style="padding: 20px 16px; border-bottom: 1px solid #2a2a2a; background-color: #1a1a1a; color: #e8e8e8;">
                        <div style="font-weight: 500; font-size: 15px;">${productName}</div>
                    </td>
                    <td style="padding: 20px 16px; border-bottom: 1px solid #2a2a2a; text-align: center; background-color: #1a1a1a; color: #b8860b; font-weight: 600;">
                        ${quantity}
                    </td>
                    <td style="padding: 20px 16px; border-bottom: 1px solid #2a2a2a; text-align: right; background-color: #1a1a1a; color: #d4af37; font-weight: 500;">
                        ${this.formatCurrency(price)}
                    </td>
                    <td style="padding: 20px 16px; border-bottom: 1px solid #2a2a2a; text-align: right; background-color: #1a1a1a; color: #d4af37; font-weight: 600; font-size: 16px;">
                        ${this.formatCurrency(quantity * price)}
                    </td>
                </tr>`;
      })
      .join("");

    const emailTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận đơn hàng #${order.id}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f1ed; font-family: 'Segoe UI', Arial, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f1ed;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); border-radius: 12px 12px 0 0; padding: 40px 30px; text-align: center;">
                            <img src="${logoUrl}" alt="HG Store Logo" style="max-width: 100px; height: auto; margin-bottom: 20px; border-radius: 8px;" />
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 0.5px;">Xác nhận đơn hàng</h1>
                            <div style="width: 60px; height: 3px; background-color: #D2691E; margin: 15px auto 0;"></div>
                        </td>
                    </tr>
                    
                    <!-- Welcome Message -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 30px;">
                            <h2 style="color: #8B4513; margin: 0 0 15px 0; font-size: 22px; font-weight: 600;">
                                👋 Cảm ơn bạn đã đặt hàng!
                            </h2>
                            <p style="margin: 0 0 10px 0; font-size: 16px; color: #333333; line-height: 1.6;">
                                Xin chào <strong style="color: #8B4513;">${user.name}</strong>,
                            </p>
                            <p style="margin: 0; font-size: 15px; color: #666666; line-height: 1.6;">
                                Chúng tôi đã nhận được đơn hàng của bạn và đang xử lý. Dưới đây là thông tin chi tiết về đơn hàng của bạn.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Order Info -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 0 30px 30px;">
                            <h3 style="color: #8B4513; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
                                📋 Thông tin đơn hàng
                            </h3>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #faf8f5; border-radius: 8px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 15px 20px; border-bottom: 1px solid #e8dfd5;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="color: #666666; font-size: 14px;">🏷️ Mã đơn hàng:</td>
                                                <td style="color: #8B4513; font-size: 15px; font-weight: 600; text-align: right;">#${order.id}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 20px; border-bottom: 1px solid #e8dfd5;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="color: #666666; font-size: 14px;">📅 Ngày đặt:</td>
                                                <td style="color: #333333; font-size: 14px; text-align: right;">${new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 20px; border-bottom: 1px solid #e8dfd5;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="color: #666666; font-size: 14px;">📦 Tổng số sản phẩm:</td>
                                                <td style="color: #8B4513; font-size: 15px; font-weight: 600; text-align: right;">${totalitems} sản phẩm</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 20px; background-color: #f5ede3;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="color: #8B4513; font-size: 16px; font-weight: 600;">💰 Tổng tiền:</td>
                                                <td style="color: #8B4513; font-size: 18px; font-weight: 700; text-align: right;">${this.formatCurrency(order.total)}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Customer Info -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 0 30px 30px;">
                            <h3 style="color: #8B4513; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
                                👤 Thông tin người nhận
                            </h3>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #faf8f5; border-radius: 8px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 15px 20px; border-bottom: 1px solid #e8dfd5;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="color: #666666; font-size: 14px; width: 35%;">👨‍💼 Họ tên:</td>
                                                <td style="color: #8B4513; font-size: 15px; font-weight: 600; text-align: right;">${user.name}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 20px; border-bottom: 1px solid #e8dfd5;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="color: #666666; font-size: 14px; width: 35%;">📞 Điện thoại:</td>
                                                <td style="color: #333333; font-size: 14px; text-align: right;">${order.phone}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 20px; ${order.note ? "border-bottom: 1px solid #e8dfd5;" : ""}">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="color: #666666; font-size: 14px; width: 35%; vertical-align: top;">🏠 Địa chỉ:</td>
                                                <td style="color: #333333; font-size: 14px; text-align: right; line-height: 1.5;">${order.address}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                ${
                                  order.note
                                    ? `
                                <tr>
                                    <td style="padding: 15px 20px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="color: #666666; font-size: 14px; width: 35%; vertical-align: top;">📝 Ghi chú:</td>
                                                <td style="color: #8B4513; font-size: 14px; font-style: italic; text-align: right; line-height: 1.5;">${order.note}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                `
                                    : ""
                                }
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Product Details -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 0 30px 30px;">
                            <h3 style="color: #8B4513; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
                                🛒 Chi tiết sản phẩm
                            </h3>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #faf8f5; border-radius: 8px; overflow: hidden;">
                                <!-- Table Header -->
                                <tr style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);">
                                    <th style="padding: 12px 10px; text-align: left; font-size: 13px; color: #ffffff; font-weight: 600;">Sản phẩm</th>
                                    <th style="padding: 12px 10px; text-align: center; font-size: 13px; color: #ffffff; font-weight: 600; width: 70px;">SL</th>
                                    <th style="padding: 12px 10px; text-align: right; font-size: 13px; color: #ffffff; font-weight: 600; width: 100px;">Đơn giá</th>
                                    <th style="padding: 12px 10px; text-align: right; font-size: 13px; color: #ffffff; font-weight: 600; width: 110px;">Thành tiền</th>
                                </tr>
                                <!-- Product Items -->
                                ${orderItemsHtml}
                                <!-- Total -->
                                <tr style="background-color: #f5ede3; border-top: 2px solid #D2691E;">
                                    <td colspan="3" style="padding: 18px 10px; text-align: right; font-size: 16px; font-weight: 600; color: #8B4513;">
                                        💰 Tổng cộng:
                                    </td>
                                    <td style="padding: 18px 10px; text-align: right; font-size: 18px; font-weight: 700; color: #8B4513;">
                                        ${this.formatCurrency(order.total)}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Status Alert -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #D2691E 0%, #CD853F 100%); padding: 25px 30px; text-align: center; border-radius: 8px;">
                            <div style="color: #ffffff; font-size: 18px; font-weight: 600; margin-bottom: 10px;">
                                ⏰ Lưu ý quan trọng
                            </div>
                            <p style="margin: 0; font-size: 15px; color: #ffffff; line-height: 1.6;">
                                Đơn hàng của bạn đang được xử lý. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận và giao hàng.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); border-radius: 0 0 12px 12px; text-align: center; padding: 35px 30px;">
                            <img src="${logoUrl}" alt="HG Store Logo" style="max-width: 70px; height: auto; margin-bottom: 20px; border-radius: 8px;" />
                            
                            <p style="margin: 0 0 12px 0; font-size: 18px; color: #ffffff; font-weight: 600;">
                                ☕ Cảm ơn bạn đã tin tưởng HG Store! 🙏
                            </p>
                            <p style="color: #f5ede3; font-size: 13px; margin: 0 0 20px 0;">
                                Email này được gửi tự động, vui lòng không trả lời.
                            </p>
                            
                            <div style="padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.2);">
                                <p style="color: #ffffff; font-size: 13px; margin: 0 0 5px 0; font-weight: 500;">
                                    © 2024 HG Store - Hương vị cà phê đậm đà ☕
                                </p>
                                <p style="color: #f5ede3; font-size: 11px; margin: 0; opacity: 0.9;">
                                    Powered by Node.js & Coffee Love ☕
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    const apiKey = process.env.BREVO_SMTP_KEY;
    const sender = {
      name: "HG Coffee",
      email: "damhoagiai456@gmail.com",
    };

    const to = [
      {
        email: userEmail,
        name: user.name,
      },
    ];

    const subject = `Xác nhận đơn hàng #${order.id} - Cảm ơn bạn đã đặt hàng!`;
    const htmlContent = emailTemplate;

    try {
      await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender,
          to,
          subject,
          htmlContent,
        },
        {
          headers: {
            "api-key": apiKey,
            "Content-Type": "application/json",
          },
        },
      );
      console.log(`Order confirmation email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error(
        "Error sending email via Brevo API",
        error.response?.data || error.message,
      );
      return false;
    }
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }
}
export default new EmailService();
