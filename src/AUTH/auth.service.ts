// auth.service.ts

import { db } from "../drizzle/db";
import { AuthOnUsersTable, TSAuth } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const createAuthUserService = async (user: TSAuth) => {
    const createUser = await db.insert(AuthOnUsersTable).values(user).returning({ user_id: AuthOnUsersTable.user_id }).execute();
    return createUser.length > 0 ? createUser[0].user_id : null;
};

export const userLoginService = async (username: string) => {
    const user = await db.select({
        user_id: AuthOnUsersTable.user_id,
        username: AuthOnUsersTable.username,
        email: AuthOnUsersTable.email,
        password: AuthOnUsersTable.password, // Select password for verification
        role: AuthOnUsersTable.role
    }).from(AuthOnUsersTable).where(eq(AuthOnUsersTable.username, username)).execute();
    
    if (user.length > 0) {
        console.log("User found: ", user[0]);
        return user[0];
    } else {
        console.log("User not found");
        return null;
    }
};
