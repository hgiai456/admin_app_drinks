import crypto from 'crypto';
import moment from 'moment';
import dotenv from 'dotenv';
import querystring from 'qs';

dotenv.config();

class VNPayService {
    constructor() {
        this.vnp_TmnCode = process.env.VNPAY_TMN_CODE;
        this.vnp_HashSecret = process.env.VNPAY_HASH_SECRET;
        this.vnp_Url = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        this.vnp_ReturnUrl = process.env.VNPAY_RETURN_URL || 'http://localhost:3003/api/payments/vnpay/return';
    
        console.log('🔧 VNPAY Config:', {
            TmnCode: this.vnp_TmnCode,
            HashSecret: this.vnp_HashSecret ? '***' + this.vnp_HashSecret.slice(-4) : 'MISSING',
            Url: this.vnp_Url,
            ReturnUrl: this.vnp_ReturnUrl
        });

        if (!this.vnp_TmnCode || !this.vnp_HashSecret) {
            console.error('❌ VNPAY Config missing! Check .env file');
        }
    }

    sortObject(obj) {
        const sorted = {};
        let str = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }

    createSignature(data, secretKey) {
        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(data, 'utf-8')).digest('hex');
        return signed;
    }

    removeVietnameseTones(str) {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/[^a-zA-Z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    createPaymentUrl(orderData, ipAddr) {
        try {
            const {
                orderId,
                amount,
                orderDescription,
                orderType = 'billpayment',
                locale = 'vn',
                bankCode = ''
            } = orderData;

            if (!orderId || !amount) {
                throw new Error('orderId và amount là bắt buộc');
            }

            if (!this.vnp_TmnCode || !this.vnp_HashSecret) {
                throw new Error('VNPAY config chưa được cấu hình');
            }

            const createDate = moment().format('YYYYMMDDHHmmss');
            const expireDate = moment().add(15, 'minutes').format('YYYYMMDDHHmmss');
            
            const orderInfo = this.removeVietnameseTones(
                orderDescription || `Thanh toan don hang ${orderId}`
            );

            // Xử lý IP
            let clientIp = ipAddr || '127.0.0.1';
            clientIp = clientIp.replace('::ffff:', '').replace('::1', '127.0.0.1');

            // Tạo params
            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = this.vnp_TmnCode;
            vnp_Params['vnp_Locale'] = locale;
            vnp_Params['vnp_CurrCode'] = 'VND';
            vnp_Params['vnp_TxnRef'] = orderId.toString();
            vnp_Params['vnp_OrderInfo'] = orderInfo;
            vnp_Params['vnp_OrderType'] = orderType;
            vnp_Params['vnp_Amount'] = Math.round(amount * 100);
            vnp_Params['vnp_ReturnUrl'] = this.vnp_ReturnUrl;
            vnp_Params['vnp_IpAddr'] = clientIp;
            vnp_Params['vnp_CreateDate'] = createDate;
            vnp_Params['vnp_ExpireDate'] = expireDate;

            if (bankCode && bankCode !== '') {
                vnp_Params['vnp_BankCode'] = bankCode;
            }

            //  Sắp xếp params theo alphabet
            vnp_Params = this.sortObject(vnp_Params);

            // QUAN TRỌNG: Tạo signData KHÔNG ENCODE
            const signData = querystring.stringify(vnp_Params, { encode: false });

            //  Tạo chữ ký từ signData KHÔNG ENCODE
            const hmac =  crypto.createHmac('sha512', this.vnp_HashSecret);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

            vnp_Params['vnp_SecureHash'] = signed;

           const paymentUrl = this.vnp_Url + '?' + querystring.stringify(vnp_Params, { encode: false });
            console.log(' VNPAY Payment URL created:', {
                orderId,
                amount: Math.round(amount * 100),
                TmnCode: this.vnp_TmnCode,
                signData: signData.substring(0, 100) + '...',
                paymentUrl: paymentUrl.substring(0, 200) + '...'
            });

            return {
                success: true,
                paymentUrl,
                orderCode: orderId
            };

        } catch (error) {
            console.error('❌ VNPAY createPaymentUrl error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    verifyIpnCall(vnpayData) {
        try {
            const secureHash = vnpayData['vnp_SecureHash'];
            
            // Clone và xóa hash fields
            let vnp_Params = { ...vnpayData };
            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];

            // ✅ Sort params theo cách giống lúc tạo
            vnp_Params = this.sortObject(vnp_Params);

            // ✅ Tạo signData
            const signData = querystring.stringify(vnp_Params, { encode: false });
            
            // ✅ Tạo chữ ký để verify
            const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

            const isValid = secureHash === signed;

            console.log('🔍 VNPAY IPN verification:', {
                isValid,
                orderId: vnpayData.vnp_TxnRef,
                responseCode: vnpayData.vnp_ResponseCode
            });

            return {
                isValid,
                orderId: vnpayData.vnp_TxnRef,
                amount: parseInt(vnpayData.vnp_Amount) / 100,
                responseCode: vnpayData.vnp_ResponseCode,
                transactionNo: vnpayData.vnp_TransactionNo
            };

        } catch (error) {
            console.error(' VNPAY verify error:', error);
            
            return {
                isValid: false,
                error: error.message
            };
        }
    }

    async refundTransaction(refundData) {
        try {
            const {
                orderId,
                amount,
                transactionNo,
                transactionDate,
                createBy
            } = refundData;

            const createDate = moment().format('YYYYMMDDHHmmss');
            const requestId = moment().format('HHmmss');

            let vnp_Params = {
                vnp_Version: '2.1.0',
                vnp_Command: 'refund',
                vnp_TmnCode: this.vnp_TmnCode,
                vnp_TransactionType: '02',
                vnp_TxnRef: orderId.toString(),
                vnp_Amount: Math.round(amount) * 100,
                vnp_OrderInfo: `Hoan tien don hang ${orderId}`,
                vnp_TransactionNo: transactionNo,
                vnp_TransactionDate: transactionDate,
                vnp_CreateBy: createBy,
                vnp_CreateDate: createDate,
                vnp_IpAddr: '127.0.0.1',
                vnp_RequestId: requestId
            };

            vnp_Params = this.sortObject(vnp_Params);
            const signData = querystring.stringify(vnp_Params, { encode: false });
            const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

            console.log('🔄 VNPAY Refund request:', vnp_Params);

            return {
                success: true,
                orderCode: orderId
            };

        } catch (error) {
            console.error('❌ VNPAY refund error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new VNPayService();