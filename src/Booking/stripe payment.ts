// import { Stripe } from 'stripe';
// import { db } from "../drizzle/db";
// import { PaymentsTable, TIBooking } from "../drizzle/schema";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//     apiVersion: '2020-08-27',
// });

// export const processPayment = async (booking: TIBooking, trx?: any): Promise<void> => {
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: booking.total_amount * 100, // Amount in cents
//         currency: 'usd',
//         payment_method: booking.payment_method,
//         confirmation_method: 'manual',
//         confirm: true,
//     });

//     await db.insert(PaymentsTable).values({
//         booking_id: booking.booking_id,
//         amount: booking.total_amount,
//         payment_status: 'Completed',
//         payment_date: new Date().toISOString(),
//         payment_method: booking.payment_method,
//         transaction_id: paymentIntent.id,
//     }).run(trx);
// };
