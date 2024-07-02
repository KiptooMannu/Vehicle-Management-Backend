import { db } from "../drizzle/db";
import { TICustomerSupportTicket, TSFleetManagement, CustomerSupportTicketsTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Get all customer support tickets
export const getAllCustomerSupportTicketsService = async (): Promise<TICustomerSupportTicket[] | null> => {
  const tickets = await db.query.CustomerSupportTicketsTable.findMany();
  return tickets;
};

// Get customer support ticket by ID
export const getCustomerSupportTicketByIdService = async (ticket_id: number): Promise<TICustomerSupportTicket | undefined> => {
  const ticket = await db.query.CustomerSupportTicketsTable.findFirst({
    where: eq(CustomerSupportTicketsTable.ticket_id, ticket_id),
  });
  return ticket;
};

// Create customer support ticket
export const createCustomerSupportTicketService = async (ticket: TICustomerSupportTicket): Promise<string> => {
  await db.insert(CustomerSupportTicketsTable).values(ticket);
  return "Customer support ticket created successfully";
};

// Update customer support ticket
export const updateCustomerSupportTicketService = async (ticket_id: number, ticket: TICustomerSupportTicket): Promise<string> => {
  await db.update(CustomerSupportTicketsTable).set(ticket).where(eq(CustomerSupportTicketsTable.ticket_id, ticket_id));
  return "Customer support ticket updated successfully";
};

// Delete customer support ticket
export const deleteCustomerSupportTicketService = async (ticket_id: number): Promise<string> => {
  await db.delete(CustomerSupportTicketsTable).where(eq(CustomerSupportTicketsTable.ticket_id, ticket_id));
  return "Customer support ticket deleted successfully";
};
