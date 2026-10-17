import { z } from "zod";

export const InterfaceTypeSchema = z.enum(["whiteboard", "custom"]);

export type InterfaceType = z.infer<typeof InterfaceTypeSchema>;

export const RoomSchema = z
  .object({
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

const roomNameRule = (room: { name: string }) => room.name.length > 3;
const roomNameMessage = {
  message: "Room name must be longer than 3 characters",
};

export const CreateRoomInputSchema = RoomSchema.omit({ id: true }).refine(
  roomNameRule,
  roomNameMessage,
);
export const UpdateRoomInputSchema = RoomSchema.omit({ id: true }).refine(
  roomNameRule,
  roomNameMessage,
);

export type Room = z.infer<typeof RoomSchema>;
