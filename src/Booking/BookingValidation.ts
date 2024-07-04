import { checkVehicleAvailability } from "../Booking/VehicleAvailabilityService";
import { TIBooking } from "../drizzle/schema";

export const validateBooking = async (booking: TIBooking): Promise<{ valid: boolean, message: string }> => {
     
    const isAvailable = await checkVehicleAvailability(booking.vehicle_id, booking.booking_date, booking.return_date);
    if (!isAvailable) {
        return { valid: false, message: "Vehicle is not available for the selected dates" };
    }

    return { valid: true, message: "Booking is valid" };
};
