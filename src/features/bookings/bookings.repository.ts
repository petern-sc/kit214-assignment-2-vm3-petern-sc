import { database } from "../../shared/database.js";
import { toBooking } from "./booking-mapper.js";
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
