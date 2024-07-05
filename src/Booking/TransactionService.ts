import { db } from "../drizzle/db";
import { TIBooking } from "../drizzle/schema";
import Paystack from 'paystack-api';
import { createBookingServiceWithTransaction } from "./Booking.Service";
import { PaymentsTable } from "../drizzle/schema"; // Ensure this import is correct

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY as string;
const paystack = Paystack(paystackSecretKey);

export const manageBookingTransaction = async (
  booking: TIBooking
): Promise<{ success: boolean; message: string }> => {
  console.log("Proceeding to process payment...");

  try {
    // Start a transaction
    await db.transaction(async (trx: any) => {
      // Calculate amount in kobo (100 kobo = 1 Naira in Paystack)
      const amountInKobo = Math.round(parseFloat(booking.total_amount) * 100);

      // Generate a unique transaction reference
      const transactionReference = `booking_${booking.booking_id}_${Date.now()}`;

      // Paystack Payment Processing
      const payment = await paystack.transaction.initialize({
        amount: amountInKobo, // Amount in kobo (integer)
        email: "example@example.com", // Replace with user's email from booking
        reference: transactionReference, // Use generated transaction reference
      });

      // If payment fails, it will throw an error and the transaction will be rolled back
      console.log("Payment processing successful. Transaction Reference:", payment.data.reference);

      // Proceed to create booking only if payment is successful
      await createBookingServiceWithTransaction(booking, trx);

      // Record the payment details in the PaymentsTable
      await trx.insert(PaymentsTable).values({
        booking_id: booking.booking_id,
        amount: booking.total_amount,
        payment_status: "Pending", // Assuming payment was successful
        payment_date: new Date(),
        payment_method: "Paystack",
        transaction_id: payment.data.reference, // Unique transaction ID from Paystack
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
