import { db } from "../drizzle/db";
import { TIFleetManagement, TSFleetManagement, FleetManagementTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Get all fleet management entries
export const getAllFleetManagementService = async (): Promise<TSFleetManagement[] | null> => {
    const fleetManagementEntries = await db.query.FleetManagementTable.findMany();
    return fleetManagementEntries;
};

// Get fleet management entry by ID
export const getFleetManagementByIdService = async (fleet_id: number): Promise<TSFleetManagement | undefined> => {
    const fleetManagementEntry = await db.query.FleetManagementTable.findFirst({
        where: eq(FleetManagementTable.fleet_id, fleet_id),
    });
    return fleetManagementEntry;
};

// Create fleet management entry
export const createFleetManagementService = async (fleetManagementEntry: TIFleetManagement): Promise<string> => {
    await db.insert(FleetManagementTable).values(fleetManagementEntry);
    return "Fleet management entry created successfully";
};

// Update fleet management entry
export const updateFleetManagementService = async (fleet_id: number, fleetManagementEntry: TIFleetManagement): Promise<string> => {
    await db.update(FleetManagementTable).set(fleetManagementEntry).where(eq(FleetManagementTable.fleet_id, fleet_id));
    return "Fleet management entry updated successfully";
};

// Delete fleet management entry
export const deleteFleetManagementService = async (fleet_id: number): Promise<string> => {
    await db.delete(FleetManagementTable).where(eq(FleetManagementTable.fleet_id, fleet_id));
    return "Fleet management entry deleted successfully";
};
