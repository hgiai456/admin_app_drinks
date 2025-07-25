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

        //Create order items HTML
        const orderItemsHtml = orderDetails
            .map(
                (item) => `
            
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                    ${item.product_details.name}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">
                    ${item.quantity}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">
                    ${this.formatCurrency(item.price)}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">
                    ${this.formatCurrency(item.quantity * item.price)}
                </td>
            </tr>`
            )
            .join('');

        const emailTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Xác nhận đơn hàng #${order.id}</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #2c3e50; text-align: center;">Xác nhận đơn hàng</h1>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h2 style="color: #27ae60; margin-top: 0;">Cảm ơn bạn đã đặt hàng!</h2>
                        <p>Xin chào <strong>${user.name}</strong>,</p>
                        <p>Chúng tôi đã nhận được đơn hàng của bạn và đang xử lý. Dưới đây là thông tin chi tiết:</p>
                    </div>

                    <div style="margin: 20px 0;">
                        <h3 style="color: #2c3e50;">Thông tin đơn hàng</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Mã đơn hàng:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;">#${
                                    order.id
                                }</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Ngày đặt:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${new Date(
                                    order.createdAt
                                ).toLocaleString('vi-VN')}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Tổng tiền:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #e74c3c; font-weight: bold;">${this.formatCurrency(
                                    order.total
                                )}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="margin: 20px 0;">
                        <h3 style="color: #2c3e50;">Thông tin người nhận</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Họ tên:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${
                                    user.name
                                }</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Số điện thoại:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${
                                    order.phone
                                }</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Địa chỉ:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${
                                    order.address
                                }</td>
                            </tr>
                            ${
                                order.note
                                    ? `
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Ghi chú:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${order.note}</td>
                            </tr>
                            `
                                    : ''
                            }
                        </table>
                    </div>

                    <div style="margin: 20px 0;">
                        <h3 style="color: #2c3e50;">Chi tiết sản phẩm</h3>
                        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                            <thead>
                                <tr style="background-color: #f8f9fa;">
                                    <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Sản phẩm</th>
                                    <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Số lượng</th>
                                    <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Đơn giá</th>
                                    <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orderItemsHtml}
                            </tbody>
                            <tfoot>
                                <tr style="background-color: #f8f9fa; font-weight: bold;">
                                    <td colspan="3" style="padding: 10px; text-align: right; border-top: 2px solid #ddd;">Tổng cộng:</td>
                                    <td style="padding: 10px; text-align: right; border-top: 2px solid #ddd; color: #e74c3c;">${this.formatCurrency(
                                        order.total
                                    )}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Lưu ý:</strong> Đơn hàng của bạn đang được xử lý. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
                    </div>

                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                        <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!</p>
                        <p style="color: #7f8c8d; font-size: 14px;">Email này được gửi tự động, vui lòng không trả lời.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

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
