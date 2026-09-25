import { database } from "../../shared/database.js";
import type { Room } from "./models/room.js";

export async function insertRoom(room: Room): Promise<Room> {
  await database("rooms").insert({
    id: room.id,
    name: room.name,
    target_url: room.targetUrl,
    interface_type: room.interfaceType,
  });

  return room;
}
