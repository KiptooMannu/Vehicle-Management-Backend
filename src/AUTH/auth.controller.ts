// auth.controller.ts

import { Context } from "hono";
import { createAuthUserService, userLoginService } from "./auth.service";
import bcrypt from "bcrypt";
import { TSAuth } from "../drizzle/schema";
import { db } from "../drizzle/db"; // Ensure db is imported
import { UsersTable } from "../drizzle/schema"; // Ensure UsersTable is imported



// Register user
export const signup = async (c: Context) => {
    try {
        const { full_name, email, contact_phone, address, username, password } = await c.req.json();

        // Check if user already exists
        const existingUser = await userLoginService(username);
        if (existingUser) {
            return c.json({ error: "User already exists" }, 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed Password: ", hashedPassword);

        // Insert into UsersTable
        const newUser = await db.insert(UsersTable).values({
            full_name,
            email,
            contact_phone,
            address,
        }).returning({ user_id: UsersTable.user_id }).execute();

        if (newUser.length === 0) {
            return c.json({ error: "Failed to create user" }, 400);
        }

        const userId = newUser[0].user_id;

        // Create user in AuthOnUsersTable
        const createUser = await createAuthUserService({
            user_id: userId,
            username,
            email,
            password: hashedPassword,
        } as TSAuth);

        if (!createUser) {
            return c.json({ error: "User not created" }, 400);
        }

        return c.json({ message: "User created successfully" }, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
};


// auth.controller.ts

export const loginUser = async (c: Context) => {
    try {
        const { username, password } = await c.req.json();

        // Check if user exists and credentials match
        const user = await userLoginService(username);
        if (!user) {
            return c.json({ error: "Invalid credentials" }, 401);
        }

        console.log("User password from DB: ", user.password);
        console.log("Entered password: ", password);

        const validPassword = await bcrypt.compare(password, user.password);
        console.log("Password comparison result: ", validPassword);

        if (!validPassword) {
            return c.json({ error: "Invalid credentials" }, 401);
        }

        return c.json({ message: "Login successful", user }, 200);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
};
