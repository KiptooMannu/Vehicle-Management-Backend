import { Context } from 'hono';
import { getAllBookingsService, getBookingByIdService, updateBookingService, deleteBookingService } from './Booking.Service';
import { manageBookingTransaction } from './TransactionService';
import { checkVehicleAvailability } from './VehicleAvailabilityService';
import { validateBooking } from './BookingValidation';

// Get all bookings
export const getAllBookingsController = async (c: Context) => {
    try {
        const bookings = await getAllBookingsService();
        if (!bookings || bookings.length === 0) {
            return c.text('No bookings found', 404);
        }
        return c.json(bookings, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Get booking by ID
export const getBookingByIdController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param('id'));
        if (isNaN(id)) {
            return c.text('Invalid id', 400);
        }
        const booking = await getBookingByIdService(id);
        if (!booking) {
            return c.text('Booking not found', 404);
        }
        return c.json(booking, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};


export const createBookingController = async (c: Context) => {
    try {
      const booking = await c.req.json();
      console.log("Creating Booking");
  
      // Step 1: Validate Booking
      console.log("Proceeding to validate booking...");
      const validation = await validateBooking(booking);
  
      if (!validation.valid) {
        console.log("Booking validation failed:", validation.message);
        return c.text(validation.message, 400);
      }
  
      // Step 2: Check Vehicle Availability
      console.log("Proceeding to check vehicle availability...");
      const isAvailable = await checkVehicleAvailability(booking.vehicle_id, booking.booking_date, booking.return_date);
  
      if (!isAvailable) {
        console.log("Vehicle is not available for the selected dates.");
        return c.text('Vehicle is not available for the selected dates', 400);
      }
  
      // Step 3: Manage Booking Transaction (includes booking creation and payment processing)
      console.log("Booking validated. Proceeding to manage booking transaction...");
      const transactionResult = await manageBookingTransaction(booking);
  
      if (!transactionResult.success) {
        console.error("Booking failed due to payment processing failure:", transactionResult.message);
        return c.text(transactionResult.message, 400);
      }
  
      // Final response
      console.log("Booking and payment processed successfully.");
      return c.json({ message: 'Booking created and payment processed successfully' }, 201);
    } catch (error: any) {
      console.error("Error creating booking:", error.message || error);
      return c.json({ error: error?.message }, 500);
    }
  };


  
// Update booking
export const updateBookingController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param('id'));
        if (isNaN(id)) {
            return c.text('Invalid id', 400);
        }
        const booking = await c.req.json();
        const updatedBooking = await updateBookingService(id, booking);

        if (!updatedBooking) {
            return c.text('Booking not updated', 400);
        }
        return c.json({ message: 'Booking updated successfully' }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Delete booking
export const deleteBookingController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param('id'));
        if (isNaN(id)) {
            return c.text('Invalid id', 400);
        }
        const deletedBooking = await deleteBookingService(id);

        if (!deletedBooking) {
            return c.text('Booking not deleted', 400);
        }
        return c.json({ message: 'Booking deleted successfully' }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};
