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
import {
  sendErrorResponse,
  sendValidationError,
} from "../../shared/error-response.js";

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
    sendValidationError(response, "Invalid room input", result.error);
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
    sendErrorResponse(response, 404, "Room not found");
    return;
  }

  response.status(200).json(room);
};

export const updateRoomController: RequestHandler<{ id: string }> = async (
  request,
  response,
) => {
  const existingRoom = await getRoomById(request.params.id);
  if (!existingRoom) {
    sendErrorResponse(response, 404, "Room not found");
    return;
  }

  const roomRequest = UpdateRoomInputSchema.safeParse(request.body);

  if (!roomRequest.success) {
    sendValidationError(response, "Invalid room input", roomRequest.error);
    return;
  }

  const updatedRoom = await updateRoom({
    id: request.params.id,
    ...roomRequest.data,
  });

  if (!updatedRoom) {
    sendErrorResponse(response, 404, "Room not found");
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
    sendErrorResponse(response, 404, "Room not found");
    return;
  }

  response.status(200);
};
