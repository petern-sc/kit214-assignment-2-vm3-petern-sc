import type { RequestHandler } from "express";
import { CreateInviteInputSchema } from "./models/invite.js";
import { createInvite } from "./invites.repository.js";

export const createInviteController: RequestHandler = async (
  request,
  response,
) => {
  const input = CreateInviteInputSchema.safeParse(request.body);
  if (!input.success) {
    response.status(400).json({ error: "Invalid invite input" });
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
      response.status(404).json({ error: "Booking or user not found" });
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
