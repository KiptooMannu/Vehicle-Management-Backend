import { Context } from "hono";
import { getAllFleetManagementService, getFleetManagementByIdService, createFleetManagementService, updateFleetManagementService, deleteFleetManagementService } from "./Fmanagement.service";

// Get all fleet management entries
export const getAllFleetManagementController = async (c: Context) => {
    try {
        const fleetManagement = await getAllFleetManagementService();
        if (!fleetManagement || fleetManagement.length === 0) {
            return c.text("No fleet management entries found", 404);
        }
        return c.json(fleetManagement, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Get fleet management entry by ID
export const getFleetManagementByIdController = async (c: Context) => {
    try {
        const fleet_id = parseInt(c.req.param("id"));
        if (isNaN(fleet_id)) {
            return c.text("Invalid fleet ID", 400);
        }
        const fleetManagement = await getFleetManagementByIdService(fleet_id);
        if (!fleetManagement) {
            return c.text("Fleet management entry not found", 404);
        }
        return c.json(fleetManagement, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Create fleet management entry
export const createFleetManagementController = async (c: Context) => {
    try {
        const fleetManagement = await c.req.json();
        const newFleetManagement = await createFleetManagementService(fleetManagement);

        if (!newFleetManagement) {
            return c.text("Fleet management entry not created", 400);
        }
        return c.json({ message: "Fleet management entry created successfully" }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Update fleet management entry
export const updateFleetManagementController = async (c: Context) => {
    try {
        const fleet_id = parseInt(c.req.param("id"));
        if (isNaN(fleet_id)) {
            return c.text("Invalid fleet ID", 400);
        }
        const fleetManagement = await c.req.json();
        const updatedFleetManagement = await updateFleetManagementService(fleet_id, fleetManagement);

        if (!updatedFleetManagement) {
            return c.text("Fleet management entry not updated", 400);
        }
        return c.json({ message: "Fleet management entry updated successfully" }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Delete fleet management entry
export const deleteFleetManagementController = async (c: Context) => {
    try {
        const fleet_id = parseInt(c.req.param("id"));
        if (isNaN(fleet_id)) {
            return c.text("Invalid fleet ID", 400);
        }
        const deletedFleetManagement = await deleteFleetManagementService(fleet_id);

        if (!deletedFleetManagement) {
            return c.text("Fleet management entry not deleted", 400);
        }
        return c.json({ message: "Fleet management entry deleted successfully" }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};
