import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import type { AppConfig } from "../config.js";
import { sendErrorResponse } from "./error-response.js";

export function createRequireAuth(config: AppConfig): RequestHandler {
  return (request, response, next) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      sendErrorResponse(response, 401, "Authentication token required");
      return;
    }

    const token = authHeader.split(" ")[1];
    try {
      const jwtPayload = jwt.verify(token, config.jwtSecret, {
        algorithms: ["HS256"],
      });
      if (
        typeof jwtPayload === "string" ||
        typeof jwtPayload.sub !== "string"
      ) {
        sendErrorResponse(response, 401, "Invalid or expired token");
        return;
      }

      response.locals.userId = jwtPayload.sub;
      next();
    } catch {
      sendErrorResponse(response, 401, "Invalid or expired token");
    }
  };
}
