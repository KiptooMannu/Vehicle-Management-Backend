import { Hono } from 'hono';
import { getAllBookingsController, getBookingByIdController, createBookingController, updateBookingController, deleteBookingController ,getBookingsWithIdController } from './Booking.controller';

export const bookingRouter = new Hono();

bookingRouter
    .get("bookings", getAllBookingsController)
    .get("bookings/:id", getBookingByIdController)
    .post("bookings", createBookingController)
    .put("bookings/:id", updateBookingController)
    .delete("bookings/:id", deleteBookingController)


.get('/bookings/users/:userId', getBookingsWithIdController);



export default bookingRouter;
