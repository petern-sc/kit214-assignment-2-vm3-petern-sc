import type { ErrorRequestHandler } from "express";
import { sendErrorResponse } from "./error-response.js";

// Based on express default handler. Adds this for logging
// https://expressjs.com/en/5x/guide/error-handling/#the-default-error-handler
export const errorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  next,
) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (
    error instanceof SyntaxError &&
    "type" in error &&
    error.type === "entity.parse.failed" &&
    "status" in error &&
    error.status === 400
  ) {
    sendErrorResponse(response, 400, "Malformed JSON request body");
    return;
  }

  console.error("Unhandled request error", {
    method: request.method,
    path: request.originalUrl,
    error,
  });
  sendErrorResponse(response, 500, "Internal server error.");
};
