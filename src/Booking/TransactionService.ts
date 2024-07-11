import { db } from "../drizzle/db";
import { TIBooking } from "../drizzle/schema";
import { createBookingServiceWithTransaction } from "./Booking.Service";
import { PaymentsTable } from "../drizzle/schema"; // Ensure this import is correct
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20', 
});

export const manageBookingTransaction = async (
  booking: TIBooking
): Promise<{ success: boolean; message: string }> => {
  console.log("Proceeding to process payment...");

  try {
    // Start a transaction
    await db.transaction(async (trx: any) => {
      // Calculate amount in cents (Stripe uses smallest currency unit)
      const amountInCents = Math.round(parseFloat(booking.total_amount) * 100);


      const transactionReference = `booking_${booking.booking_id}_${Date.now()}`;


      const bookingId = booking.booking_id ? booking.booking_id.toString() : 'undefined';

  
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd', // Replace with appropriate currency code
        payment_method_types: ['card'],
        description: `Booking payment for booking ID: ${bookingId}`,
        metadata: {
          booking_id: bookingId,
          user_email: "example@example.com", // Replace with user's email from booking
        },
      });

      // If payment fails, it will throw an error and the transaction will be rolled back
      console.log("Payment processing successful. Payment Intent ID:", paymentIntent.id);

      // Proceed to create booking only if payment is successful
      await createBookingServiceWithTransaction(booking, trx);

      // Record the payment details in the PaymentsTable
      await trx.insert(PaymentsTable).values({
        booking_id: booking.booking_id,
        amount: booking.total_amount,
        payment_status: "Pending", // Assuming payment was successful
        payment_date: new Date(),
        payment_method: "Stripe",
        transaction_id: paymentIntent.id, // Unique transaction ID from Stripe
      });

      console.log("Booking and payment details recorded in the database.");
    });

    console.log("Booking and payment processed successfully.");
    return { success: true, message: "Booking and payment processed successfully" };
  } catch (error: any) {
    console.error("Booking and payment processing failed:", error.message || error);
    return { success: false, message: "Booking and payment processing failed: " + (error.message || error) };
  }
};
