import {db} from "../drizzle/db";
import  {TIVehicleSpecification,TIVehicle,TSVehicleSpecification,VehicleSpecificationsTable, VehiclesTable} from '../drizzle/schema';
import {eq} from 'drizzle-orm';
import { z } from "zod";

export const vehicleServiceSpecifications = async (limit?:number): Promise<TSVehicleSpecification[] | null> => {
    if(limit){
        return await db.query.VehicleSpecificationsTable.findMany({
            limit: limit
        });
    }
    return await db.query.VehicleSpecificationsTable.findMany();

    }

export const getVehicleSpecificationsService = async (id: number): Promise<TSVehicleSpecification | undefined> => {
    return await db.query.VehicleSpecificationsTable.findFirst({
        where: eq(VehicleSpecificationsTable.vehicle_id, id),
    }); 
}

export const updateVehicleSpecificationsService = async (id: number, vehicle: TIVehicleSpecification) => {
    await db.update(VehicleSpecificationsTable).set(vehicle).where(eq(VehicleSpecificationsTable.vehicle_id, id)).execute();
    return 'Vehicle updated successfully';
}

export const deleteVehicleSpecificationsService = async (id: number) => {
    await db.delete(VehicleSpecificationsTable).where(eq(VehicleSpecificationsTable.vehicle_id, id)).execute();
    return 'Vehicle deleted successfully';
}

export const createVehicleSpecificationsService = async (vehicle: TIVehicleSpecification) => {
    await db.insert(VehicleSpecificationsTable).values(vehicle).execute();
    return 'VehicleSpecifications created successfully';
}

export const getVehicleWithSpecs = async () => {
    return await db.query.VehiclesTable.findMany({
        columns: {
            vehicle_id: true,
            vehicleSpec_id: true,
            rental_rate: true,
            availability: true,
            vehicle_image: true,
        },
        with: {
            vehicleSpec: {
                columns: {
                    manufacturer: true,
                    model: true,
                    year: true,
                    fuel_type: true,
                    engine_capacity: true,
                    transmission: true,
                    seating_capacity: true,
                    color: true,
                    features: true,
                }
            }
        }
    });
}



// Service to get a vehicle with its specifications by ID
export const getVehicleWithSpecsById = async (vehicleId: number) => {
    const result = await db.query.VehiclesTable.findMany({
        where: eq(VehiclesTable.vehicleSpec_id, vehicleId),
        columns: {
            vehicle_id: true,
            rental_rate: true,
            availability: true,
      
        },
        with: {
            vehicleSpec: {
                columns: {
                    manufacturer: true,
                    model: true,
                    year: true,
                    fuel_type: true,
                    engine_capacity: true,
                    transmission: true,
                    seating_capacity: true,
                    color: true,
                    features: true,
                }
            }
        }
    });

    if (result.length === 0) {
        throw new Error("Vehicle not found");
    }

    return result[0];
}


//create a veicle and its specs
// Define the schema for validation
const vehicleSpecSchema = z.object({
    manufacturer: z.string(),
    model: z.string(),
    year: z.number(),
    fuel_type: z.string(),
    engine_capacity: z.string().optional(),
    transmission: z.string().optional(),
    seating_capacity: z.number().optional(),
    color: z.string().optional(),
    features: z.string().optional()
  });
  
  const vehicleSchema = z.object({
 
    rental_rate: z.number(),
    availability: z.boolean().optional(),
    vehicle_image: z.string().optional()
  });
  


export const createVehicleWithSpecification = async (vehicleSpec: TIVehicleSpecification, vehicle: TIVehicle) => {
  // Validate the input data
  vehicleSpecSchema.parse(vehicleSpec);
  vehicleSchema.parse(vehicle);

  let vehicleSpecId: number | null = null; // Initialize with null

  try {
    // Insert data into the vehicle_specifications table
    const newVehicleSpec = await db.insert(VehicleSpecificationsTable)
      .values(vehicleSpec)
      .returning({ id: VehicleSpecificationsTable.vehicle_id })
      .execute();

    console.log('newVehicleSpec:', newVehicleSpec); // Log the returned data

    if (newVehicleSpec && newVehicleSpec.length > 0) {
      vehicleSpecId = newVehicleSpec[0].id;
    } else {
      throw new Error('Failed to retrieve vehicle specification ID');
    }

    // Insert data into the vehicles table
    await db.insert(VehiclesTable)
      .values({
        vehicle_id: vehicleSpecId,
        rental_rate: vehicle.rental_rate,
        availability: vehicle.availability,
        vehicle_image: vehicle.vehicle_image,
        created_at: new Date(), // Ensure default values are set correctly
        updated_at: new Date(), // Ensure default values are set correctly
      })
      .execute();

    return 'Vehicle with specifications created successfully';

  } catch (error) {
    // Rollback: delete the vehicle_specification if the second insert fails
    if (vehicleSpecId !== null) {
      await db.delete(VehicleSpecificationsTable)
        .where(eq(VehicleSpecificationsTable.vehicle_id, vehicleSpecId))
        .execute();
    }

    console.error('Error creating vehicle with specification:', error);
    throw new Error('Creation failed. Please try again.');
  }
};

  

  export const updateVehicleWithSpecification = async (vehicleSpec: TIVehicleSpecification, vehicle: TIVehicle, vehicleSpecId: number, rental_rate: any, availability: any) => {
    console.log('Vehicle Spec:', vehicleSpec);
    console.log('Vehicle:', vehicle);
    
    // Validate the input data
    vehicleSpecSchema.parse(vehicleSpec);
    vehicleSchema.parse(vehicle);
  
    // Update data in the vehicle_specifications table
    try {
      await db.update(VehicleSpecificationsTable)
        .set(vehicleSpec)
        .where(eq(VehicleSpecificationsTable.vehicle_id, vehicleSpecId))
        .execute();
    
      // Update data in the vehicles table
      await db.update(VehiclesTable)
        .set({
          rental_rate: vehicle.rental_rate,
          availability: vehicle.availability,
          vehicle_image: vehicle.vehicle_image,
    
        })
        .where(eq(VehiclesTable.vehicle_id, vehicleSpecId))
        .execute();
    
      return 'Vehicle with specifications updated successfully';
    } catch (error) {
      console.error('Update failed:', error);
      throw new Error('Update failed. Please try again.');
    }
  };


