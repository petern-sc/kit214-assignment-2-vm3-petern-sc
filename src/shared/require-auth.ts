import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AppConfig } from "../config.js";

// Reference: https://www.geeksforgeeks.org/node-js/how-to-implement-jwt-authentication-in-express-js-app/
export function createRequireAuth(config: AppConfig): RequestHandler {
  return (request, response, next) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response.status(401).json({
            error: 'Authentication token required'
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] });
        next();
    } catch {
        return response.status(401).json({
            error: 'Invalid or expired token'
        });
    }

  };
}
