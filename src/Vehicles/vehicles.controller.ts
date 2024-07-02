import { Context } from "hono";
import { getAllVehiclesService, getVehicleByIdService, createVehicleService, updateVehicleService, deleteVehicleService } from "./vehicles.service";

// Get all vehicles
export const getAllVehiclesController = async (c: Context) => {
    try {
        const vehicles = await getAllVehiclesService();
        if (!vehicles || vehicles.length === 0) {
            return c.text("No vehicles found", 404);
        }
        return c.json(vehicles, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Get vehicle by ID
export const getVehicleByIdController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const vehicle = await getVehicleByIdService(id);
        if (!vehicle) {
            return c.text("Vehicle not found", 404);
        }
        return c.json(vehicle, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Create vehicle
export const createVehicleController = async (c: Context) => {
    try {
        const vehicle = await c.req.json();
        const newVehicle = await createVehicleService(vehicle);

        if (!newVehicle) {
            return c.text("Vehicle not created", 400);
        }
        return c.json({ message: "Vehicle created successfully" }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Update vehicle
export const updateVehicleController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const vehicle = await c.req.json();
        const updatedVehicle = await updateVehicleService(id, vehicle);

        if (!updatedVehicle) {
            return c.text("Vehicle not updated", 400);
        }
        return c.json({ message: "Vehicle updated successfully" }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Delete vehicle
export const deleteVehicleController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const deletedVehicle = await deleteVehicleService(id);

        if (!deletedVehicle) {
            return c.text("Vehicle not deleted", 400);
        }
        return c.json({ message: "Vehicle deleted successfully" }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};
