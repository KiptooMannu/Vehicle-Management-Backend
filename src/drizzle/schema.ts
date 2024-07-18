import { pgTable, serial, text, varchar, integer, boolean, date, pgEnum, decimal,timestamp } from "drizzle-orm/pg-core";
import { sql } from 'drizzle-orm';
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const bookingStatusEnum = pgEnum("booking_status", ["Pending", "Confirmed", "Cancelled"]);
export const paymentStatusEnum = pgEnum("payment_status", ["Pending", "Completed", "Failed"]);

// Users Table
export const UsersTable = pgTable("users", {
  user_id: serial("user_id").primaryKey(),
  full_name: text("full_name").notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  contact_phone: varchar("contact_phone", { length: 15 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  role: roleEnum("role").default("user"),
  created_at: date("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: date("updated_at").default(sql`CURRENT_TIMESTAMP`)
});

/// Authentication Table
export const AuthOnUsersTable = pgTable("auth", {
  user_id: integer("user_id")
    .references(() => UsersTable.user_id, { onDelete: "cascade" })
    .notNull(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  role: roleEnum("role").default("user"),
  password: varchar("password", { length: 255 }).notNull(),
  created_at: date("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: date("updated_at").default(sql`CURRENT_TIMESTAMP`)
});


export const VehicleSpecificationsTable = pgTable('vehicle_specifications', {
  vehicle_id: serial('vehicle_id').primaryKey(),
  manufacturer: varchar('manufacturer', { length: 255 }).notNull(),
  model: varchar('model', { length: 255 }).notNull(),
  year: integer('year').notNull(),
  fuel_type: varchar('fuel_type', { length: 50 }).notNull(),
  engine_capacity: varchar('engine_capacity', { length: 50 }),
  transmission: varchar('transmission', { length: 50 }),
  seating_capacity: integer('seating_capacity'),
  color: varchar('color', { length: 50 }),
  features: text('features'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});


// Vehicles Table
export const VehiclesTable = pgTable('vehicles', {
  vehicle_id: serial('vehicle_id').primaryKey(),
  vehicleSpec_id: integer('vehicleSpec_id').references(() => VehicleSpecificationsTable.vehicle_id, { onDelete: 'cascade' }),
  rental_rate: decimal('rental_rate').notNull(),
  availability: boolean('availability').default(true),
  //  vehicle_image: varchar('vehicle_image', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});


// Bookings Table
export const BookingsTable = pgTable("bookings", {
  booking_id: serial("booking_id").primaryKey(),
  user_id: integer("user_id").references(() => UsersTable.user_id).notNull(),
  vehicle_id: integer("vehicle_id").references(() => VehiclesTable.vehicle_id).notNull(),
  location_id: integer("location_id").references(() => LocationsTable.location_id).notNull(),
  booking_date: date("booking_date").notNull(),
  return_date: date("return_date").notNull(),
  total_amount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  booking_status: bookingStatusEnum("booking_status").default("Pending"),
  created_at: date("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: date("updated_at").default(sql`CURRENT_TIMESTAMP`)
});

// Payments Table
export const PaymentsTable = pgTable("payments", {
  payment_id: serial("payment_id").primaryKey(),
  booking_id: integer("booking_id").references(() => BookingsTable.booking_id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  payment_status: paymentStatusEnum("payment_status").default("Pending"),
  payment_date: date("payment_date").notNull(),
  payment_method: varchar("payment_method", { length: 50 }).notNull(),
  transaction_id: varchar("transaction_id", { length: 100 }).notNull(),
  created_at: date("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: date("updated_at").default(sql`CURRENT_TIMESTAMP`)
});

// Customer Support Tickets Table
export const CustomerSupportTicketsTable = pgTable("customer_support_tickets", {
  ticket_id: serial("ticket_id").primaryKey(),
  user_id: integer("user_id").references(() => UsersTable.user_id).notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  description: text("description").notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  created_at: date("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: date("updated_at").default(sql`CURRENT_TIMESTAMP`)
});

// Locations Table
export const LocationsTable = pgTable("locations", {
  location_id: serial("location_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  contact_phone: varchar("contact_phone", { length: 15 }).notNull(),
  created_at: date("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: date("updated_at").default(sql`CURRENT_TIMESTAMP`)
});

// Fleet Management Table
export const FleetManagementTable = pgTable("fleet_management", {
  fleet_id: serial("fleet_id").primaryKey(),
  vehicle_id: integer("vehicle_id").references(() => VehiclesTable.vehicle_id).notNull(),
  acquisition_date: date("acquisition_date").notNull(),
  depreciation_rate: decimal("depreciation_rate", { precision: 10, scale: 2 }).notNull(),
  current_value: decimal("current_value", { precision: 10, scale: 2 }).notNull(),
  maintenance_cost: decimal("maintenance_cost", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  created_at: date("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: date("updated_at").default(sql`CURRENT_TIMESTAMP`)
});





export const userAuthRelations = relations(UsersTable, ({ one }) => ({
  auth: one(AuthOnUsersTable, {
      fields: [UsersTable.user_id],
      references: [AuthOnUsersTable.user_id]
  })
}));

export const authRelations = relations(AuthOnUsersTable, ({ one }) => ({
  user: one(UsersTable, {
      fields: [AuthOnUsersTable.user_id],
      references: [UsersTable.user_id]
  })
}));

export const userBookingsRelations = relations(UsersTable, ({ many }) => ({
  bookings: many(BookingsTable),
  supportTickets: many(CustomerSupportTicketsTable),
}));

export const vehicleSpecRelations = relations(VehicleSpecificationsTable, ({ one, many }) => ({
  vehicles: many(VehiclesTable),
  fleet: one(FleetManagementTable, {
      fields: [VehicleSpecificationsTable.vehicle_id],
      references: [FleetManagementTable.vehicle_id]
  })
}));

export const vehicleRelations = relations(VehiclesTable, ({ one }) => ({
  vehicleSpec: one(VehicleSpecificationsTable, {
      fields: [VehiclesTable.vehicle_id],
      references: [VehicleSpecificationsTable.vehicle_id]
  }),
  bookings: one(BookingsTable, {
      fields: [VehiclesTable.vehicleSpec_id],
      references: [BookingsTable.vehicle_id]
  })
}));

export const bookingRelations = relations(BookingsTable, ({ one }) => ({
  user: one(UsersTable, {
      fields: [BookingsTable.user_id],
      references: [UsersTable.user_id]
  }),
  vehicle: one(VehiclesTable, {
      fields: [BookingsTable.vehicle_id],
      references: [VehiclesTable.vehicle_id]
  }),
  location: one(LocationsTable, {
      fields: [BookingsTable.location_id],
      references: [LocationsTable.location_id]
  }),
  payments: one(PaymentsTable, {
      fields: [BookingsTable.booking_id],
      references: [PaymentsTable.booking_id]
  })
}));

export const paymentRelations = relations(PaymentsTable, ({ one }) => ({
  booking: one(BookingsTable, {
      fields: [PaymentsTable.booking_id],
      references: [BookingsTable.booking_id]
  })
}));

export const customerSupportRelations = relations(CustomerSupportTicketsTable, ({ one }) => ({
  user: one(UsersTable, {
      fields: [CustomerSupportTicketsTable.user_id],
      references: [UsersTable.user_id]
  })
}));

export const locationRelations = relations(LocationsTable, ({ many }) => ({
  bookings: many(BookingsTable)
}));

export const fleetRelations = relations(FleetManagementTable, ({ one }) => ({
  vehicleSpec: one(VehicleSpecificationsTable, {
      fields: [FleetManagementTable.vehicle_id],
      references: [VehicleSpecificationsTable.vehicle_id]
  })
}));





// Define the types for insertion and selection
export type TIUser = typeof UsersTable.$inferInsert;
export type TSUser = typeof UsersTable.$inferSelect;
export type TIAuthOnUsers = typeof AuthOnUsersTable.$inferInsert;
export type TSAuth = typeof AuthOnUsersTable.$inferSelect;
export type TIVehicle = typeof VehiclesTable.$inferInsert;
export type TSVehicle = typeof VehiclesTable.$inferSelect;
export type TIVehicleSpecification = typeof VehicleSpecificationsTable.$inferInsert;
export type TSVehicleSpecification = typeof VehicleSpecificationsTable.$inferSelect;
export type TIBooking = typeof BookingsTable.$inferInsert;
export type TSBooking = typeof BookingsTable.$inferSelect;
export type TIPayment = typeof PaymentsTable.$inferInsert;
export type TSPayment = typeof PaymentsTable.$inferSelect;
export type TICustomerSupportTicket = typeof CustomerSupportTicketsTable.$inferInsert;
export type TSCustomerSupportTicket = typeof CustomerSupportTicketsTable.$inferSelect;
export type TILocation = typeof LocationsTable.$inferInsert;
export type TSLocation = typeof LocationsTable.$inferSelect;
export type TIFleetManagement = typeof FleetManagementTable.$inferInsert;
export type TSFleetManagement = typeof FleetManagementTable.$inferSelect;






