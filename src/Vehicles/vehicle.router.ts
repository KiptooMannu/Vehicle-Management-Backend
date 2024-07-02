import { Hono } from 'hono';
import { getAllVehiclesController, getVehicleByIdController, createVehicleController, updateVehicleController, deleteVehicleController } from './vehicles.controller';

export const vehicleRouter = new Hono();

vehicleRouter
    .get("vehicles", getAllVehiclesController)
    .get("vehicles/:id", getVehicleByIdController)
    .post("vehicles", createVehicleController)
    .put("vehicles/:id", updateVehicleController)
    .delete("vehicles/:id", deleteVehicleController);

export default vehicleRouter;
