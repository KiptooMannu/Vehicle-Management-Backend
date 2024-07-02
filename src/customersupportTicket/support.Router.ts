import { Hono } from 'hono';
import {
  getAllCustomerSupportTicketsController,
  getCustomerSupportTicketByIdController,
  createCustomerSupportTicketController,
  updateCustomerSupportTicketController,
  deleteCustomerSupportTicketController,
} from './support.controller';

export const customerSupportTicketsRouter = new Hono();

customerSupportTicketsRouter
  .get("customer-support-tickets", getAllCustomerSupportTicketsController)
  .get("customer-support-tickets/:id", getCustomerSupportTicketByIdController)
  .post("customer-support-tickets", createCustomerSupportTicketController)
  .put("customer-support-tickets/:id", updateCustomerSupportTicketController)
  .delete("customer-support-tickets/:id", deleteCustomerSupportTicketController);

export default customerSupportTicketsRouter;
