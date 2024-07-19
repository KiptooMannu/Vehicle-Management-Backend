import { db } from "../drizzle/db";
import { BookingsTable, VehiclesTable } from "../drizzle/schema";
import { eq, and, or, lt, gt, not } from "drizzle-orm";

// Check vehicle availability based on booking dates
export const checkVehicleAvailability = async (
  vehicle_id: number,
  booking_date: string,
  return_date: string
): Promise<boolean> => {
  // Ensure the dates are in a comparable format
  const parsedBookingDate = new Date(booking_date).toISOString();
  const parsedReturnDate = new Date(return_date).toISOString();


  if (parsedBookingDate >= parsedReturnDate) {
    throw new Error("Booking date must be before the return date.");
  }


  // Check if the vehicle exists and is available
  const vehicle = await db.query.VehiclesTable.findFirst({
    where: eq(VehiclesTable.vehicle_id, vehicle_id),
  });

  if (!vehicle || !vehicle.availability) {
    return false; // Vehicle is not available
  }

  // Check for overlapping bookings
  const overlappingBookings = await db.query.BookingsTable.findMany({
    where: and(
      eq(BookingsTable.vehicle_id, vehicle_id),
      or(
        and(
          not(lt(BookingsTable.return_date, parsedBookingDate)), // Existing booking's end date is on or after requested start date
          not(gt(BookingsTable.booking_date, parsedReturnDate))  // Existing booking's start date is on or before requested end date
        )
      )
    ),
  });

  // If there are overlapping bookings, the vehicle is not available
  return overlappingBookings.length === 0;
};
