import { db } from "../drizzle/db";
import { TIBooking } from "../drizzle/schema";
import { createBookingServiceWithTransaction } from "./Booking.Service";
import { PaymentsTable } from "../drizzle/schema"; // Ensure this import is correct
import Stripe from 'stripe';
import { BookingsTable } from '../drizzle/schema'; // Adjust the path as necessary

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
    const result = await db.transaction(async (trx: any) => {
      // Insert booking first and get the generated ID
      const [insertedBooking] = await trx.insert(BookingsTable).values(booking).returning(); // Adjust this based on your ORM or database library

      if (!insertedBooking) {
        throw new Error("Failed to insert booking.");
      }

      const bookingId = insertedBooking.booking_id;

      // Calculate amount in cents (Stripe uses smallest currency unit)
      const amountInCents = Math.round(parseFloat(booking.total_amount) * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd', // Replace with appropriate currency code
        payment_method_types: ['card'],
        description: `Booking payment for booking ID: ${bookingId}`,
        metadata: {
          booking_id: bookingId.toString(),
          user_email: "example@example.com", // Replace with user's email from booking
        },
      });

      console.log("Payment processing successful. Payment Intent ID:", paymentIntent.id);

      // Record the payment details in the PaymentsTable
      await trx.insert(PaymentsTable).values({
        booking_id: bookingId,
        amount: booking.total_amount,
        payment_status: "Pending", // Assuming payment was successful
        payment_date: new Date(),
        payment_method: "Stripe",
        transaction_id: paymentIntent.id, // Unique transaction ID from Stripe
      });

      console.log("Booking and payment details recorded in the database.");

      return { success: true, message: "Booking and payment processed successfully" };
    });

    console.log("Booking and payment processed successfully.");
    return result;
  } catch (error: any) {
    console.error("Booking and payment processing failed:", error.message || error);
    return { success: false, message: "Booking and payment processing failed: " + (error.message || error) };
  }
};