import { Hono } from "hono";
import "dotenv/config";
import { serve } from '@hono/node-server';
import { vehicleRouter } from './Vehicles/vehicle.router'; 
import { userRouter } from './Users/User.Router';
import { bookingRouter } from './Booking/Booking.Router';
import { vehicleSpecificationRouter } from './Vehiclespecification/Vehiclespecication.Router';
import { authRouter } from './AUTH/auth.router';
import paymentRouter from "./payment/payment.router";
import customerSupportTicketsRouter from "./customersupportTicket/support.Router";
import fleetManagementRouter from "./FleetManagement/Fmanagement.Router";
import locationRouter from "./Location/Location.Router";
import { bookingRouterr } from './FB/booking.router';
import { cors } from 'hono/cors';
import { vehicleSpecificationRouterr } from './vehicleCombined/v.router';

const app = new Hono().basePath("/api");

app.use(cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization']
}));


// Default route
app.get('/', (c) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Vehicle Management API</title>
        </head>
        <body>
            <h1>Welcome to Vehicle Management API</h1>
            <p>Manage your vehicles efficiently.</p>
        </body>
        </html>
    `;
    return c.html(htmlContent);
});

// Register routers
app.route("/", vehicleRouter);
app.route("/", authRouter);
app.route("/", bookingRouter);
app.route("/", vehicleSpecificationRouter);
app.route("/", userRouter);
app.route("/", customerSupportTicketsRouter);
app.route("/", paymentRouter);
app.route("/", locationRouter);
app.route("/", fleetManagementRouter);
app.route("/booking", bookingRouterr);
app.route("/", vehicleSpecificationRouterr);

console.log('Routes registered:', app.routes);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

// Start server
serve({
    fetch: app.fetch,
    port: 8000
});

console.log(`Server is running at port 8000`);
