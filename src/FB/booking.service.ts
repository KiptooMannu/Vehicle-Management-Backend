// booking.service.ts
import { db } from "../drizzle/db";
import { TIBooking, TSBooking, BookingsTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// GET ALL BOOKINGS
export const getBookingsService = async (limit?: number): Promise<TSBooking[] | null> => {
    const bookings = await db.query.BookingsTable.findMany();
    
    if (limit) {
        return bookings.slice(0, limit);
    }
    
    return bookings;
};

// GET BOOKING BY ID
export const getBookingByIdService = async (id: number): Promise<TSBooking | undefined> => {
    const booking = await db.query.BookingsTable.findFirst({
        where: eq(BookingsTable.booking_id, id)
    });
    return booking;
};

// CREATE BOOKING
export const createBookingService = async (booking: TIBooking): Promise<string> => {
    await db.insert(BookingsTable).values(booking);
    return "Booking created successfully";
};

// UPDATE BOOKING
export const updateBookingService = async (id: number, booking: TIBooking): Promise<string> => {
    await db.update(BookingsTable).set(booking).where(eq(BookingsTable.booking_id, id));
    return "Booking updated successfully";
};

// DELETE BOOKING
export const deleteBookingService = async (id: number): Promise<string> => {
    await db.delete(BookingsTable).where(eq(BookingsTable.booking_id, id));
    return "Booking deleted successfully";
};
