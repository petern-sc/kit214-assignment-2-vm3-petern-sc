import type { Response } from "express";

export const roomNotFound = (response: Response) => {
  response.status(404).json({ error: "room not found" });
}
