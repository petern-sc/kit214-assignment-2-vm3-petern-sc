import { Router } from "express";
import type { AppConfig } from "../../config.js";
import { createRequireAuth } from "../../shared/require-auth.js";
import {
  createBookingController,
  listBookingsController,
} from "./bookings.controller.js";

export function createBookingsRoutes(config: AppConfig) {
  const bookingsRouter = Router();
  bookingsRouter.post(
    "/bookings",
    createRequireAuth(config),
    createBookingController,
  );
  bookingsRouter.get(
    "/bookings",
    createRequireAuth(config),
    listBookingsController,
  );

  return bookingsRouter;
}
