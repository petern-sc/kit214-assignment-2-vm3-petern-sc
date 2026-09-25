import { Router } from "express";
import {
  createRoomController,
  getRoomByIdController,
  listRoomsController,
  updateRoomController,
} from "./rooms.controller.js";

const roomsRouter = Router();

roomsRouter.post("/rooms", createRoomController);
roomsRouter.get("/rooms", listRoomsController);
roomsRouter.get("/rooms/:id", getRoomByIdController);
roomsRouter.put("/rooms/:id", updateRoomController);

export default roomsRouter;
