// user.controller.ts
import { Context } from "hono";
import { getUsersService, getUserByIdService, createUserService, updateUserService, deleteUserService } from "./User.Service";
import { TIUser } from "../drizzle/schema";

// GET ALL USERS
export const getUsersController = async (c: Context) => {
    try {
        const users = await getUsersService();
        if (!users || users.length === 0) {
            return c.text("No users found", 404);
        }
        return c.json(users, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// GET USER BY ID
export const getUserByIdController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const user = await getUserByIdService(id);
        if (!user) {
            return c.text("User not found", 404);
        }
        return c.json(user, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// CREATE USER
export const createUserController = async (c: Context) => {
    try {
        const user: TIUser = await c.req.json();
        const result = await createUserService(user);

        return c.json({ message: result }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// UPDATE USER
export const updateUserController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const user: TIUser = await c.req.json();
        const result = await updateUserService(id, user);

        if (result === "User updated successfully") {
            return c.json({ message: result }, 200);
        } else {
            return c.text(result, 400); // Handle specific error case if needed
        }
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// DELETE USER
export const deleteUserController = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const result = await deleteUserService(id);

        if (result === "User deleted successfully") {
            return c.json({ message: result }, 200);
        } else {
            return c.text(result, 400); // Handle specific error case if needed
        }
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};