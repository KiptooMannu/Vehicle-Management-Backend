import { Hono } from "hono";
import { getAllVehicles, getVehicle,deleteVehicle,createVehicle,getVehicleWithSpecController,getVehicleWithSpecsByIdController ,createVehicleWithSpecController ,updateVehicleController} from "./v.controller";


export const vehicleSpecificationRouterr = new Hono();

vehicleSpecificationRouterr.get("/vehiclesandSpecifications",getAllVehicles );
vehicleSpecificationRouterr.get("/vehiclesandSpecifications/:id", getVehicle);



vehicleSpecificationRouterr.get("/vehiclesSpecifications",getAllVehicles );
vehicleSpecificationRouterr.get("/vehiclesSpecifications/:id", getVehicle);

vehicleSpecificationRouterr.delete("/vehiclesSpecifications/:id", deleteVehicle);
vehicleSpecificationRouterr.post("/vehiclesSpecifications", createVehicle);
vehicleSpecificationRouterr.get("/combined", getVehicleWithSpecController);
vehicleSpecificationRouterr.get("/vehicles/specs/:id", getVehicleWithSpecsByIdController);


vehicleSpecificationRouterr.post("/addvehicles", createVehicleWithSpecController, )
vehicleSpecificationRouterr.put("/putvehicles/:id", updateVehicleController);