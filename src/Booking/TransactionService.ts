
// import { db } from "../drizzle/db";
// import { TIBooking } from "../drizzle/schema";
// import Stripe from "stripe";
// import { createBookingServiceWithTransaction } from "./Booking.Service";

// const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;
// const stripe = new Stripe(stripeSecretKey, {
//   apiVersion: "2024-06-20",
// });

// export const manageBookingTransaction = async (
//   booking: TIBooking
// ): Promise<{ success: boolean; message: string }> => {
//   console.log("Proceeding to process payment...");

//   try {
//     // Start a transaction
//     await db.transaction(async (trx: any) => {
//       // Stripe Payment Processing
//       const amount = parseFloat(booking.total_amount) * 100;
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: amount,
//         currency: "usd",
//         payment_method_types: ["card"],
//         description: `Booking Payment for booking ID: ${booking.booking_id}`,
//         receipt_email: "example@example.com", // Replace with user's email from booking
//       });

//       // If payment fails, it will throw an error and the transaction will be rolled back
//       console.log("Payment processing successful. Payment Intent ID:", paymentIntent.id);

//       // Proceed to create booking only if payment is successful
//       await createBookingServiceWithTransaction(booking, trx);
//     });

//     console.log("Booking and payment processed successfully.");
//     return { success: true, message: "Booking and payment processed successfully" };
//   } catch (error: any) {
//     console.error("Booking and payment processing failed:", error.message || error);
//     return { success: false, message: "Booking and payment processing failed: " + (error.message || error) };
//   }
// };



import { db } from "../drizzle/db";
import { TIBooking } from "../drizzle/schema";
import Paystack from 'paystack-api';
import { createBookingServiceWithTransaction } from "./Booking.Service";

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY as string;
const paystack = Paystack(paystackSecretKey);

export const manageBookingTransaction = async (
  booking: TIBooking
): Promise<{ success: boolean; message: string }> => {
  console.log("Proceeding to process payment...");

  try {
    // Start a transaction
    await db.transaction(async (trx: any) => {
      // Paystack Payment Processing
      const paymentResponse = await paystack.transaction.initialize({
        amount: parseFloat(booking.total_amount) * 100, // Paystack expects amount in kobo
        email: "example@example.com", // Replace with user's email from booking
        reference: "MC-" + Date.now() // Unique transaction reference
      });

      if (paymentResponse.status !== true) {
        throw new Error("Payment failed: " + paymentResponse.message);
      }

      console.log("Payment processing successful. Transaction Reference:", paymentResponse.data.reference);

      // Proceed to create booking only if payment is successful
      await createBookingServiceWithTransaction(booking, trx);
    });

    console.log("Booking and payment processed successfully.");
    return { success: true, message: "Booking and payment processed successfully" };
  } catch (error: any) {
    console.error("Booking and payment processing failed:", error.message || error);
    return { success: false, message: "Booking and payment processing failed: " + (error.message || error) };
  }
};
