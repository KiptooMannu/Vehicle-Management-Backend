// user.service.ts
import { db } from "../drizzle/db";
import { TIUser, TSUser, UsersTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// GET ALL USERS
export const getUsersService = async (): Promise<TSUser[] | null> => {
    const users = await db.query.UsersTable.findMany();
    return users;
};

// GET USER BY ID
export const getUserByIdService = async (id: number): Promise<TSUser | undefined> => {
    const user = await db.query.UsersTable.findFirst({
        where: eq(UsersTable.user_id, id)
    });
    return user;
};

// CREATE USER
export const createUserService = async (user: TIUser): Promise<string> => {
    await db.insert(UsersTable).values(user);
    return "User created successfully";
};

// UPDATE USER
export const updateUserService = async (id: number, user: TIUser): Promise<string> => {
    await db.update(UsersTable).set(user).where(eq(UsersTable.user_id, id));
    return "User updated successfully";
};

// DELETE USER
export const deleteUserService = async (id: number): Promise<string> => {
    await db.delete(UsersTable).where(eq(UsersTable.user_id, id));
    return "User deleted successfully";
};
