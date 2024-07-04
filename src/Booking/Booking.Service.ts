import { db } from "../drizzle/db";
import { TIBooking, TSBooking, BookingsTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Get all bookings
export const getAllBookingsService = async (): Promise<TSBooking[] | null> => {
    const bookings = await db.query.BookingsTable.findMany();
    return bookings;
};

// Get booking by ID
export const getBookingByIdService = async (booking_id: number): Promise<TSBooking | undefined> => {
    const booking = await db.query.BookingsTable.findFirst({
        where: eq(BookingsTable.booking_id, booking_id),
    });
    return booking;
};


// Updated function to accept transaction
export const createBookingServiceWithTransaction = async (booking: TIBooking, trx: any) => {
    await trx.insert(BookingsTable).values(booking);
};

// Update booking
export const updateBookingService = async (booking_id: number, booking: TIBooking): Promise<string> => {
    await db.update(BookingsTable).set(booking).where(eq(BookingsTable.booking_id, booking_id));
    return "Booking updated successfully";
};

// Delete booking
export const deleteBookingService = async (booking_id: number): Promise<string> => {
    await db.delete(BookingsTable).where(eq(BookingsTable.booking_id, booking_id));
    return "Booking deleted successfully";
};
