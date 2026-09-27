import { Router } from "express";
import type { AppConfig } from "../../config.js";
import {
  createLoginController,
  registerController,
} from "./auth.controller.js";

export function createAuthRoutes(config: AppConfig) {
  const authRouter = Router();

  authRouter.post("/register", registerController);
  authRouter.post("/login", createLoginController(config));

  return authRouter;
}
