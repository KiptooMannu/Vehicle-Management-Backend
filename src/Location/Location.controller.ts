import { Context } from "hono";
import {
  getAllLocationsService,
  getLocationByIdService,
  createLocationService,
  updateLocationService,
  deleteLocationService,
} from "./Location.service";

// Get all locations
export const getAllLocationsController = async (c: Context) => {
  try {
    const locations = await getAllLocationsService();
    if (!locations || locations.length === 0) {
      return c.text("No locations found", 404);
    }
    return c.json(locations, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

// Get location by ID
export const getLocationByIdController = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.text("Invalid id", 400);
    }
    const location = await getLocationByIdService(id);
    if (!location) {
      return c.text("Location not found", 404);
    }
    return c.json(location, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

// Create location
export const createLocationController = async (c: Context) => {
  try {
    const location = await c.req.json();
    const newLocation = await createLocationService(location);

    if (!newLocation) {
      return c.text("Location not created", 400);
    }
    return c.json({ message: "Location created successfully" }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

// Update location
export const updateLocationController = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.text("Invalid id", 400);
    }
    const location = await c.req.json();
    const updatedLocation = await updateLocationService(id, location);

    if (!updatedLocation) {
      return c.text("Location not updated", 400);
    }
    return c.json({ message: "Location updated successfully" }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

// Delete location
export const deleteLocationController = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.text("Invalid id", 400);
    }
    const deletedLocation = await deleteLocationService(id);

    if (!deletedLocation) {
      return c.text("Location not deleted", 400);
    }
    return c.json({ message: "Location deleted successfully" }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};
