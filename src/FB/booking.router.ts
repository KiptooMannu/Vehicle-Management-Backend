// booking.router.ts
import { Hono } from "hono";
import { getBookingsController, getBookingByIdController, createBookingController, updateBookingController, deleteBookingController } from "./booking.controller";
import { zValidator } from "@hono/zod-validator";
import { bookingSchema } from '../validator';
import { adminRoleAuth, userRoleAuth, bothRoleAuth } from '../middlewares/auth.middlewares';

export const bookingRouterr = new Hono();

// GET ALL BOOKINGS
bookingRouterr.get("/bookingszzz",  getBookingsController);

// GET BOOKING BY ID
bookingRouterr.get("/bookings/:id",  getBookingByIdController);

// CREATE BOOKING
bookingRouterr.post("/bookingszzz", zValidator('json', bookingSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), createBookingController);

// UPDATE BOOKING
bookingRouterr.put("/bookings/:id", zValidator('json', bookingSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), updateBookingController);

// DELETE BOOKING
bookingRouterr.delete("/bookings/:id", adminRoleAuth, deleteBookingController);
