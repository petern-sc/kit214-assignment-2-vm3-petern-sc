import type { ErrorRequestHandler } from "express";


// Based on express default handler. Adds this for logging
// https://expressjs.com/en/5x/guide/error-handling/#the-default-error-handler
export const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  console.error(error);
  response.status(500).json({ error: "Internal server error." });
};
