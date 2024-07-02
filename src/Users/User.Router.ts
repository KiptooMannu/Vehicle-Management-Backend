// user.router.ts
import { Hono } from 'hono';
import { getUsersController, getUserByIdController, createUserController, updateUserController, deleteUserController } from './User.Controller';
import { zValidator } from '@hono/zod-validator';
import { userSchema } from '../validator';
import { adminRoleAuth, userRoleAuth, bothRoleAuth } from '../middlewares/auth.middlewares';

export const userRouter = new Hono();

// GET ALL USERS - accessible by users and admins
userRouter
    .get("users", userRoleAuth, getUsersController)
    .post("users",/* adminRoleAuth,*/ zValidator('json', userSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), createUserController);

// GET USER BY ID - accessible by both users and admins
userRouter
    .get("users/:id", bothRoleAuth, getUserByIdController)
    .put("users/:id", /*adminRoleAuth,*/ zValidator('json', userSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), updateUserController)
    // Restrict DELETE route to admins only
    .delete("users/:id",/* adminRoleAuth,*/ deleteUserController);

export default userRouter;
