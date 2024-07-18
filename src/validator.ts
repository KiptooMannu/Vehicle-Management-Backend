import { z } from 'zod';

// User Schema
export const userSchema = z.object({
  full_name: z.string().min(1), // Ensures fullname is not empty
  email: z.string().email(),
  password: z.string().min(6),
  contact_phone: z.string().optional(),
  phone_verified: z.boolean().optional(),
  email_verified: z.boolean().optional(),
  confirmation_code: z.string().optional(),
});

// Define your authentication schema using Zod
export const authSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
});

// Define the schema for vehicle specifications
export const vehicleSpecificationSchema = z.object({
  vehicle_id: z.number().int().optional(),
  manufacturer: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.number().int(),
  fuel_type: z.string().min(1).max(50),
  engine_capacity: z.string().min(1).max(50),
  transmission: z.string().min(1).max(50),
  seating_capacity: z.number().int(),
  color: z.string().min(1).max(50),
  features: z.string().min(1),
});

// Export other schemas as needed

// Extended User Schema for Auth
export const authOnUsersSchema = userSchema.extend({
  role: z.string().optional(),
});

// Login User Schema
export const loginUserSchema = z.object({
  username: z.string(),
  password: z.string().min(6),
});


export const registerUserSchema = z.object({
  user_id: z.number(),
  username: z.string(),
  password: z.string(),
  role: z.enum(["admin", "user"]), // Role must be either "admin" or "user"
});


// Booking Schema
export const bookingSchema = z.object({
  booking_id: z.number().optional(), // This might be auto-generated
  user_id: z.number(),
  vehicle_id: z.number(),
  location_id: z.number(),
  booking_date: z.string(), // Assuming date is in string format; adjust if needed
  return_date: z.string(), // Assuming date is in string format; adjust if needed
  total_amount: z.string(), // Assuming total_amount is in string format; adjust if needed
  booking_status: z.enum(['Pending', 'Confirmed', 'Cancelled']).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});


