import type { Booking, BookingRecord } from "./models/booking.js";

export function toBooking(record: BookingRecord): Booking {
  return {
    id: record.id,
    name: record.name,
    roomId: record.room_id,
    startTime: record.start_time.toISOString(),
    endTime: record.end_time.toISOString(),
    userId: record.user_id,
    invitedUserIds: [record.user_id],
  };
}

export function toBookingRecord(booking: Booking): BookingRecord {
  return {
    id: booking.id,
    name: booking.name,
    room_id: booking.roomId,
    start_time: new Date(booking.startTime),
    end_time: new Date(booking.endTime),
    user_id: booking.userId,
  };
}
