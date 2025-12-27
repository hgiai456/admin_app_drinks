import { PayOS } from '@payos/node';
import dotenv from 'dotenv';

dotenv.config();

class PayOSService {
    constructor() {
        this.payOS = new PayOS(
            process.env.PAYOS_CLIENT_ID,
            process.env.PAYOS_API_KEY,
            process.env.PAYOS_CHECKSUM_KEY
        );
    }

    /**
     * Tạo payment link
     * @param {Object} orderData - Thông tin đơn hàng
     * @returns {Promise<Object>} Payment link và thông tin
     */

    async createPaymentLink(orderData) {
        try {
            const {
                orderId,
                amount,
                description,
                returnUrl,
                cancelUrl,
                buyerName,
                buyerEmail,
                buyerPhone,
                buyerAddress,
                items
            } = orderData;

            const paymentData = {
                orderCode: parseInt(orderId),
                amount: parseInt(amount),
                description: description || `Thanh toán đơn hàng #${orderId}`,
                buyerName: buyerName || `Khách hàng`,
                buyerEmail: buyerEmail || '',
                buyerAddress: orderData.buyerAddress || '',
                items: items || [
                    {
                        name: description || `Đơn hàng #${orderId}`,
                        quantity: 1,
                        price: Math.round
                    }
                ],
                returnUrl: process.env.PAYOS_RETURN_URL,
                cancelUrl: process.env.PAYOS_CANCEL_URL,
                expiredAt: Math.floor(Date.now() / 1000) + 15 * 60 // 15 phút
            };

            console.log('🔄 Creating PayOS payment link:', paymentData);

            const paymentLinkResponse = await this.payOS.createPaymentLink(
                paymentData
            );

            return {
                success: true,
                paymentUrl: paymentLinkResponse.checkoutUrl,
                orderCode: paymentLinkResponse.orderCode,
                paymentLinkId: paymentLinkResponse.paymentLinkId,
                qrCode: paymentLinkResponse.qrCode
            };
        } catch (error) {
            console.error('❌ PayOS createPaymentLink error:', error);
            throw new Error(`PayOS Error: ${error.message}`);
        }
    }

    /**
     * Xác thực webhook từ PayOS
     * @param {Object} webhookData - Dữ liệu webhook
     * @returns {Promise<Object>} Kết quả xác thực
     */

    async getpaymentLinkInformation(orderCode) {
        try {
            const paymentInfo = await this.payOS.getpaymentLinkInformation(
                orderCode
            );
            return {
                success: true,
                data: paymentInfo
            };
        } catch (error) {
            console.error('❌ PayOS getPaymentLinkInformation error:', error);
            throw new Error(`PayOS Error: ${error.message}`);
        }
    }

    /**
     * Hủy payment link
     * @param {string} orderCode - Mã đơn hàng
     * @returns {Promise<Object>} Kết quả hủy
     */

    async cancelPaymentLink(orderCode, reason = 'Hủy bởi người dùng') {
        try {
            const cancelResponse = await this.payOS.cancelPaymentLink(
                orderCode,
                reason
            );

            return {
                success: true,
                data: cancelResponse
            };
        } catch (error) {
            console.error('❌ PayOS cancelPaymentLink error:', error);
            throw new Error(`PayOS Error: ${error.message}`);
        }
    }
}

export default new PayOSService();
