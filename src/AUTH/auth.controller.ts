import { Context } from "hono";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TSAuth } from "../drizzle/schema";
import { db } from "../drizzle/db";
import { UsersTable } from "../drizzle/schema";
import { createAuthUserService, userLoginService } from "./auth.service";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";; 

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
        console.error("Signup error:", error);
        return c.json({ error: "Failed to create user" }, 500);
    }
};

// Login user
export const loginUser = async (c: Context) => {
    try {
        const { username, password } = await c.req.json();

        // Check if user exists
        const user = await userLoginService(username);
        if (!user) {
            return c.json({ error: "Invalid credentials" }, 401);
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return c.json({ error: "Invalid credentials" }, 401);
        }

        // Generate token
        const token = jwt.sign(
            { user_id: user.user_id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return c.json({ message: "Login successful", token, user }, 200);

    } catch (error: any) {
        console.error("Login error:", error);
        return c.json({ error: "Failed to login" }, 500);
    }
};
