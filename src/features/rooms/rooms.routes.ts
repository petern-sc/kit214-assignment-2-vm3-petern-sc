import { Router } from "express";
import { createRoomController, listRoomsController } from "./rooms.controller.js";

const roomsRouter = Router();

roomsRouter.post("/rooms", createRoomController);
roomsRouter.get("/rooms", listRoomsController);

export default roomsRouter;
