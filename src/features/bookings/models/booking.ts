import { z } from "zod";

export type Booking = {
  id: string;
  name: string;
  roomId: string;
  startTime: string;
  endTime: string;
  userId: string;
  invitedUserIds: string[];
};

export type BookingRecord = {
  id: string;
  name: string;
  room_id: string;
  start_time: Date;
  end_time: Date;
  user_id: string;
};

export const CreateBookingInputSchema = z
  .object({
    name: z.string().min(3),
    roomId: z.uuid(),
    startTime: z.iso.datetime(),
    endTime: z.iso.datetime(),
  })
  .refine(
    ({ startTime, endTime }) => {
      return Date.parse(endTime) > Date.parse(startTime);
    },
    { message: "End time must be after start time", path: ["endTime"] },
  );

export const UpdateBookingInputSchema = z
  .object({
    name: z.string().min(3),
    startTime: z.iso.datetime(),
    endTime: z.iso.datetime(),
  })
  .refine(
    ({ startTime, endTime }) => {
      return Date.parse(endTime) > Date.parse(startTime);
    },
    { message: "End time must be after start time", path: ["endTime"] },
  );

export type UpdateBookingRequest = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
};

export const GetBookingStatusInputSchema = z.object({
  roomId: z.uuid(),
});
