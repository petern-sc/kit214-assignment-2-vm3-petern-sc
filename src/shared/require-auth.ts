import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import type { AppConfig } from "../config.js";

export function createRequireAuth(config: AppConfig): RequestHandler {
  return (request, response, next) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response.status(401).json({
        error: "Authentication token required",
      });
    }

    const token = authHeader.split(" ")[1];
    try {
      const jwtPayload = jwt.verify(token, config.jwtSecret, {
        algorithms: ["HS256"],
      });
      if (typeof jwtPayload === "string" || typeof jwtPayload.sub !== "string") {
        return response.status(401).json({
          error: "Invalid or expired token",
        });
      }

      response.locals.userId = jwtPayload.sub;
      next();
    } catch {
      return response.status(401).json({
        error: "Invalid or expired token",
      });
    }
  };
}
