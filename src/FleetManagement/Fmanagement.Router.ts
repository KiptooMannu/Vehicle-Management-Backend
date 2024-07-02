import { Hono } from 'hono';
import { getAllFleetManagementController, getFleetManagementByIdController, createFleetManagementController, updateFleetManagementController, deleteFleetManagementController } from './Fmanagement.controller';

export const fleetManagementRouter = new Hono();

fleetManagementRouter
    .get("fleet-management", getAllFleetManagementController)
    .get("fleet-management/:id", getFleetManagementByIdController)
    .post("fleet-management", createFleetManagementController)
    .put("fleet-management/:id", updateFleetManagementController)
    .delete("fleet-management/:id", deleteFleetManagementController);

export default fleetManagementRouter;
