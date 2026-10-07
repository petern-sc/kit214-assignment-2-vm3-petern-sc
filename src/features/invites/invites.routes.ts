import { Router } from "express";
import type { AppConfig } from "../../config.js";
import { createRequireAuth } from "../../shared/require-auth.js";
import { createInviteController } from "./invites.controller.js";

export function createInvitesRoutes(config: AppConfig) {
  const invitesRouter = Router();
  invitesRouter.post(
    "/invites",
    createRequireAuth(config),
    createInviteController,
  );

  return invitesRouter;
}
