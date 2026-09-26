import type { RequestHandler } from "express";
import { randomUUID } from "node:crypto";
import {
  deleteRoom,
  getRoomById,
  insertRoom,
  listRooms,
  updateRoom,
} from "./room.repository.js";
import {
  CreateRoomInputSchema,
  UpdateRoomInputSchema,
  type CreateRoomInput,
  type Room,
} from "./models/room.js";
import { roomNotFound } from "./helper.js";

export const listRoomsController: RequestHandler = async (
  _request,
  response,
) => {
  const rooms = await listRooms();
  response.status(200).json(rooms);
};

async function createRoom(input: CreateRoomInput): Promise<Room> {
  const room: Room = { id: randomUUID(), ...input };
  return insertRoom(room);
}

export const createRoomController: RequestHandler = async (
  request,
  response,
) => {
  const result = CreateRoomInputSchema.safeParse(request.body);
  if (!result.success) {
    response.status(400).json({ error: result.error.issues });
    return;
  }

  const room = await createRoom(result.data);
  response.status(201).json(room);
};

export const getRoomByIdController: RequestHandler<{ id: string }> = async (
  request,
  response,
) => {
  const room = await getRoomById(request.params.id);
  if (!room) {
    roomNotFound(response);
    return;
  }

  response.status(200).json(room);
};

export const updateRoomController: RequestHandler<{ id: string }> = async (
  request,
  response,
) => {
  const roomRequest = UpdateRoomInputSchema.safeParse(request.body);

  if (!roomRequest.success) {
    response.status(400).json({ error: roomRequest.error.issues });
    return;
  }

  const updatedRoom = await updateRoom({
    id: request.params.id,
    ...roomRequest.data,
  });

  if (!updatedRoom) {
    roomNotFound(response);
  } else {
    response.status(200).json(updatedRoom);
  }
};

export const deleteRoomByIdController: RequestHandler<{ id: string }> = async (
  request,
  response,
) => {
  const deleted = await deleteRoom(request.params.id);
  if (!deleted) {
    roomNotFound(response);
    return;
  }

  response.status(200);
};
