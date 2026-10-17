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

export const createRoomController: RequestHandler = async (
  request,
  response,
) => {
  const result = CreateRoomInputSchema.safeParse(request.body);
  if (!result.success) {
    sendValidationError(response, "Invalid room input", result.error);
    return;
  }

  const room: Room = { id: randomUUID(), ...result.data };

  const insertRoomResult = await insertRoom(room);
  switch (insertRoomResult.kind) {
    case "created":
      response.status(201).json(room);
      return;
    case "duplicate-room-name":
      sendErrorResponse(response, 409, "Room name already exists");
      return;
  }
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

  const updateRoomResult = await updateRoom({
    id: request.params.id,
    ...roomRequest.data,
  });

  switch (updateRoomResult.kind) {
    case "updated":
      response.status(200).json(updateRoomResult);
      return;
    case "room-not-found":
      sendErrorResponse(response, 404, "Room not found");
      return;
    case "duplicate-room-name":
      sendErrorResponse(response, 409, "Room name already exists");
      return;
    default:
      sendErrorResponse(response, 500, "Internal server error");
      return;
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

  response.status(204).end();
};
