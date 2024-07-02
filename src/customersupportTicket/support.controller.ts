import { Context } from "hono";
import {
  getAllCustomerSupportTicketsService,
  getCustomerSupportTicketByIdService,
  createCustomerSupportTicketService,
  updateCustomerSupportTicketService,
  deleteCustomerSupportTicketService,
} from "./support.service";

// Get all customer support tickets
export const getAllCustomerSupportTicketsController = async (c: Context) => {
  try {
    const tickets = await getAllCustomerSupportTicketsService();
    if (!tickets || tickets.length === 0) {
      return c.text("No customer support tickets found", 404);
    }
    return c.json(tickets, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

// Get customer support ticket by ID
export const getCustomerSupportTicketByIdController = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.text("Invalid id", 400);
    }
    const ticket = await getCustomerSupportTicketByIdService(id);
    if (!ticket) {
      return c.text("Customer support ticket not found", 404);
    }
    return c.json(ticket, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

// Create customer support ticket
export const createCustomerSupportTicketController = async (c: Context) => {
  try {
    const ticket = await c.req.json();
    const newTicket = await createCustomerSupportTicketService(ticket);

    if (!newTicket) {
      return c.text("Customer support ticket not created", 400);
    }
    return c.json({ message: "Customer support ticket created successfully" }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

// Update customer support ticket
export const updateCustomerSupportTicketController = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.text("Invalid id", 400);
    }
    const ticket = await c.req.json();
    const updatedTicket = await updateCustomerSupportTicketService(id, ticket);

    if (!updatedTicket) {
      return c.text("Customer support ticket not updated", 400);
    }
    return c.json({ message: "Customer support ticket updated successfully" }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};

// Delete customer support ticket
export const deleteCustomerSupportTicketController = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.text("Invalid id", 400);
    }
    const deletedTicket = await deleteCustomerSupportTicketService(id);

    if (!deletedTicket) {
      return c.text("Customer support ticket not deleted", 400);
    }
    return c.json({ message: "Customer support ticket deleted successfully" }, 200);
  } catch (error: any) {
    return c.json({ error: error?.message }, 500);
  }
};
