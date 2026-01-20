import api from "../index.js";
import { ENDPOINTS } from "../endpoints.js";
import BaseService from "./base.service.js";

class PaymentService extends BaseService {
  constructor() {
    super(ENDPOINTS.PAYMENTS.BASE);
  }

  async createPayment(paymentData) {
    try {
      const response = await api.post(ENDPOINTS.PAYMENTS.CREATE, paymentData);
      return response.data;
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  }

  async getPaymentStatus(orderId) {
    try {
      const response = await api.get(ENDPOINTS.PAYMENTS.STATUS(orderId));
      return response.data;
    } catch (error) {
      console.error("Error fetching payment status:", error);
      throw error;
    }
  }

  async checkSePayPayment(orderId) {
    try {
      const response = await api.post(ENDPOINTS.PAYMENTS.SEPAY.CHECK, {
        orderId,
      });
      return response.data;
    } catch (error) {
      console.error("Error checking SePay payment:", error);
      throw error;
    }
  }

  async reportPaid(orderId, transferInfo = "") {
    try {
      const response = await api.post(`${this.endpoint}/payments/report-paid`, {
        orderId,
        transferInfo,
      });
      return response.data;
    } catch (error) {
      console.error("Error reporting payment:", error);
      throw error;
    }
  }

  async confirmPaymentManual(orderId, transactionId = "", adminNote = "") {
    try {
      const response = await api.post(
        `${this.endpoint}/payments/confirm-manual`,
        { orderId, transactionId, adminNote }
      );
      return response.data;
    } catch (error) {
      console.error("Error confirming payment:", error);
      throw error;
    }
  }
}

export default new PaymentService();
