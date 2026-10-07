import { Router } from "express";
import type { AppConfig } from "../../config.js";
import { createRequireAuth } from "../../shared/require-auth.js";
import {
  createLoginController,
  getUserByIdController,
  listUsersController,
  registerController,
} from "./auth.controller.js";

export function createAuthRoutes(config: AppConfig) {
  const authRouter = Router();
  const requireAuthMiddleware = createRequireAuth(config);

  authRouter.post("/register", registerController);
  authRouter.post("/login", createLoginController(config));
  authRouter.get("/users", requireAuthMiddleware, listUsersController);
  authRouter.get("/users/:id", requireAuthMiddleware, getUserByIdController);

  return authRouter;
}
