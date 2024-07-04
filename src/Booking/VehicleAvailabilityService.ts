import { db } from "../drizzle/db";
import { VehiclesTable, BookingsTable } from "../drizzle/schema";
import { eq, and, or, gt, lt } from "drizzle-orm";

export const checkVehicleAvailability = async (vehicle_id: number, booking_date: string, return_date: string): Promise<boolean> => {
    const vehicle = await db.query.VehiclesTable.findFirst({
        where: eq(VehiclesTable.vehicle_id, vehicle_id),
    });

    if (!vehicle || !vehicle.availability) {
        return false;
    }

    const overlappingBookings = await db.query.BookingsTable.findMany({
        where: and(
            eq(BookingsTable.vehicle_id, vehicle_id),
            or(
                and(gt(BookingsTable.booking_date, booking_date), lt(BookingsTable.booking_date, return_date)),
                and(gt(BookingsTable.return_date, booking_date), lt(BookingsTable.return_date, return_date))
            )
        )
    });

    return overlappingBookings.length === 0;
};
