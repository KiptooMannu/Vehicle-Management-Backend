import { db } from "../drizzle/db";
import { TIBooking, TSBooking, BookingsTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Get all bookings
export const getAllBookingsService = async (): Promise<TSBooking[] | null> => {
    try {
        const bookings = await db.query.BookingsTable.findMany();
        return bookings;
    } catch (error: any) {
        console.error("Error retrieving all bookings:", error.message || error);
        throw new Error("Failed to retrieve bookings");
    }
};

// Get booking by ID
export const getBookingByIdService = async (booking_id: number): Promise<TSBooking | undefined> => {
    try {
        const booking = await db.query.BookingsTable.findFirst({
            where: eq(BookingsTable.booking_id, booking_id),
        });
        return booking;
    } catch (error: any) {
        console.error(`Error retrieving booking with ID ${booking_id}:`, error.message || error);
        throw new Error("Failed to retrieve booking");
    }
};

// Create booking
export const createBookingService = async (booking: TIBooking): Promise<TSBooking | null> => {
    try {
        const [newBooking] = await db.insert(BookingsTable).values(booking).returning();
        return newBooking;
    } catch (error: any) {
        console.error("Error creating booking:", error.message || error);
        throw new Error("Failed to create booking");
    }
};

// Update booking
export const updateBookingService = async (booking_id: number, booking: TIBooking): Promise<string> => {
    try {
        await db.update(BookingsTable).set(booking).where(eq(BookingsTable.booking_id, booking_id));
        return "Booking updated successfully";
    } catch (error: any) {
        console.error(`Error updating booking with ID ${booking_id}:`, error.message || error);
        throw new Error("Failed to update booking");
    }
};

// Delete booking
export const deleteBookingService = async (booking_id: number): Promise<string> => {
    try {
        await db.delete(BookingsTable).where(eq(BookingsTable.booking_id, booking_id));
        return "Booking deleted successfully";
    } catch (error: any) {
        console.error(`Error deleting booking with ID ${booking_id}:`, error.message || error);
        throw new Error("Failed to delete booking");
    }
};



type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Cancelled"
  | "Completed"
  | null
  | undefined;


// Additional logic for updating status, cancellations, etc.
export const updateBookingStatusService = async (
    bookingId: number,
    status: BookingStatus
  ): Promise<void> => {
    await db
      .update(BookingsTable)
      .set({ booking_status: status })
      .where(eq(BookingsTable.booking_id, bookingId))
      .execute();
  };
  
  export const cancelBookingService = async (
    bookingId: number
  ): Promise<void> => {
    await db
      .update(BookingsTable)
      .set({ booking_status: "Cancelled" })
      .where(eq(BookingsTable.booking_id, bookingId))
      .execute();
  };











//get user with booking details
export const getUserWithBookingDetails = async () => {
    return await db.query.BookingsTable.findMany({
      columns: {
        booking_date: true,
        return_date: true,
        total_amount: true,
        booking_status: true,
      },
      with: {
        vehicle: {
          columns: {
            vehicle_id: true,
          },
          with: {
            vehicleSpec: {
              columns: {
                manufacturer: true,
              },
            },
          },
        },
        location: {
          columns: {
            name: true,
          },
        },
      },
    });
  };
  
  
  
  
  export const getUserWithBookingDetailsById = async (userId: number): Promise<TSBooking[]> => {
    return await db.query.BookingsTable.findMany({
      where: eq(BookingsTable.user_id, userId),
      columns: {
        booking_id: true,
        user_id: true,
        created_at: true,
        updated_at: true,
        vehicle_id: true,
        location_id: true,
        booking_date: true,
        return_date: true,
        total_amount: true,
        booking_status: true,
      },
      with: {
        vehicle: {
          columns: {
            vehicle_id: true,
            rental_rate: true,
          },
          with: {
            vehicleSpec: {
              columns: {
                manufacturer: true,
              },
            },
          },
        },
        location: {
          columns: {
            name: true,
          },
        },
        payments:{
          columns:{
            payment_id: true,
            amount: true,
            payment_status: true,
            payment_date: true,
            payment_method: true,
            transaction_id: true,
          }
        }
      },
    });
  };