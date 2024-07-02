import { db } from "../drizzle/db";
import { TILocation, TSLocation, LocationsTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Get all locations
export const getAllLocationsService = async (): Promise<TSLocation[] | null> => {
  const locations = await db.query.LocationsTable.findMany();
  return locations;
};

// Get location by ID
export const getLocationByIdService = async (location_id: number): Promise<TSLocation | undefined> => {
  const location = await db.query.LocationsTable.findFirst({
    where: eq(LocationsTable.location_id, location_id),
  });
  return location;
};

// Create location
export const createLocationService = async (location: TILocation): Promise<string> => {
  await db.insert(LocationsTable).values(location);
  return "Location created successfully";
};

// Update location
export const updateLocationService = async (location_id: number, location: TILocation): Promise<string> => {
  await db.update(LocationsTable).set(location).where(eq(LocationsTable.location_id, location_id));
  return "Location updated successfully";
};

// Delete location
export const deleteLocationService = async (location_id: number): Promise<string> => {
  await db.delete(LocationsTable).where(eq(LocationsTable.location_id, location_id));
  return "Location deleted successfully";
};
