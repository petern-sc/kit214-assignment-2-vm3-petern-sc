import type { RequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { insertRoom, listRooms } from "./room.repository.js";
import { CreateRoomInputSchema, type CreateRoomInput, type Room } from "./models/room.js";


export const listRoomsController: RequestHandler = async (_request, response) => {
  const rooms = await listRooms();
  response.status(200).json(rooms);
};


async function createRoom(input: CreateRoomInput): Promise<Room> {
  const room: Room = { id: randomUUID(), ...input };
  return insertRoom(room);
}

export const createRoomController: RequestHandler = async (request, response) => {
  const result = CreateRoomInputSchema.safeParse(request.body);
  if (!result.success) {
    response.status(400).json({ error: result.error.issues });
    return;
  }

  const room = await createRoom(result.data);
  response.status(201).json(room);
};

