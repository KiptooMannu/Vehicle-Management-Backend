import { db } from "../drizzle/db";
import { TIVehicleSpecification, VehicleSpecificationsTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// GET ALL VEHICLE SPECIFICATIONS
export const getVehicleSpecificationsService = async (): Promise<TIVehicleSpecification[] | null> => {
    const vehicleSpecs = await db.query.VehicleSpecificationsTable.findMany();
    return vehicleSpecs;
};

// GET VEHICLE SPECIFICATION BY ID
export const getVehicleSpecificationByIdService = async (id: number): Promise<TIVehicleSpecification | undefined> => {
    const vehicleSpec = await db.query.VehicleSpecificationsTable.findFirst({
        where: eq(VehicleSpecificationsTable.vehicle_id, id)
    });
    return vehicleSpec;
};

// CREATE VEHICLE SPECIFICATION
export const createVehicleSpecificationService = async (vehicleSpec: TIVehicleSpecification): Promise<string> => {
    await db.insert(VehicleSpecificationsTable).values(vehicleSpec);
    return "Vehicle specification created successfully";
};

// UPDATE VEHICLE SPECIFICATION
export const updateVehicleSpecificationService = async (id: number, vehicleSpec: TIVehicleSpecification): Promise<string> => {
    await db.update(VehicleSpecificationsTable).set(vehicleSpec).where(eq(VehicleSpecificationsTable.vehicle_id, id));
    return "Vehicle specification updated successfully";
};

// DELETE VEHICLE SPECIFICATION
export const deleteVehicleSpecificationService = async (id: number): Promise<string> => {
    await db.delete(VehicleSpecificationsTable).where(eq(VehicleSpecificationsTable.vehicle_id, id));
    return "Vehicle specification deleted successfully";
};
