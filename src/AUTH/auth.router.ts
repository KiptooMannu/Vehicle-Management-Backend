import { Hono } from 'hono';
import { signup, loginUser } from './auth.controller';
import { zValidator } from '@hono/zod-validator';
import { authSchema } from '../validator'; // Assuming you have a validation schema

export const authRouter = new Hono();

// Register user - no authentication required
authRouter
    .post("signup", zValidator('json', authSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), signup);

// Login user - no authentication required
authRouter
    .post("login", zValidator('json', authSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), loginUser);

export default authRouter;
