import { Context } from "hono";
import { getAllBookingsService, getBookingByIdService, createBookingService, updateBookingService, deleteBookingService } from "./Booking.Service";

// Get all bookings
export const getAllBookingsController = async (c: Context) => {
    try {
        const bookings = await getAllBookingsService();
        if (!bookings || bookings.length === 0) {
            return c.text("No bookings found", 404);
        }
        return c.json(bookings, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Get booking by ID
export const getBookingByIdController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const booking = await getBookingByIdService(id);
        if (!booking) {
            return c.text("Booking not found", 404);
        }
        return c.json(booking, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Create booking
export const createBookingController = async (c: Context) => {
    try {
        const booking = await c.req.json();
        const newBooking = await createBookingService(booking);

        if (!newBooking) {
            return c.text("Booking not created", 400);
        }
        return c.json({ message: "Booking created successfully" }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Update booking
export const updateBookingController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const booking = await c.req.json();
        const updatedBooking = await updateBookingService(id, booking);

        if (!updatedBooking) {
            return c.text("Booking not updated", 400);
        }
        return c.json({ message: "Booking updated successfully" }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Delete booking
export const deleteBookingController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const deletedBooking = await deleteBookingService(id);

        if (!deletedBooking) {
            return c.text("Booking not deleted", 400);
        }
        return c.json({ message: "Booking deleted successfully" }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};
