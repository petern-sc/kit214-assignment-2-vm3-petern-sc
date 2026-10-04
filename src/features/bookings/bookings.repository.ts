import { database } from "../../shared/database.js";
import type { Knex } from "knex";
import type { RoomRecord } from "../rooms/models/room.js";
import { toBooking, toBookingRecord } from "./booking-mapper.js";
import type { Booking, BookingRecord } from "./models/booking.js";

export async function listBookings(): Promise<Booking[]> {
  const records = await database<BookingRecord>("bookings").select(
    "id",
    "name",
    "room_id",
    "start_time",
    "end_time",
    "user_id",
  );

  if (records.length === 0) return [];

  return records.map(toBooking);
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const record = await database<BookingRecord>("bookings")
    .select("id", "name", "room_id", "start_time", "end_time", "user_id")
    .where({ id })
    .first();

  return record ? toBooking(record) : null;
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
