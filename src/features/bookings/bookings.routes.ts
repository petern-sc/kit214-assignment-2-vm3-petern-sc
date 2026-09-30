import { Router } from "express";
import type { AppConfig } from "../../config.js";
import { createRequireAuth } from "../../shared/require-auth.js";
import { listBookingsController } from "./bookings.controller.js";

export function createBookingsRoutes(config: AppConfig) {
  const bookingsRouter = Router();
  bookingsRouter.get(
    "/bookings",
    createRequireAuth(config),
    listBookingsController,
  );

  return bookingsRouter;
}
