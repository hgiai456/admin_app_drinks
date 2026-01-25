import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

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
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                
                .email-container {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    color: #e8e8e8;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                    min-height: 100vh;
                }
                
                .card {
                    background: linear-gradient(145deg, #1f1f1f 0%, #2d2d2d 100%);
                    border-radius: 16px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(212, 175, 55, 0.1);
                    overflow: hidden;
                }
                
                .accent-line {
                    height: 4px;
                    background: linear-gradient(90deg, #8b4513 0%, #d4af37 50%, #b8860b 100%);
                }
                
                .icon {
                    width: 20px;
                    height: 20px;
                    display: inline-block;
                    margin-right: 8px;
                    vertical-align: middle;
                }
            </style>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); font-family: 'Inter', sans-serif;">
            <div style="max-width: 650px; margin: 40px auto; padding: 0 20px;">
                
                <!-- Header Card -->
                <div style="background: linear-gradient(145deg, #1f1f1f 0%, #2d2d2d 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(212, 175, 55, 0.1); overflow: hidden; margin-bottom: 24px;">
                    <div style="height: 4px; background: linear-gradient(90deg, #8b4513 0%, #d4af37 50%, #b8860b 100%);"></div>
                    <div style="text-align: center; padding: 48px 32px;">
                        <img src="${logoUrl}" 
                             alt="HG Store Logo" 
                             style="max-width: 120px; height: auto; margin-bottom: 24px; border-radius: 12px; box-shadow: 0 4px 16px rgba(212, 175, 55, 0.2);" />
                        <h1 style="color: #d4af37; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Xác nhận đơn hàng</h1>
                        <div style="width: 60px; height: 2px; background: linear-gradient(90deg, #8b4513, #d4af37); margin: 16px auto;"></div>
                    </div>
                </div>
                
                <!-- Welcome Message -->
                <div style="background: linear-gradient(145deg, #1f1f1f 0%, #2d2d2d 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(212, 175, 55, 0.1); padding: 32px; margin-bottom: 24px;">
                    <h2 style="color: #d4af37; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                        <span style="color: #b8860b;">👋</span> Cảm ơn bạn đã đặt hàng!
                    </h2>
                    <p style="margin: 0 0 16px 0; font-size: 16px; color: #e8e8e8;">
                        Xin chào <strong style="color: #d4af37; font-weight: 600;">${
                          user.name
                        }</strong>,
                    </p>
                    <p style="margin: 0; font-size: 16px; color: #c0c0c0; line-height: 1.7;">
                        Chúng tôi đã nhận được đơn hàng của bạn và đang xử lý. Dưới đây là thông tin chi tiết về đơn hàng của bạn.
                    </p>
                </div>
        
                <!-- Order Info -->
                <div style="background: linear-gradient(145deg, #1f1f1f 0%, #2d2d2d 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(212, 175, 55, 0.1); padding: 32px; margin-bottom: 24px;">
                    <h3 style="color: #d4af37; margin: 0 0 24px 0; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
                        <span style="color: #b8860b; margin-right: 12px; font-size: 24px;">📋</span>
                        Thông tin đơn hàng
                    </h3>
                    <div style="background: #1a1a1a; border-radius: 12px; overflow: hidden; border: 1px solid #2a2a2a;">
                        <div style="display: grid; gap: 0;">
                            <div style="display: flex; padding: 20px; border-bottom: 1px solid #2a2a2a;">
                                <div style="flex: 1; color: #c0c0c0; font-weight: 500;">
                                    <span style="color: #b8860b;">🏷️</span> Mã đơn hàng:
                                </div>
                                <div style="flex: 1; color: #d4af37; font-weight: 600; font-size: 16px; text-align: right;">
                                    #${order.id}
                                </div>
                            </div>
                            <div style="display: flex; padding: 20px; border-bottom: 1px solid #2a2a2a;">
                                <div style="flex: 1; color: #c0c0c0; font-weight: 500;">
                                    <span style="color: #b8860b;">📅</span> Ngày đặt:
                                </div>
                                <div style="flex: 1; color: #e8e8e8; text-align: right;">
                                    ${new Date(order.createdAt).toLocaleString(
                                      "vi-VN",
                                    )}
                                </div>
                            </div>
                            <div style="display: flex; padding: 20px; border-bottom: 1px solid #2a2a2a;">
                                <div style="flex: 1; color: #c0c0c0; font-weight: 500;">
                                    <span style="color: #b8860b;">📦</span> Tổng số sản phẩm:
                                </div>
                                <div style="flex: 1; color: #d4af37; font-weight: 600; text-align: right;">
                                    ${totalitems} sản phẩm
                                </div>
                            </div>
                            <div style="display: flex; padding: 20px; background: linear-gradient(135deg, #2a1810 0%, #1a1a1a 100%);">
                                <div style="flex: 1; color: #d4af37; font-weight: 600; font-size: 18px;">
                                    <span style="color: #b8860b;">💰</span> Tổng tiền:
                                </div>
                                <div style="flex: 1; color: #d4af37; font-weight: 700; font-size: 20px; text-align: right;">
                                    ${this.formatCurrency(order.total)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        
                <!-- Customer Info -->
                <div style="background: linear-gradient(145deg, #1f1f1f 0%, #2d2d2d 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(212, 175, 55, 0.1); padding: 32px; margin-bottom: 24px;">
                    <h3 style="color: #d4af37; margin: 0 0 24px 0; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
                        <span style="color: #b8860b; margin-right: 12px; font-size: 24px;">👤</span>
                        Thông tin người nhận
                    </h3>
                    <div style="background: #1a1a1a; border-radius: 12px; overflow: hidden; border: 1px solid #2a2a2a;">
                        <div style="display: flex; padding: 20px; border-bottom: 1px solid #2a2a2a;">
                            <div style="flex: 1; color: #c0c0c0; font-weight: 500;">
                                <span style="color: #b8860b;">👨‍💼</span> Họ tên:
                            </div>
                            <div style="flex: 1; color: #d4af37; font-weight: 600; text-align: right;">
                                ${user.name}
                            </div>
                        </div>
                        <div style="display: flex; padding: 20px; border-bottom: 1px solid #2a2a2a;">
                            <div style="flex: 1; color: #c0c0c0; font-weight: 500;">
                                <span style="color: #b8860b;">📞</span> Số điện thoại:
                            </div>
                            <div style="flex: 1; color: #e8e8e8; text-align: right;">
                                ${order.phone}
                            </div>
                        </div>
                        <div style="display: flex; padding: 20px; ${
                          order.note ? "border-bottom: 1px solid #2a2a2a;" : ""
                        }">
                            <div style="flex: 1; color: #c0c0c0; font-weight: 500;">
                                <span style="color: #b8860b;">🏠</span> Địa chỉ:
                            </div>
                            <div style="flex: 1; color: #e8e8e8; text-align: right;">
                                ${order.address}
                            </div>
                        </div>
                        ${
                          order.note
                            ? `
                        <div style="display: flex; padding: 20px;">
                            <div style="flex: 1; color: #c0c0c0; font-weight: 500;">
                                <span style="color: #b8860b;">📝</span> Ghi chú:
                            </div>
                            <div style="flex: 1; color: #d4af37; font-style: italic; text-align: right;">
                                ${order.note}
                            </div>
                        </div>
                        `
                            : ""
                        }
                    </div>
                </div>
        
                <!-- Product Details -->
                <div style="background: linear-gradient(145deg, #1f1f1f 0%, #2d2d2d 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(212, 175, 55, 0.1); padding: 32px; margin-bottom: 24px;">
                    <h3 style="color: #d4af37; margin: 0 0 24px 0; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
                        <span style="color: #b8860b; margin-right: 12px; font-size: 24px;">🛒</span>
                        Chi tiết sản phẩm
                    </h3>
                    <div style="background: #1a1a1a; border-radius: 12px; overflow: hidden; border: 1px solid #2a2a2a;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: linear-gradient(135deg, #8b4513 0%, #d4af37 100%);">
                                    <th style="padding: 20px 16px; text-align: left; font-weight: 600; font-size: 14px; color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.5px;">Sản phẩm</th>
                                    <th style="padding: 20px 16px; text-align: center; font-weight: 600; font-size: 14px; color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.5px;">Số lượng</th>
                                    <th style="padding: 20px 16px; text-align: right; font-weight: 600; font-size: 14px; color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.5px;">Đơn giá</th>
                                    <th style="padding: 20px 16px; text-align: right; font-weight: 600; font-size: 14px; color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.5px;">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orderItemsHtml}
                            </tbody>
                            <tfoot>
                                <tr style="background: linear-gradient(135deg, #2a1810 0%, #1a1a1a 100%); border-top: 2px solid #d4af37;">
                                    <td colspan="3" style="padding: 24px 16px; text-align: right; font-size: 18px; font-weight: 600; color: #d4af37;">
                                        💰 Tổng cộng:
                                    </td>
                                    <td style="padding: 24px 16px; text-align: right; font-size: 22px; font-weight: 700; color: #d4af37;">
                                        ${this.formatCurrency(order.total)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
        
                <!-- Status Alert -->
                <div style="background: linear-gradient(135deg, #8b4513 0%, #d4af37 100%); border-radius: 16px; padding: 32px; margin-bottom: 24px; text-align: center; box-shadow: 0 8px 32px rgba(139, 69, 19, 0.3);">
                    <div style="color: #1a1a1a; font-size: 20px; font-weight: 700; margin-bottom: 12px;">
                        ⏰ Lưu ý quan trọng
                    </div>
                    <p style="margin: 0; font-size: 16px; color: #1a1a1a; font-weight: 500; line-height: 1.6;">
                        Đơn hàng của bạn đang được xử lý. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận và giao hàng.
                    </p>
                </div>
        
                <!-- Footer -->
                <div style="background: linear-gradient(145deg, #1f1f1f 0%, #2d2d2d 100%); border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(212, 175, 55, 0.1); text-align: center; padding: 40px 32px;">
                    <div style="height: 4px; background: linear-gradient(90deg, #8b4513 0%, #d4af37 50%, #b8860b 100%); margin: -40px -32px 32px -32px;"></div>
                    
                    <img src="${logoUrl}" 
                         alt="HG Store Logo" 
                         style="max-width: 80px; height: auto; margin-bottom: 24px; border-radius: 10px; box-shadow: 0 4px 16px rgba(212, 175, 55, 0.2);" />
                    
                    <p style="margin: 0 0 16px 0; font-size: 20px; color: #d4af37; font-weight: 600;">
                        ☕ Cảm ơn bạn đã tin tưởng HG Store! 🙏
                    </p>
                    <p style="color: #c0c0c0; font-size: 14px; margin: 0 0 24px 0;">
                        Email này được gửi tự động, vui lòng không trả lời.
                    </p>
                    
                    <div style="padding-top: 24px; border-top: 1px solid #2a2a2a;">
                        <p style="color: #d4af37; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">
                            © 2024 HG Store - Hương vị cà phê đậm đà ☕
                        </p>
                        <p style="color: #8b4513; font-size: 12px; margin: 0; opacity: 0.8;">
                            Powered by Node.js & Coffee Love ☕
                        </p>
                    </div>
                </div>
                
                <!-- Bottom Spacing -->
                <div style="height: 40px;"></div>
            </div>
        </body>
        </html>`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Xác nhận đơn hàng #${order.id} - Cảm ơn bạn đã đặt hàng!`,
      html: emailTemplate,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Order confirmation email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error("Error sending email", error);
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
