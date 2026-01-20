import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

class SePayService {
  constructor() {
    this.apiKey = process.env.SEPAY_API_KEY;
    this.accountNumber = process.env.SEPAY_ACCOUNT_NUMBER;
    this.accountName = process.env.SEPAY_ACCOUNT_NAME;
    this.bankCode = process.env.SEPAY_BANK_CODE;
    this.apiUrl = "https://my.sepay.vn/userapi";

    console.log(" SEPAY Config:", {
      ApiKey: this.apiKey ? "***" + this.apiKey.slice(-4) : "MISSING",
      AccountNumber: this.accountNumber,
      BankCode: this.bankCode,
      ApiUrl: this.apiUrl,
    });

    if (!this.apiKey || !this.accountNumber || !this.bankCode) {
      console.error(" SEPAY Config missing! Check .env file");
    }
  }

  generateTransferContent(orderId) {
    return `HG${orderId}`;
  }

  async createPaymentQRCode(orderData) {
    try {
      const { orderId, amount, description } = orderData;
      if (!orderId || !amount) {
        throw new Error("orderId và amount là bắt buộc");
      }

      const transferContent = this.generateTransferContent(orderId);

      //tao qr code URL theo chuan vietQR

      const qrData = {
        accountNo: this.accountNumber,
        accountName: this.accountName,
        acqId: this.getBankAcqId(this.bankCode),
        amount: Math.round(amount),
        addInfo: transferContent,
        format: "text",
        template: "compact",
      };

      const qrCodeUrl = `https://img.vietqr.io/image/${qrData.acqId}-${
        qrData.accountNo
      }-${qrData.template}.png?amount=${
        qrData.amount
      }&addInfo=${encodeURIComponent(
        qrData.addInfo
      )}&accountName=${encodeURIComponent(qrData.accountName)}`;

      return {
        success: true,
        qrCode: qrCodeUrl,
        transferContent: transferContent,
        accountInfo: {
          accountNumber: this.accountNumber,
          accountName: this.accountName,
          bankCode: this.bankCode,
          bankName: this.getBankName(this.bankCode),
        },
        amount: amount,
        orderId: orderId,
      };
    } catch (error) {
      console.error("SePay createQRPayment error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
  async checkTransaction(orderId, expectedAmount) {
    try {
      console.log("🔍 Checking SePay transaction for order:", orderId);

      // Nếu không có API Key, trả về pending (chờ webhook)
      if (!this.apiKey || this.apiKey === "YOUR_NEW_API_TOKEN_HERE") {
        console.log("⚠️ No API Token configured. Waiting for webhook...");
        return {
          success: true,
          found: false,
          message: "Đang chờ xác nhận thanh toán từ ngân hàng...",
          waitingWebhook: true,
        };
      }

      const transferContent = this.generateTransferContent(orderId);

      try {
        const response = await axios.get(`${this.apiUrl}/transactions/list`, {
          headers: {
            Authorization: `Apikey ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          params: {
            account_number: this.accountNumber,
            limit: 100,
          },
          timeout: 15000,
        });

        const transactions = response.data?.transactions || [];

        if (transactions.length === 0) {
          return {
            success: true,
            found: false,
            message: "Chưa có giao dịch nào",
          };
        }

        // Tìm giao dịch matching
        const matchingTransaction = transactions.find((tx) => {
          const content = (tx.transaction_content || "").toUpperCase();
          const amountIn = parseFloat(tx.amount_in || 0);

          const patterns = [`HG ${orderId}`, `HG${orderId}`];
          const contentMatch = patterns.some((p) =>
            content.includes(p.toUpperCase())
          );
          const amountMatch = Math.abs(amountIn - expectedAmount) <= 1;

          return contentMatch && amountMatch;
        });

        if (matchingTransaction) {
          return {
            success: true,
            found: true,
            transaction: {
              id: matchingTransaction.id,
              amount: parseFloat(matchingTransaction.amount_in),
              content: matchingTransaction.transaction_content,
              date: matchingTransaction.transaction_date,
              reference: matchingTransaction.id?.toString(),
            },
          };
        }

        return {
          success: true,
          found: false,
          message: "Chưa tìm thấy giao dịch phù hợp",
        };
      } catch (apiError) {
        console.error("❌ SePay API error:", apiError.response?.status);

        // API lỗi - Chờ webhook
        return {
          success: true,
          found: false,
          message: "Đang chờ xác nhận thanh toán...",
          waitingWebhook: true,
        };
      }
    } catch (error) {
      console.error("❌ SePay checkTransaction error:", error);
      return {
        success: true,
        found: false,
        message: "Đang chờ xác nhận thanh toán...",
        waitingWebhook: true,
      };
    }
  }

  /**
   * Kiểm tra giao dịch từ SePay webhook
   * @param {Object} transaction - Dữ liệu giao dịch từ webhook
   * @returns {Object} - { isValid, orderId, amount, status }
   */

  async verifyTransaction(transaction) {
    try {
      const {
        transaction_content,
        amount_in,
        transaction_date,
        gateway,
        account_number,
      } = transaction;

      console.log(" Verifying SePay transaction:", {
        content: transaction_content,
        amount: amount_in,
        date: transaction_date,
        gateway,
        accountNumber: account_number,
      });

      if (account_number !== this.accountNumber) {
        console.warn(" Wrong account number");
        return {
          isValid: false,
          message: "Sai tài khoản nhận tiền",
        };
      }

      const orderIdMatch = transaction_content.match(/HG[#\s]*(\d+)/i);

      if (!orderIdMatch) {
        console.warn(
          " Cannot parse orderId from content:",
          transaction_content
        );
        return {
          isValid: false,
          message: "Không tìm thấy mã đơn hàng trong nội dung chuyển khoản",
        };
      }

      const orderId = orderIdMatch[1];

      console.log("Transaction verified:", {
        orderId,
        amount: amount_in,
        status: "success",
      });

      return {
        isValid: true,
        orderId: parseInt(orderId),
        amount: parseFloat(amount_in),
        transactionDate: transaction_date,
        status: "success",
      };
    } catch (error) {
      console.error("SePay verifyTransaction error:", error);
      return {
        isValid: false,
        message: error.message,
      };
    }
  }

  parseWebhookData(webhookBody) {
    try {
      const {
        id,
        gateway,
        transactionDate,
        accountNumber,
        subAccount,
        transferType,
        transferAmount,
        accumulated,
        code,
        content,
        referenceCode,
        description,
      } = webhookBody;

      const orderIdMatch = content.match(/HG[#\s]*(\d+)/i);
      const orderId = orderIdMatch ? orderIdMatch[1] : null;

      return {
        isValid: true,
        orderId: orderId,
        amount: parseFloat(transferAmount || 0),
        transactionId: id?.toString() || referenceCode,
        content: content,
        transactionDate: transactionDate,
        accountNumber: accountNumber,
      };
    } catch (error) {
      console.error("❌ Parse webhook error:", error);
      return {
        isValid: false,
        error: error.message,
      };
    }
  }

  verifyWebhook(webhookData) {
    const accountNumber =
      webhookData.accountNumber || webhookData.account_number;
    return accountNumber === this.accountNumber;
  }

  /**
   * Lấy lịch sử giao dịch từ SePay API
   * @param {number} limit - Số giao dịch cần lấy (default: 20)
   * @returns {Promise<Object>} - Danh sách giao dịch
   */

  async getTransactionHistory(limit = 20) {
    try {
      const response = await axios.get(`${this.apiUrl}/transactions/list`, {
        headers: {
          Authorization: `ApiKey ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        params: {
          limit: limit,
          account_number: this.accountNumber,
        },
        timeout: 15000,
      });

      return {
        success: true,
        transactions: response.data.transactions || [],
      };
    } catch (error) {
      console.error(
        "SePay getTransactionHistory error:",
        error.response?.data || error.message
      );
      return {
        success: false,
        error: error.message,
        transactions: [],
      };
    }
  }

  /**
   * Verify webhook signature (nếu SePay có signature)
   * @param {Object} webhookData - Dữ liệu webhook
   * @param {string} signature - Chữ ký từ header
   * @returns {boolean}
   */

  verifyWebhookSignature(webhookData, signature) {
    try {
      return true;
    } catch (error) {
      console.error(" Verify signature error:", error);
      return false;
    }
  }

  getBankAcqId(bankCode) {
    const bankMap = {
      VCB: "970436",
      TCB: "970407",
      MB: "970422",
      VTB: "970415",
      ACB: "970416",
      BIDV: "970418",
      VPB: "970432",
      TPB: "970423",
      STB: "970403",
      HDB: "970437",
      SHB: "970443",
      EIB: "970431",
      MSB: "970426",
      CAKE: "546034",
      UBANK: "546035",
      TIMO: "963388",
      VNPTMONEY: "970451",
      VIMO: "970441",
    };
    return bankMap[bankCode] || bankCode;
  }

  getBankName(bankCode) {
    const bankNames = {
      VCB: "Vietcombank",
      TCB: "Techcombank",
      MB: "MBBank",
      VTB: "Vietinbank",
      ACB: "ACB",
      BIDV: "BIDV",
      VPB: "VPBank",
      TPB: "TPBank",
      STB: "Sacombank",
      HDB: "HDBank",
      SHB: "SHB",
      EIB: "Eximbank",
      MSB: "MSB",
    };

    return bankNames[bankCode] || bankCode;
  }
}

export default new SePayService();
