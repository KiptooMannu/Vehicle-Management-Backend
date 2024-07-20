import { Hono } from 'hono';
import { getAllPaymentsController, getPaymentByIdController,createCheckoutSessionController, createPaymentController, updatePaymentController, deletePaymentController } from './payment.controller';

export const paymentRouter = new Hono();

paymentRouter
    .get("payments", getAllPaymentsController)
    .get("payments/:id", getPaymentByIdController)
    .post("payments", createPaymentController)
    .put("payments/:id", updatePaymentController)
    .delete("payments/:id", deletePaymentController)
    .post('/checkout-session', createCheckoutSessionController)

export default paymentRouter;
