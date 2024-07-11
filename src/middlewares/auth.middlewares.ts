import { verify } from "hono/jwt";
import { Context, Next } from "hono";

interface DecodedToken {
    role: string;
    // Add other properties if needed
}

interface HonoRequest<T> {
    user?: T;
    // Add other properties if needed
}

// AUTHENTICATION MIDDLEWARE
export const verifyToken = async (token: string, secret: string): Promise<DecodedToken | null> => {
    try {
        const decoded = await verify(token, secret) as unknown as DecodedToken;
        console.log("Decoded Token:", decoded);  // Debugging statement
        return decoded;
    } catch (error) {
        console.error("Token verification error:", error);  // Debugging statement
        return null;
    }
}

// AUTHORIZATION MIDDLEWARE
export const authMiddleware = async (c: Context & { req: HonoRequest<DecodedToken> }, next: Next, requiredRole: string) => {
    const token = c.req.header("Authorization");

    if (!token) {
        console.error("Token is required");  // Debugging statement
        return c.json({ error: "Token is required" }, 401);
    }

    const decoded = await verifyToken(token.replace('Bearer ', ''), process.env.JWT_SECRET as string);

    if (!decoded) {
        console.error("Invalid token");  // Debugging statement
        return c.json({ error: "Invalid token" }, 401);
    }

    if (requiredRole === "both") {
        if (decoded.role === "admin" || decoded.role === "user") {
            c.req.user = decoded;
            return next();
        }
    } else if (decoded.role === requiredRole) {
        c.req.user = decoded;
        return next();
    }

    console.error("Unauthorized access attempt");  // Debugging statement
    return c.json({ error: "Unauthorized" }, 401);
}

export const adminRoleAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "admin");
export const userRoleAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "user");
export const bothRoleAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "both");
