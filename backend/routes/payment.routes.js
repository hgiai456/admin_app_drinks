import express from 'express';
import * as PaymentController from '../controllers/PaymentController.js';
import asyncHandle from '../middlewares/asyncHandle.js';

const route = express.Router();

// POST /api/payments/create
route.post('/create', asyncHandle(PaymentController.createPayment));

// POST /api/payments/payos/webhook
route.post('/payos/webhook', PaymentController.paymentWebhook);

// GET /api/payments/vnpay/ipn
route.get('/vnpay/ipn', PaymentController.vnpayIPN);

// GET /api/payments/vnpay/return
route.get('/vnpay/return', PaymentController.vnpayReturn);

// GET /api/payments/verify
route.get('/verify', asyncHandle(PaymentController.verifyPayment));

// GET /api/payments/status/:orderId
route.get('/status/:orderId', asyncHandle(PaymentController.getPaymentStatus));

export default route;