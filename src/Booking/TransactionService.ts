import { db } from "../drizzle/db";
import { TIBooking } from "../drizzle/schema";
import { BookingsTable } from '../drizzle/schema'; // Adjust the path as necessary

export const manageBookingTransaction = async (
  booking: TIBooking
): Promise<{ success: boolean; message: string }> => {
  console.log("Proceeding to create booking...");

  try {
    // Start a transaction
    const result = await db.transaction(async (trx: any) => {
      // Insert booking first and get the generated ID
      const [insertedBooking] = await trx.insert(BookingsTable).values(booking).returning(); // Adjust this based on your ORM or database library

      if (!insertedBooking) {
        throw new Error("Failed to insert booking.");
      }

      const bookingId = insertedBooking.booking_id;

      // Record the booking details in the BookingsTable
      await trx.insert(BookingsTable).values({
        booking_id: bookingId,
        ...booking,
      });

      console.log("Booking details recorded in the database.");

      return { success: true, message: "Booking processed successfully" };
    });

    console.log("Booking processed successfully.");
    return result;
  } catch (error: any) {
    console.error("Booking processing failed:", error.message || error);
    return { success: false, message: "Booking processing failed: " + (error.message || error) };
  }
};
