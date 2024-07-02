import { db } from "../drizzle/db";
import { TIPayment, TSPayment, PaymentsTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Get all payments
export const getAllPaymentsService = async (): Promise<TSPayment[] | null> => {
    const payments = await db.query.PaymentsTable.findMany();
    return payments;
};

// Get payment by ID
export const getPaymentByIdService = async (payment_id: number): Promise<TSPayment | undefined> => {
    const payment = await db.query.PaymentsTable.findFirst({
        where: eq(PaymentsTable.payment_id, payment_id),
    });
    return payment;
};

// Create payment
export const createPaymentService = async (payment: TIPayment): Promise<string> => {
    await db.insert(PaymentsTable).values(payment);
    return "Payment created successfully";
};

// Update payment
export const updatePaymentService = async (payment_id: number, payment: TIPayment): Promise<string> => {
    await db.update(PaymentsTable).set(payment).where(eq(PaymentsTable.payment_id, payment_id));
    return "Payment updated successfully";
};

// Delete payment
export const deletePaymentService = async (payment_id: number): Promise<string> => {
    await db.delete(PaymentsTable).where(eq(PaymentsTable.payment_id, payment_id));
    return "Payment deleted successfully";
};
