import { database } from "../../shared/database.js";
import type { Room, RoomRecord } from "./models/room.js";

function toRoomRecord(room: Room): RoomRecord {
  return {
    id: room.id,
    name: room.name,
    target_url: room.targetUrl,
    interface_type: room.interfaceType,
  };
}

function toRoom(record: RoomRecord): Room {
  return {
    id: record.id,
    name: record.name,
    targetUrl: record.target_url,
    interfaceType: record.interface_type,
  };
}

export async function insertRoom(room: Room): Promise<Room> {
  await database<RoomRecord>("rooms").insert(toRoomRecord(room));

  return room;
}

export async function listRooms(): Promise<Room[]> {
  const rows = await database<RoomRecord>("rooms").select(
    "id",
    "name",
    "target_url",
    "interface_type",
  );

  return rows.map(toRoom);
}
