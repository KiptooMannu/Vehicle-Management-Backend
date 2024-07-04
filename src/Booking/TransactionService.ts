// import { db } from "../drizzle/db";
// import { TIBooking } from "../drizzle/schema";
// import { validateBooking } from "../Booking/BookingValidation";
// import { processPayment } from "./stripe payment"; 
// import { createBookingServiceWithTransaction } from "./Booking.Service";

// export const manageBookingTransaction = async (booking: TIBooking): Promise<{ success: boolean, message: string }> => {

//     const validation = await validateBooking(booking);

//     if (!validation.valid) {
       
//         return { success: false, message: validation.message };
//     }

   

//     try {
//         await db.transaction(async (trx) => {
//             await createBookingServiceWithTransaction(booking);
         

//             // Process payment
//             await processPayment(booking, trx);
           
//         });

      
//         return { success: true, message: "Booking and payment processed successfully" };
//     } catch (error: any) {
//         return { success: false, message: "Transaction failed: " + (error.message || error) };
//     }
// };

import { db } from "../drizzle/db";
import { TIBooking } from "../drizzle/schema";
import Stripe from "stripe";
import { createBookingServiceWithTransaction } from "./Booking.Service";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20",
});

export const manageBookingTransaction = async (
  booking: TIBooking
): Promise<{ success: boolean; message: string }> => {
  console.log("Proceeding to process payment...");

  try {
    // Start a transaction
    await db.transaction(async (trx: any) => {
      // Stripe Payment Processing
      const amount = parseFloat(booking.total_amount) * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
        description: `Booking Payment for booking ID: ${booking.booking_id}`,
        receipt_email: "example@example.com", // Replace with user's email from booking
      });

      // If payment fails, it will throw an error and the transaction will be rolled back
      console.log("Payment processing successful. Payment Intent ID:", paymentIntent.id);

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
