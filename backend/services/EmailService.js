import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendOrderConfirmation(userEmail, orderData) {
        const { order, user, orderDetails } = orderData;
        //Calculate total items
        const totalitems = orderDetails.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        // Firebase logo URL
        const logoUrl =
            'https://firebasestorage.googleapis.com/v0/b/hg-store-a11c5.firebasestorage.app/o/images%2F1751092040674-logo.png?alt=media&token=4b72bf76-9c9c-4257-9290-808098ceac2f';

        const orderItemsHtml = orderDetails
            .map((item) => {
                const productName = item.product_details?.name || 'Sản phẩm';
                const quantity = item.quantity || 0;
                const price = item.price || 0;

                return `
                <tr>
                    <td style="padding: 15px; border-bottom: 1px solid #e8ddd4; background-color: #faf8f5;">
                        ${productName}
                    </td>
                    <td style="padding: 15px; border-bottom: 1px solid #e8ddd4; text-align: center; background-color: #faf8f5;">
                        ${quantity}
                    </td>
                    <td style="padding: 15px; border-bottom: 1px solid #e8ddd4; text-align: right; background-color: #faf8f5;">
                        ${this.formatCurrency(price)}
                    </td>
                    <td style="padding: 15px; border-bottom: 1px solid #e8ddd4; text-align: right; background-color: #faf8f5;">
                        ${this.formatCurrency(quantity * price)}
                    </td>
                </tr>`;
            })
            .join('');

        const emailTemplate = `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Xác nhận đơn hàng #${order.id}</title>
        </head>
        <body style="font-family: 'Georgia', serif; line-height: 1.6; color: #4a3c28; margin: 0; padding: 0; background-color: #f5f2ed;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; box-shadow: 0 0 20px rgba(139, 105, 75, 0.2);">
                
                <!-- Logo Header -->
                <div style="text-align: center; padding: 30px 0; background: linear-gradient(135deg, #8b694b 0%, #d4a574 50%, #f5e6d3 100%); margin: -20px -20px 30px -20px; border-radius: 0 0 20px 20px;">
                    <img src="${logoUrl}" 
                         alt="HG Store Logo" 
                         style="max-width: 180px; height: auto; display: block; margin: 0 auto 15px auto; border-radius: 12px; box-shadow: 0 6px 12px rgba(74, 60, 40, 0.3);" />
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; text-shadow: 0 2px 4px rgba(74, 60, 40, 0.5); font-family: 'Georgia', serif;">✨ Xác nhận đơn hàng ✨</h1>
                </div>
                
                <div style="background: linear-gradient(135deg, #f5e6d3 0%, #e8ddd4 100%); padding: 25px; border-radius: 15px; margin: 20px 0; border-left: 5px solid #8b694b; box-shadow: 0 4px 8px rgba(139, 105, 75, 0.15);">
                    <h2 style="color: #8b694b; margin-top: 0; font-size: 24px; font-family: 'Georgia', serif;">☕ Cảm ơn bạn đã đặt hàng!</h2>
                    <p style="margin: 15px 0; font-size: 16px; color: #4a3c28;">Xin chào <strong style="color: #8b694b; font-size: 18px;">${
                        user.name
                    }</strong>,</p>
                    <p style="margin: 15px 0; font-size: 16px; color: #4a3c28;">Chúng tôi đã nhận được đơn hàng của bạn và đang xử lý. Dưới đây là thông tin chi tiết:</p>
                </div>
        
                <div style="margin: 30px 0;">
                    <h3 style="color: #4a3c28; border-bottom: 3px solid #d4a574; padding-bottom: 10px; margin-bottom: 20px; font-size: 20px; font-family: 'Georgia', serif;">📋 Thông tin đơn hàng</h3>
                    <table style="width: 100%; border-collapse: collapse; background-color: #faf8f5; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(139, 105, 75, 0.1);">
                        <tr>
                            <td style="padding: 18px; border-bottom: 1px solid #e8ddd4; background: linear-gradient(135deg, #f5e6d3 0%, #e8ddd4 100%); font-weight: bold; color: #4a3c28;">☕ Mã đơn hàng:</td>
                            <td style="padding: 18px; border-bottom: 1px solid #e8ddd4; font-weight: bold; color: #8b694b; font-size: 16px;">#${
                                order.id
                            }</td>
                        </tr>
                        <tr>
                            <td style="padding: 18px; border-bottom: 1px solid #e8ddd4; background: linear-gradient(135deg, #f5e6d3 0%, #e8ddd4 100%); font-weight: bold; color: #4a3c28;">🗓️ Ngày đặt:</td>
                            <td style="padding: 18px; border-bottom: 1px solid #e8ddd4; font-size: 16px; color: #4a3c28;">${new Date(
                                order.createdAt
                            ).toLocaleString('vi-VN')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 18px; border-bottom: 1px solid #e8ddd4; background: linear-gradient(135deg, #f5e6d3 0%, #e8ddd4 100%); font-weight: bold; color: #4a3c28;">📦 Tổng số sản phẩm:</td>
                            <td style="padding: 18px; border-bottom: 1px solid #e8ddd4; font-weight: bold; color: #8b694b; font-size: 16px;">${totalitems} sản phẩm</td>
                        </tr>
                        <tr>
                            <td style="padding: 18px; background: linear-gradient(135deg, #f5e6d3 0%, #e8ddd4 100%); font-weight: bold; color: #4a3c28;">💰 Tổng tiền:</td>
                            <td style="padding: 18px; color: #a0522d; font-weight: bold; font-size: 20px;">${this.formatCurrency(
                                order.total
                            )}</td>
                        </tr>
                    </table>
                </div>
        
                <div style="margin: 30px 0;">
                    <h3 style="color: #4a3c28; border-bottom: 3px solid #cd853f; padding-bottom: 10px; margin-bottom: 20px; font-size: 20px; font-family: 'Georgia', serif;">👤 Thông tin người nhận</h3>
                    <table style="width: 100%; border-collapse: collapse; background-color: #faf8f5; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(139, 105, 75, 0.1);">
                        <tr>
                            <td style="padding: 18px; border-bottom: 1px solid #e8ddd4; background: linear-gradient(135deg, #f5e6d3 0%, #e8ddd4 100%); font-weight: bold; color: #4a3c28;">👨‍💼 Họ tên:</td>
                            <td style="padding: 18px; border-bottom: 1px solid #e8ddd4; font-weight: bold; color: #8b694b; font-size: 16px;">${
                                user.name
                            }</td>
                        </tr>
                        <tr>
                            <td style="padding: 18px; border-bottom: 1px solid #e8ddd4; background: linear-gradient(135deg, #f5e6d3 0%, #e8ddd4 100%); font-weight: bold; color: #4a3c28;">📞 Số điện thoại:</td>
                            <td style="padding: 18px; border-bottom: 1px solid #e8ddd4; font-size: 16px; color: #4a3c28;">${
                                order.phone
                            }</td>
                        </tr>
                        <tr>
                            <td style="padding: 18px; ${
                                order.note
                                    ? 'border-bottom: 1px solid #e8ddd4;'
                                    : ''
                            } background: linear-gradient(135deg, #f5e6d3 0%, #e8ddd4 100%); font-weight: bold; color: #4a3c28;">🏠 Địa chỉ:</td>
                            <td style="padding: 18px; ${
                                order.note
                                    ? 'border-bottom: 1px solid #e8ddd4;'
                                    : ''
                            } font-size: 16px; color: #4a3c28;">${
            order.address
        }</td>
                        </tr>
                        ${
                            order.note
                                ? `
                        <tr>
                            <td style="padding: 18px; background: linear-gradient(135deg, #f5e6d3 0%, #e8ddd4 100%); font-weight: bold; color: #4a3c28;">📝 Ghi chú:</td>
                            <td style="padding: 18px; font-style: italic; color: #8b694b; font-size: 16px;">${order.note}</td>
                        </tr>
                        `
                                : ''
                        }
                    </table>
                </div>
        
                <div style="margin: 30px 0;">
                    <h3 style="color: #4a3c28; border-bottom: 3px solid #deb887; padding-bottom: 10px; margin-bottom: 20px; font-size: 20px; font-family: 'Georgia', serif;">🛒 Chi tiết sản phẩm</h3>
                    <table style="width: 100%; border-collapse: collapse; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(139, 105, 75, 0.1);">
                        <thead>
                            <tr style="background: linear-gradient(135deg, #8b694b 0%, #cd853f 50%, #deb887 100%); color: white;">
                                <th style="padding: 15px; text-align: left; font-weight: bold; font-size: 14px; text-shadow: 0 1px 2px rgba(74, 60, 40, 0.5);">Sản phẩm</th>
                                <th style="padding: 15px; text-align: center; font-weight: bold; font-size: 14px; text-shadow: 0 1px 2px rgba(74, 60, 40, 0.5);">Số lượng</th>
                                <th style="padding: 15px; text-align: right; font-weight: bold; font-size: 14px; text-shadow: 0 1px 2px rgba(74, 60, 40, 0.5);">Đơn giá</th>
                                <th style="padding: 15px; text-align: right; font-weight: bold; font-size: 14px; text-shadow: 0 1px 2px rgba(74, 60, 40, 0.5);">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderItemsHtml}
                        </tbody>
                        <tfoot>
                            <tr style="background: linear-gradient(135deg, #d2691e 0%, #8b694b 100%); color: white; font-weight: bold;">
                                <td colspan="3" style="padding: 18px; text-align: right; font-size: 18px; text-shadow: 0 1px 2px rgba(74, 60, 40, 0.5);">💰 Tổng cộng:</td>
                                <td style="padding: 18px; text-align: right; font-size: 20px; text-shadow: 0 1px 2px rgba(74, 60, 40, 0.5);">${this.formatCurrency(
                                    order.total
                                )}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
        
                <div style="background: linear-gradient(135deg, #8b694b 0%, #d4a574 100%); color: white; padding: 25px; border-radius: 15px; margin: 30px 0; text-align: center; box-shadow: 0 6px 12px rgba(139, 105, 75, 0.3);">
                    <p style="margin: 0; font-size: 18px; font-weight: bold; text-shadow: 0 1px 2px rgba(74, 60, 40, 0.5);">⏰ <strong>Lưu ý quan trọng:</strong></p>
                    <p style="margin: 10px 0 0 0; font-size: 16px; text-shadow: 0 1px 2px rgba(74, 60, 40, 0.3);">Đơn hàng của bạn đang được xử lý. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận và giao hàng.</p>
                </div>
        
                <!-- Footer with Logo -->
                <div style="text-align: center; margin-top: 40px; padding: 30px 20px; background: linear-gradient(135deg, #f5e6d3 0%, #e8ddd4 100%); border-radius: 15px; border-top: 4px solid #8b694b;">
                    <img src="${logoUrl}" 
                         alt="HG Store Logo" 
                         style="max-width: 120px; height: auto; margin-bottom: 20px; opacity: 0.9; border-radius: 10px; box-shadow: 0 4px 8px rgba(139, 105, 75, 0.2);" />
                    <p style="margin: 15px 0 10px 0; font-size: 20px; color: #4a3c28; font-weight: bold; font-family: 'Georgia', serif;">☕ Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi! 🙏</p>
                    <p style="color: #8b694b; font-size: 14px; margin: 10px 0;">Email này được gửi tự động, vui lòng không trả lời.</p>
                    <div style="margin-top: 25px; padding-top: 20px; border-top: 2px solid #d4a574;">
                        <p style="color: #8b694b; font-size: 13px; margin: 0; font-weight: bold;">© 2024 HG Store - Hương vị cà phê đậm đà ☕</p>
                        <p style="color: #cd853f; font-size: 12px; margin: 5px 0 0 0;">Powered by Node.js & Coffee Love ☕</p>
                    </div>
                </div>
            </div>
        </body>
        </html>`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Xác nhận đơn hàng #${order.id} - Cảm ơn bạn đã đặt hàng!`,
            html: emailTemplate
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Order confirmation email sent to ${userEmail}`);
            return true;
        } catch (error) {
            console.error('Error sending email', error);
            return false;
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }
}
export default new EmailService();
