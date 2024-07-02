import { Hono } from "hono";
import "dotenv/config";
import { serve } from '@hono/node-server';
import { vehicleRouter } from './Vehicles/vehicle.router'; 
import {userRouter}  from './Users/User.Router'
import {bookingRouter} from './Booking/Booking.Router'
import {vehicleSpecificationRouter} from './Vehiclespecication/Vehiclespecication.Router'
import {authRouter} from './AUTH/auth.router'
const app = new Hono().basePath("/api");

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

// Register vehicle router
app.route("/", vehicleRouter);
app.route("/", authRouter);
app.route("/", bookingRouter);
app.route("/", vehicleSpecificationRouter);
app.route("/", userRouter);




console.log('Routes registered:', app.routes); 


// Start server
serve({
    fetch: app.fetch,
    port: 8000
});

console.log(`Server is running at port 8000`);
