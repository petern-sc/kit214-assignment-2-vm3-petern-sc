import { Router } from "express";
import { createRoomController } from "./rooms.controller.js";

const roomsRouter = Router();

roomsRouter.post("/rooms", createRoomController);

export default roomsRouter;
