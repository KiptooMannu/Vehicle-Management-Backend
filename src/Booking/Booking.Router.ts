import { Hono } from 'hono';
import { getAllBookingsController, getBookingByIdController, createBookingController, updateBookingController, deleteBookingController } from './Booking.controller';

export const bookingRouter = new Hono();

bookingRouter
    .get("bookings", getAllBookingsController)
    .get("bookings/:id", getBookingByIdController)
    .post("bookings", createBookingController)
    .put("bookings/:id", updateBookingController)
    .delete("bookings/:id", deleteBookingController);

export default bookingRouter;
