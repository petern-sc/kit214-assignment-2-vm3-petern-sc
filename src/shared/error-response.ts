import type { Response } from "express";
import type { ZodError } from "zod";

export type ValidationDetail = {
  field: string;
  message: string;
};

export function sendErrorResponse(
  response: Response,
  status: number,
  message: string,
  details?: ValidationDetail[],
): void {
  response.status(status).json({
    error: message,
    ...(details ? { details } : {}),
  });
}

export function sendValidationError(
  response: Response,
  message: string,
  error: ZodError,
): void {
  const details = error.issues.map((issue) => ({
    field: issue.path.map(String).join(".") || "request",
    message: issue.message,
  }));

  sendErrorResponse(response, 400, message, details);
}
