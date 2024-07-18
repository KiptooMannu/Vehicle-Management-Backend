import { Hono } from "hono";
import { getAllVehicles, getVehicle,deleteVehicle,createVehicle,getVehicleWithSpecController,getVehicleWithSpecsByIdController ,createVehicleWithSpecController } from "./v.controller";


export const vehicleSpecificationRouterr = new Hono();

vehicleSpecificationRouterr.get("/vehiclesSpecifications",getAllVehicles );
vehicleSpecificationRouterr.get("/vehiclesSpecifications/:id", getVehicle);

vehicleSpecificationRouterr.delete("/vehiclesSpecifications/:id", deleteVehicle);
vehicleSpecificationRouterr.post("/vehiclesSpecifications", createVehicle);
vehicleSpecificationRouterr.get("/combined", getVehicleWithSpecController);

vehicleSpecificationRouterr.get("/vehicles/speccs/:id", getVehicleWithSpecsByIdController);


vehicleSpecificationRouterr.post("/vehicleSpecs", createVehicleWithSpecController, )

