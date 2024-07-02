import { db } from "../drizzle/db";
import { TIVehicle, TSVehicle, VehiclesTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Get all vehicles
export const getAllVehiclesService = async (): Promise<TSVehicle[] | null> => {
    const vehicles = await db.query.VehiclesTable.findMany();
    return vehicles;
};

// Get vehicle by ID
export const getVehicleByIdService = async (vehicle_id: number): Promise<TSVehicle | undefined> => {
    const vehicle = await db.query.VehiclesTable.findFirst({
        where: eq(VehiclesTable.vehicle_id, vehicle_id),
    });
    return vehicle;
};

// Create vehicle
export const createVehicleService = async (vehicle: TIVehicle): Promise<string> => {
    await db.insert(VehiclesTable).values(vehicle);
    return "Vehicle created successfully";
};

// Update vehicle
export const updateVehicleService = async (vehicle_id: number, vehicle: TIVehicle): Promise<string> => {
    await db.update(VehiclesTable).set(vehicle).where(eq(VehiclesTable.vehicle_id, vehicle_id));
    return "Vehicle updated successfully";
};

// Delete vehicle
export const deleteVehicleService = async (vehicle_id: number): Promise<string> => {
    await db.delete(VehiclesTable).where(eq(VehiclesTable.vehicle_id, vehicle_id));
    return "Vehicle deleted successfully";
};
