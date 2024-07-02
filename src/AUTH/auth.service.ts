import { TIAuthOnUsers, AuthOnUsersTable } from "../drizzle/schema";
import { db } from "../drizzle/db";
import { sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import { sign } from "hono/jwt";

// Register user and generate token
export const createAuthUserService = async (user: TIAuthOnUsers): Promise<string> => {
    try {
        // Check if a user with the same username already exists
        const existingUser = await db.query.AuthOnUsersTable.findFirst({
            where: sql`${AuthOnUsersTable.username} = ${user.username}`,
        });

        if (existingUser) {
            throw new Error("User with this username already exists");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;

        // Insert the new user
        await db.insert(AuthOnUsersTable).values(user);

        return "User created successfully";
    } catch (error: any) { // Specify 'any' type for error
        throw new Error(error.message);
    }
};

// Login user and return user details
export const userLoginService = async (user: TIAuthOnUsers): Promise<{ username: string; role: string; token: string } | null> => {
    try {
        const { username, password } = user;
        // Find user by username
        const dbUser = await db.query.AuthOnUsersTable.findFirst({
            columns: {
                user_id: true,
                username: true,
                role: true,
                password: true,
            },
            where: sql`${AuthOnUsersTable.username} = ${username}`,
        });

        if (!dbUser) {
            return null; // User not found
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, dbUser.password);
        if (!passwordMatch) {
            return null; // Invalid password
        }

      // Generate JWT token
      const token = await generateToken(dbUser.user_id);

      // Check if dbUser.role is null and handle accordingly
      const role = dbUser.role || ""; // If dbUser.role is null, set it to an empty string

      return { username: dbUser.username, role, token };
  } catch (error: any) {
      throw new Error(error.message);
  }
};

// Helper function to generate JWT token
const generateToken = async (userId: number): Promise<string> => {
    try {
        const payload = {
            sub: userId.toString(),
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3), // Token expires in 3 hours
        };
        const secret = process.env.JWT_SECRET as string;
        const token = await sign(payload, secret); // Generate JWT token
        return token;
    } catch (error: any) { // Specify 'any' type for error
        throw new Error(error.message);
    }
};
