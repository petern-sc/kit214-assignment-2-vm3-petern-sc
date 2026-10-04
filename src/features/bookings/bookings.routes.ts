import { Router } from "express";
import type { AppConfig } from "../../config.js";
import { createRequireAuth } from "../../shared/require-auth.js";
import {
  createBookingController,
  getBookingByIdController,
  listBookingsController,
  updateBookingByIdController,
} from "./bookings.controller.js";

export function createBookingsRoutes(config: AppConfig) {
  const requireAuthMiddleware = createRequireAuth(config);

  const bookingsRouter = Router();
  bookingsRouter.post(
    "/bookings",
    requireAuthMiddleware,
    createBookingController,
  );
  bookingsRouter.get(
    "/bookings",
    requireAuthMiddleware,
    listBookingsController,
  );
  bookingsRouter.get("/bookings/:id", getBookingByIdController);
  bookingsRouter.put("/bookings/:id", requireAuthMiddleware, updateBookingByIdController);

  return bookingsRouter;
}
