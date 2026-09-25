import { Router } from "express";
import {
  createRoomController,
  deleteRoomByIdController,
  getRoomByIdController,
  listRoomsController,
  updateRoomController,
} from "./rooms.controller.js";

const roomsRouter = Router();

roomsRouter.post("/rooms", createRoomController);
roomsRouter.get("/rooms", listRoomsController);
roomsRouter.get("/rooms/:id", getRoomByIdController);
roomsRouter.put("/rooms/:id", updateRoomController);
roomsRouter.delete("/rooms/:id", deleteRoomByIdController);

export default roomsRouter;
