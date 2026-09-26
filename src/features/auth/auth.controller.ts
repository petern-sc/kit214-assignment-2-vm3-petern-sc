import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { RegisterInputSchema } from "./models/user.js";
import { insertUser } from "./user.repository.js";
import { UsernameAlreadyExistsError } from "./models/auth-errors.js";

export const registerController: RequestHandler = async (request, response) => {
  const result = RegisterInputSchema.safeParse(request.body);
  if (!result.success) {
    response.status(400).json({ error: "Username and password are required" });
    return;
  }

  const { username, password } = result.data;

  try {
    await insertUser({
      id: randomUUID(),
      username,
      password_hash: await bcrypt.hash(password, 10),
    });
  } catch (error) {
    if (error instanceof UsernameAlreadyExistsError) {
      response.status(409).json({ error: "Username already exists" });
      return;
    }

    throw error;
  }

  response.status(201).json({ message: "User registered" });
};
