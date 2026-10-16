import type { RequestHandler } from "express";
import { randomUUID } from "node:crypto";
import {
  CreateBookingInputSchema,
  GetBookingStatusInputSchema,
  UpdateBookingInputSchema,
  UpdateBookingRequest,
  type Booking,
} from "./models/booking.js";
import {
  createBooking,
  deleteBooking,
  getActiveBookingIdForRoom,
  getBookingById,
  listBookings,
  updateBooking,
} from "./bookings.repository.js";
import {
  sendErrorResponse,
  sendValidationError,
} from "../../shared/error-response.js";

export const listBookingsController: RequestHandler = async (
  _request,
  response,
) => {
  const bookings = await listBookings();
  response.status(200).json(bookings);
};

export const getBookingByIdController: RequestHandler<{ id: string }> = async (
  request,
  response,
) => {
  const booking = await getBookingById(request.params.id);
  if (!booking) {
    sendErrorResponse(response, 404, "Booking not found");
    return;
  }

  response.status(200).json(booking);
};

export const deleteBookingByIdController: RequestHandler<{
  id: string;
}> = async (request, response) => {
  const booking = await getBookingById(request.params.id);
  if (!booking) {
    sendErrorResponse(response, 404, "Booking not found");
    return;
  }

  if (booking.userId !== response.locals.userId) {
    sendErrorResponse(response, 403, "User is not allowed to delete this booking");
    return;
  }

  await deleteBooking(request.params.id);
  response.status(204).end();
};

export const createBookingController: RequestHandler = async (
  request,
  response,
) => {
  const result = CreateBookingInputSchema.safeParse(request.body);
  if (!result.success) {
    sendValidationError(response, "Invalid booking input", result.error);
    return;
  }

  const userId = response.locals.userId as string;
  const booking: Booking = {
    id: randomUUID(),
    ...result.data,
    userId,
    invitedUserIds: [userId],
  };

  const createResult = await createBooking(booking);
  switch (createResult.kind) {
    case "room-not-found":
      sendErrorResponse(response, 404, "Room not found");
      return;
    case "overlap-conflict":
      sendErrorResponse(response, 409, "Booking overlaps an existing booking");
      return;
    case "created":
      response.status(201).json(createResult.booking);
      return;
    default: {
      const unhandledResult: never = createResult;
      return unhandledResult;
    }
  }
};

export const updateBookingByIdController: RequestHandler<{
  id: string;
}> = async (request, response) => {
  const existingBooking = await getBookingById(request.params.id);
  if (!existingBooking) {
    sendErrorResponse(response, 404, "Booking not found");
    return;
  }

  const result = UpdateBookingInputSchema.safeParse(request.body);
  if (!result.success) {
    sendValidationError(response, "Invalid booking input", result.error);
    return;
  }

  const updateBookingRequest: UpdateBookingRequest = {
    id: request.params.id,
    ...result.data,
  };

  const createResult = await updateBooking(updateBookingRequest);
  switch (createResult.kind) {
    case "booking-not-found":
      sendErrorResponse(response, 404, "Booking not found");
      return;
    case "overlap-conflict":
      sendErrorResponse(response, 409, "Booking overlaps an existing booking");
      return;
    case "updated":
      response.status(200).json(createResult.booking);
      return;
    default: {
      const unhandledResult: never = createResult;
      return unhandledResult;
    }
  }
};

export const getBookingStatusController: RequestHandler = async (
  request,
  response,
) => {
  const result = GetBookingStatusInputSchema.safeParse(request.body);
  if (!result.success) {
    sendValidationError(response, "Invalid booking status input", result.error);
    return;
  }

  const now = new Date();

  const activeBookingId = await getActiveBookingIdForRoom(
    result.data.roomId,
    now,
  );

  response.status(200).json({ bookingId: activeBookingId });
};
