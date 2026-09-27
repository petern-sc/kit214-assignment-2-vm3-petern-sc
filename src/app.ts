import express from "express";
import type { AppConfig } from "./config.js";
import { createAuthRoutes } from "./features/auth/auth.routes.js";
import infoRoutes from "./features/info/info.routes.js";
import roomsRoutes from "./features/rooms/rooms.routes.js";
import { errorHandler } from "./shared/error-handler.js";

export function createApp(config: AppConfig) {
  const app = express();

  app.use(express.json());
  app.use(createAuthRoutes(config));

  app.get("/", (_request, response) => {
    response.json({ message: "Hello, world!" });
  });

  app.use(infoRoutes);
  app.use(roomsRoutes);
  app.use(errorHandler);

  return app;
}
