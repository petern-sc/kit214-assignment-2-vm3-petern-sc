import { database } from "../../shared/database.js";
import type { BookingRecord } from "../bookings/models/booking.js";

type BookingInviteRecord = {
  booking_id: string;
  user_id: string;
};

export type CreateInviteResult = { kind: "not-found" } | { kind: "invited" };

export async function createInvite(
  bookingId: string,
  invitedUserId: string,
  ownerUserId: string,
): Promise<CreateInviteResult> {
  return database.transaction(async (trx): Promise<CreateInviteResult> => {
    const booking = await trx<BookingRecord>("bookings")
      .select("id", "user_id")
      .where({ id: bookingId })
      .first();

    if (!booking || booking.user_id !== ownerUserId) {
      return { kind: "not-found" };
    }

    const invitedUser = await trx<{ id: string }>("users")
      .select("id")
      .where({ id: invitedUserId })
      .first();

    if (!invitedUser) {
      return { kind: "not-found" };
    }

    if (invitedUserId !== booking.user_id) {
      await trx<BookingInviteRecord>("booking_invites")
        .insert({ booking_id: bookingId, user_id: invitedUserId })
        .onConflict(["booking_id", "user_id"])
        .ignore();
    }

    return { kind: "invited" };
  });
}
