DO $$ BEGIN
 CREATE TYPE "public"."booking_status" AS ENUM('Pending', 'Confirmed', 'Cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."payment_status" AS ENUM('Pending', 'Completed', 'Failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('user', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth" (
	"user_id" integer NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"role" "role" DEFAULT 'user',
	"password" varchar(255) NOT NULL,
	"created_at" date DEFAULT CURRENT_TIMESTAMP,
	"updated_at" date DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "auth_username_unique" UNIQUE("username"),
	CONSTRAINT "auth_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookings" (
	"booking_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"vehicle_id" integer NOT NULL,
	"location_id" integer NOT NULL,
	"booking_date" date NOT NULL,
	"return_date" date NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"booking_status" "booking_status" DEFAULT 'Pending',
	"created_at" date DEFAULT CURRENT_TIMESTAMP,
	"updated_at" date DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_support_tickets" (
	"ticket_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"subject" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"status" varchar(50) NOT NULL,
	"created_at" date DEFAULT CURRENT_TIMESTAMP,
	"updated_at" date DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fleet_management" (
	"fleet_id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" integer NOT NULL,
	"acquisition_date" date NOT NULL,
	"depreciation_rate" numeric(10, 2) NOT NULL,
	"current_value" numeric(10, 2) NOT NULL,
	"maintenance_cost" numeric(10, 2) NOT NULL,
	"status" varchar(50) NOT NULL,
	"created_at" date DEFAULT CURRENT_TIMESTAMP,
	"updated_at" date DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "locations" (
	"location_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"address" varchar(255) NOT NULL,
	"contact_phone" varchar(15) NOT NULL,
	"created_at" date DEFAULT CURRENT_TIMESTAMP,
	"updated_at" date DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"payment_id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_status" "payment_status" DEFAULT 'Pending',
	"payment_date" date NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"transaction_id" varchar(100) NOT NULL,
	"created_at" date DEFAULT CURRENT_TIMESTAMP,
	"updated_at" date DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" varchar(100) NOT NULL,
	"contact_phone" varchar(15) NOT NULL,
	"address" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'user',
	"created_at" date DEFAULT CURRENT_TIMESTAMP,
	"updated_at" date DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicle_specifications" (
	"vehicle_id" serial PRIMARY KEY NOT NULL,
	"manufacturer" varchar(100) NOT NULL,
	"model" varchar(100) NOT NULL,
	"year" integer NOT NULL,
	"fuel_type" varchar(50) NOT NULL,
	"engine_capacity" varchar(50) NOT NULL,
	"transmission" varchar(50) NOT NULL,
	"seating_capacity" integer NOT NULL,
	"color" varchar(50) NOT NULL,
	"features" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicles" (
	"vehicle_id" serial PRIMARY KEY NOT NULL,
	"vehicleSpec_id" integer,
	"rental_rate" numeric(10, 2) NOT NULL,
	"availability" boolean DEFAULT true,
	"created_at" date DEFAULT CURRENT_TIMESTAMP,
	"updated_at" date DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth" ADD CONSTRAINT "auth_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_vehicle_id_vehicles_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("vehicle_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_location_id_locations_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("location_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_support_tickets" ADD CONSTRAINT "customer_support_tickets_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fleet_management" ADD CONSTRAINT "fleet_management_vehicle_id_vehicles_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("vehicle_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_bookings_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("booking_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_vehicleSpec_id_vehicle_specifications_vehicle_id_fk" FOREIGN KEY ("vehicleSpec_id") REFERENCES "public"."vehicle_specifications"("vehicle_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
