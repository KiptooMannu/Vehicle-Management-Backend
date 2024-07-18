export interface vehicleType {
    vehicle_id: number;
    vehicleSpec_id: number | null;
    rental_rate: string;
    availability: boolean | null;
    created_at: string | null;
    updated_at: string | null;
    vehicleSpec: {   
      manufacturer: string;
      model: string;
      year: number;
      fuel_type: string;
      engine_capacity?: string | null;
      transmission?: string | null;
      seating_capacity?: number | null;
      color?: string | null;
      features?: string | null;
    };
  };
  