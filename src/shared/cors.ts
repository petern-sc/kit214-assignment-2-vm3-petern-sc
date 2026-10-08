import type { RequestHandler } from "express";

export const corsMiddleware: RequestHandler = (request, response, next) => {
  response.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "600",
  });

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  next();
};
