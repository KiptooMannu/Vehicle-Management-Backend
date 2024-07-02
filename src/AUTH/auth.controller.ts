// auth.controller.ts

import { Context } from "hono";
import { createAuthUserService, userLoginService } from "./auth.service";
import bcrypt from "bcrypt";
import { TSAuth } from "../drizzle/schema";

// Register user
export const signup = async (c: Context) => {
    try {
        const user = await c.req.json();

        // Check if user already exists
        const existingUser = await userLoginService({ username: user.username } as TSAuth);
        if (existingUser) {
            return c.json({ error: "User already exists" }, 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;

        // Create user
        const createUser = await createAuthUserService(user);
        if (typeof createUser !== 'string') {
            return c.json({ error: "User not created" }, 400);
        }

        return c.json({ message: "User created successfully" }, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
};

// Login user
export const loginUser = async (c: Context) => {
    try {
        const credentials = await c.req.json();

        // Check if user exists and credentials match
        const user = await userLoginService(credentials);
        if (!user) {
            return c.json({ error: "Invalid credentials" }, 401);
        }

        return c.json({ message: "Login successful", user }, 200);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
};
