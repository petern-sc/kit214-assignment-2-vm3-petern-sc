import { database } from "../../shared/database.js";
import type { Knex } from "knex";
import type { RoomRecord } from "../rooms/models/room.js";
import { toBooking, toBookingRecord } from "./booking-mapper.js";
import type {
  Booking,
  BookingRecord,
  UpdateBookingRequest,
} from "./models/booking.js";

type BookingInviteRecord = {
  booking_id: string;
  user_id: string;
};

export async function listBookings(): Promise<Booking[]> {
  const records = await database<BookingRecord>("bookings").select(
    "id",
    "name",
    "room_id",
    "start_time",
    "end_time",
    "user_id",
  );

  return includeInvitedUserIds(records);
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const record = await database<BookingRecord>("bookings")
    .select("id", "name", "room_id", "start_time", "end_time", "user_id")
    .where({ id })
    .first();

  if (!record) return null;

  return (await includeInvitedUserIds([record]))[0] ?? null;
}

export async function deleteBooking(id: string): Promise<boolean> {
  const deletedCount = await database<BookingRecord>("bookings")
    .where({ id })
    .delete();

  return deletedCount > 0;
}

export type UpdateBookingResult =
  | { kind: "booking-not-found" }
  | { kind: "overlap-conflict" }
  | { kind: "updated"; booking: Booking };

export async function updateBooking(
  booking: UpdateBookingRequest,
): Promise<UpdateBookingResult> {
  return database.transaction(async (trx): Promise<UpdateBookingResult> => {
    const existingBooking = await trx<BookingRecord>("bookings")
      .select("id", "room_id", "start_time", "end_time", "user_id")
      .where({ id: booking.id })
      .first();

    if (!existingBooking) {
      return { kind: "booking-not-found" };
    }

    const isOverlap = await hasBookingOverlap(
      trx,
      existingBooking.room_id,
      new Date(booking.startTime),
      new Date(booking.endTime),
    );

    if (isOverlap) {
      return { kind: "overlap-conflict" };
    }

    await trx<BookingRecord>("bookings")
      .where({ id: booking.id })
      .update({
        name: booking.name,
        start_time: new Date(booking.startTime),
        end_time: new Date(booking.endTime),
      });

    const updatedBooking = await trx<BookingRecord>("bookings")
      .select("id", "name", "room_id", "start_time", "end_time", "user_id")
      .where({ id: booking.id })
      .first();
    if (updatedBooking) {
      const [bookingWithInvitees] = await includeInvitedUserIds(
        [updatedBooking],
        trx,
      );
      return { kind: "updated", booking: bookingWithInvitees };
    } else {
      throw new Error("Booking not found after update. This should not happen");
    }
  });
}

export type CreateBookingResult =
  | { kind: "room-not-found" }
  | { kind: "overlap-conflict" }
  | { kind: "created"; booking: Booking };

export async function createBooking(
  booking: Booking,
): Promise<CreateBookingResult> {
  return database.transaction(async (trx): Promise<CreateBookingResult> => {
    const room = await trx<RoomRecord>("rooms")
      .select("id")
      .where({ id: booking.roomId })
      .first();

    if (!room) return { kind: "room-not-found" };

    // Transactions dont block concurrent overlapping
    // bookings but I'm leaving it out of scope for the assignment to keep things simple.
    const isOverlap = await hasBookingOverlap(
      trx,
      booking.roomId,
      new Date(booking.startTime),
      new Date(booking.endTime),
    );

    if (isOverlap) {
      return { kind: "overlap-conflict" };
    }

    await insertBooking(trx, booking);
    return { kind: "created", booking };
  });
}

async function insertBooking(
  trx: Knex.Transaction,
  booking: Booking,
): Promise<void> {
  await trx<BookingRecord>("bookings").insert(toBookingRecord(booking));
}

export async function hasBookingOverlap(
  trx: Knex.Transaction,
  roomId: string,
  startTime: Date,
  endTime: Date,
): Promise<boolean> {
  // Reference: https://stackoverflow.com/questions/25549765/find-booking-overlaps-to-check-dates-availability
  const overlappingBooking = await trx<BookingRecord>("bookings")
    .select("id")
    .where({ room_id: roomId })
    .where("start_time", "<", endTime)
    .where("end_time", ">", startTime)
    .first();

  return overlappingBooking !== undefined;
}

export async function getActiveBookingsForRoom(
  roomId: string,
  currentTime: Date,
): Promise<Booking[]> {
  const records = await database<BookingRecord>("bookings")
    .select("id", "name", "room_id", "start_time", "end_time", "user_id")
    .where({ room_id: roomId })
    .andWhere("start_time", "<=", currentTime)
    .andWhere("end_time", ">=", currentTime);

  return includeInvitedUserIds(records);
}

async function includeInvitedUserIds(
  records: BookingRecord[],
  connection: Knex | Knex.Transaction = database,
): Promise<Booking[]> {
  if (records.length === 0) return [];

  const invitations = await connection<BookingInviteRecord>("booking_invites")
    .select("booking_id", "user_id")
    .whereIn(
      "booking_id",
      records.map((record) => record.id),
    );

  const invitedUserIds = new Map(
    records.map((record) => [record.id, new Set([record.user_id])]),
  );

  for (const invitation of invitations) {
    invitedUserIds.get(invitation.booking_id)?.add(invitation.user_id);
  }

  return records.map((record) => ({
    ...toBooking(record),
    invitedUserIds: [...(invitedUserIds.get(record.id) ?? [])],
  }));
}
