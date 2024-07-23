import { Context } from "hono";
import { getAllPaymentsService, getPaymentByIdService, createPaymentService, updatePaymentService, deletePaymentService } from "./payment.service";
import Stripe from "stripe";
import { ClientURL } from "./utils";
import "dotenv/config";
import { stripe } from "../drizzle/db";

// Get all payments
export const getAllPaymentsController = async (c: Context) => {
    try {
        const payments = await getAllPaymentsService();
        if (!payments || payments.length === 0) {
            return c.text("No payments found", 404);
        }
        return c.json(payments, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Get payment by ID
export const getPaymentByIdController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const payment = await getPaymentByIdService(id);
        if (!payment) {
            return c.text("Payment not found", 404);
        }
        return c.json(payment, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Create payment
export const createPaymentController = async (c: Context) => {
    try {
        const payment = await c.req.json();
        const newPayment = await createPaymentService(payment);

        if (!newPayment) {
            return c.text("Payment not created", 400);
        }
        return c.json({ message: "Payment created successfully" }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Update payment
export const updatePaymentController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const payment = await c.req.json();
        const updatedPayment = await updatePaymentService(id, payment);

        if (!updatedPayment) {
            return c.text("Payment not updated", 400);
        }
        return c.json({ message: "Payment updated successfully" }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Delete payment
export const deletePaymentController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const deletedPayment = await deletePaymentService(id);

        if (!deletedPayment) {
            return c.text("Payment not deleted", 400);
        }
        return c.json({ message: "Payment deleted successfully" }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};
export const createCheckoutSessionController = async (c: Context) => {
    let booking;
    try {
        booking = await c.req.json();
        console.log('Received booking:', booking); // Debugging line
    } catch (error: any) {
        return c.json({ message: "Booking not found" }, 404);
    }

    try {
        if (!booking.booking_id) return c.json({ message: "Booking ID is Required" }, 404);

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Car Rental',
                },
                unit_amount: Math.round(booking.total_amount * 100), 
            },
            quantity: 1,
        }];

        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${ClientURL}/payment-success`,
            cancel_url: `${ClientURL}/payment-canceled`,
        };

        const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create(sessionParams);
        console.log(`Checkout Session URL: ${session.url}`);

        const paymentDetails = {
            booking_id: booking.booking_id,
            amount: booking.total_amount.toString(),
            user_id: booking.user_id,
            payment_date: new Date().toISOString(), 
            payment_method: 'card',
            transaction_id: session.id,
        };

        console.log('Saving payment details:', paymentDetails); 
        const createPayment = await createPaymentService(paymentDetails);
        return c.json({ sessionId: session.id, url: session.url, payment: createPayment }, 200);
    } catch (error: any) {
        return c.json({ message: error.message }, 400);
    }
};
