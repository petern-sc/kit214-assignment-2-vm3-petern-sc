import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import type { AppConfig } from "../../config.js";
import { LoginRequestSchema, RegisterInputSchema } from "./models/user.js";
import { getUserByUsername, insertUser } from "./user.repository.js";
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

export function createLoginController(config: AppConfig): RequestHandler {
  return async (request, response) => {
    const loginRequest = LoginRequestSchema.safeParse(request.body);

    if (!loginRequest.success) {
      response.status(400).json({ error: "Invalid login request" });
      return;
    }

    const { username, password } = loginRequest.data;

    const user = await getUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      response.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const token = jwt.sign({ sub: user.id }, config.jwtSecret);

    response.status(200).json({
      token,
      message: "Login successful",
      userId: user.id,
      username: user.username,
    });
  };
}
