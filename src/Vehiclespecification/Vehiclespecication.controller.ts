import { Context } from "hono";
import { getVehicleSpecificationsService, getVehicleSpecificationByIdService, createVehicleSpecificationService, updateVehicleSpecificationService, deleteVehicleSpecificationService } from "./Vehiclespeciication.Service";
import { TIVehicleSpecification } from "../drizzle/schema";

// GET ALL VEHICLE SPECIFICATIONS
export const getVehicleSpecificationsController = async (c: Context) => {
    try {
        const vehicleSpecs = await getVehicleSpecificationsService();
        if (!vehicleSpecs || vehicleSpecs.length === 0) {
            return c.text("No vehicle specifications found", 404);
        }
        return c.json(vehicleSpecs, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// GET VEHICLE SPECIFICATION BY ID
export const getVehicleSpecificationByIdController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const vehicleSpec = await getVehicleSpecificationByIdService(id);
        if (!vehicleSpec) {
            return c.text("Vehicle specification not found", 404);
        }
        return c.json(vehicleSpec, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// CREATE VEHICLE SPECIFICATION
export const createVehicleSpecificationController = async (c: Context) => {
    try {
        const vehicleSpec: TIVehicleSpecification = await c.req.json();
        const result = await createVehicleSpecificationService(vehicleSpec);

        return c.json({ message: result }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// UPDATE VEHICLE SPECIFICATION
export const updateVehicleSpecificationController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const vehicleSpec: TIVehicleSpecification = await c.req.json();
        const result = await updateVehicleSpecificationService(id, vehicleSpec);

        return c.json({ message: result }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// DELETE VEHICLE SPECIFICATION
export const deleteVehicleSpecificationController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const result = await deleteVehicleSpecificationService(id);

        return c.json({ message: result }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};
