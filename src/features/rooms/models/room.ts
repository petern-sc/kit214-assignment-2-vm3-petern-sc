import { z } from "zod";

export const RoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  targetUrl: z.string(),
  interfaceType: z.string(),
});

export const CreateRoomInputSchema = RoomSchema.omit({ id: true });

export type Room = z.infer<typeof RoomSchema>;
export type CreateRoomInput = z.infer<typeof CreateRoomInputSchema>;
