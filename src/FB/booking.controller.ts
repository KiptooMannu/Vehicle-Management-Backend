// booking.controller.ts
import { Context } from "hono";
import { getBookingsService, getBookingByIdService, createBookingService, updateBookingService, deleteBookingService } from "./booking.service";
import { TIBooking } from "../drizzle/schema";

// GET ALL BOOKINGS
export const getBookingsController = async (c: Context) => {
    try {
        const limit = c.req.query("limit") ? parseInt(c.req.query("limit")!) : undefined;
        const bookings = await getBookingsService(limit);
        if (!bookings || bookings.length === 0) {
            return c.text("No bookings found", 404);
        }
        return c.json(bookings, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// GET BOOKING BY ID
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

// CREATE BOOKING
export const createBookingController = async (c: Context) => {
    try {
        const booking: TIBooking = await c.req.json();
        const result = await createBookingService(booking);
        return c.json({ message: result }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// UPDATE BOOKING
export const updateBookingController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const booking: TIBooking = await c.req.json();
        const result = await updateBookingService(id, booking);
        if (result === "Booking updated successfully") {
            return c.json({ message: result }, 200);
        } else {
            return c.text(result, 400);
        }
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// DELETE BOOKING
export const deleteBookingController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const result = await deleteBookingService(id);
        if (result === "Booking deleted successfully") {
            return c.json({ message: result }, 200);
        } else {
            return c.text(result, 400);
        }
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};
