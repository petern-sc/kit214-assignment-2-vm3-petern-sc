import type { RequestHandler } from "express";
import {
  sendErrorResponse,
  sendValidationError,
} from "../../shared/error-response.js";
import { CreateInviteInputSchema } from "./models/invite.js";
import { createInvite, listBookingsForUser } from "./invites.repository.js";

export const createInviteController: RequestHandler = async (
  request,
  response,
) => {
  const input = CreateInviteInputSchema.safeParse(request.body);
  if (!input.success) {
    sendValidationError(response, "Invalid invite input", input.error);
    return;
  }

  const ownerUserId = response.locals.userId as string;
  const result = await createInvite(
    input.data.bookingId,
    input.data.invitedUserId,
    ownerUserId,
  );

  switch (result.kind) {
    case "not-found":
      sendErrorResponse(response, 404, "Booking or user not found");
      return;
    case "invited":
      response.status(200).json({ message: "User invited successfully" });
      return;
    default: {
      const unhandledResult: never = result;
      return unhandledResult;
    }
  }
};

export const listInvitesController: RequestHandler = async (
  _request,
  response,
) => {
  const userId = response.locals.userId as string;
  const bookings = await listBookingsForUser(userId);
  response.status(200).json(bookings);
};
