import type { RequestHandler } from "express";
import { listBookings } from "./bookings.repository.js";

export const listBookingsController: RequestHandler = async (
  _request,
  response,
) => {
  const bookings = await listBookings();
  response.status(200).json(bookings);
};
