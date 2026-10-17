import { Router } from "express";
import type { AppConfig } from "../../config.js";
import { createRequireAuth } from "../../shared/require-auth.js";
import {
  createRoomController,
  deleteRoomByIdController,
  getRoomByIdController,
  listRoomsController,
  updateRoomController,
} from "./rooms.controller.js";
import { createScrapeRoomsController } from "./scrape.controller.js";

export function createRoomsRoutes(config: AppConfig) {
  const roomsRouter = Router();
  const requireAuthMiddleware = createRequireAuth(config);

  roomsRouter.post("/rooms", requireAuthMiddleware, createRoomController);
  roomsRouter.get("/rooms", listRoomsController);
  roomsRouter.get(
    "/scrape",
    requireAuthMiddleware,
    createScrapeRoomsController(config.roomApiUrl),
  );
  roomsRouter.get("/rooms/:id", getRoomByIdController);
  roomsRouter.put("/rooms/:id", requireAuthMiddleware, updateRoomController);
  roomsRouter.delete(
    "/rooms/:id",
    requireAuthMiddleware,
    deleteRoomByIdController,
  );

  return roomsRouter;
}
