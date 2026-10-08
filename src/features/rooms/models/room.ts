import { z } from "zod";

export const InterfaceTypeSchema = z.enum(["whiteboard", "custom"]);

export type InterfaceType = z.infer<typeof InterfaceTypeSchema>;

export const RoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  targetUrl: z.string(),
  interfaceType: InterfaceTypeSchema,
});

export type RoomRecord = {
  id: string;
  name: string;
  target_url: string;
  interface_type: InterfaceType;
};

export const CreateRoomInputSchema = RoomSchema.omit({ id: true });
export const UpdateRoomInputSchema = RoomSchema.omit({ id: true });

export type Room = z.infer<typeof RoomSchema>;
export type CreateRoomInput = z.infer<typeof CreateRoomInputSchema>;
