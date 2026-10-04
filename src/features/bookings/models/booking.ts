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
  });

export type CreateBookingInput = z.infer<typeof CreateBookingInputSchema>;

export const UpdateBookingInputSchema = z
  .object({
    name: z.string().min(3),
    startTime: z.iso.datetime(),
    endTime: z.iso.datetime(),
  });

export type UpdateBookingInput = z.infer<typeof UpdateBookingInputSchema>;

export type UpdateBookingRequest = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
};

export const GetBookingStatusInputSchema = z
  .object({
    roomId: z.uuid(),
  });

export type GetBookingStatusInput = z.infer<typeof GetBookingStatusInputSchema>;
