import { database } from "../../shared/database.js";
import { isDuplicateKeyError } from "../../shared/database-errors.js";
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

export type InsertRoomResult =
  { kind: "created"; room: Room } | { kind: "duplicate-room-name" };

export async function insertRoom(room: Room): Promise<InsertRoomResult> {
  try {
    await database<RoomRecord>("rooms").insert(toRoomRecord(room));
    return { kind: "created", room };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return { kind: "duplicate-room-name" };
    }

    throw error;
  }
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

export async function getRoomById(id: string): Promise<Room | null> {
  const record = await database<RoomRecord>("rooms")
    .select("id", "name", "target_url", "interface_type")
    .where({ id })
    .first();

  return record ? toRoom(record) : null;
}

export type UpdateRoomResult =
  | { kind: "room-not-found" }
  | { kind: "duplicate-room-name" }
  | { kind: "updated"; room: Room };

export async function updateRoom(room: Room): Promise<UpdateRoomResult> {
  const record = toRoomRecord(room);
  const { id } = record;

  return database.transaction(async (trx) => {
    try {
      await trx<RoomRecord>("rooms").where({ id }).update(record);
      const updatedRecord = await trx<RoomRecord>("rooms")
        .select("id", "name", "target_url", "interface_type")
        .where({ id })
        .first();

      return updatedRecord
        ? { kind: "updated", room: toRoom(record) }
        : { kind: "room-not-found" };
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        return { kind: "duplicate-room-name" };
      }
      throw error;
    }
  });
}

export async function deleteRoom(id: string): Promise<boolean> {
  const deletedCount = await database<RoomRecord>("rooms")
    .where({ id })
    .delete();

  return deletedCount > 0;
}
