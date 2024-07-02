import { Hono } from 'hono';
import {
  getAllLocationsController,
  getLocationByIdController,
  createLocationController,
  updateLocationController,
  deleteLocationController,
} from './Location.controller';

export const locationRouter = new Hono();

locationRouter
  .get("locations", getAllLocationsController)
  .get("locations/:id", getLocationByIdController)
  .post("locations", createLocationController)
  .put("locations/:id", updateLocationController)
  .delete("locations/:id", deleteLocationController);

export default locationRouter;
