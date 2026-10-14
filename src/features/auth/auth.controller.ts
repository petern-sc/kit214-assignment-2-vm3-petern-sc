import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import type { AppConfig } from "../../config.js";
import {
  LoginRequestSchema,
  RegisterInputSchema,
  type UserRecord,
} from "./models/user.js";
import {
  getUserById,
  getUserByUsername,
  insertUser,
  listUsers,
} from "./user.repository.js";
import {
  sendErrorResponse,
  sendValidationError,
} from "../../shared/error-response.js";

export const listUsersController: RequestHandler = async (
  _request,
  response,
) => {
  const users = await listUsers();
  response.status(200).json(users.map(toUserResponse));
};

export const getUserByIdController: RequestHandler<{ id: string }> = async (
  request,
  response,
) => {
  const user = await getUserById(request.params.id);
  if (!user) {
    sendErrorResponse(response, 404, "User not found");
    return;
  }

  response.status(200).json(toUserResponse(user));
};

function toUserResponse(user: UserRecord) {
  return {
    id: user.id,
    username: user.username,
    passwordHash: user.password_hash,
  };
}

export const registerController: RequestHandler = async (request, response) => {
  const result = RegisterInputSchema.safeParse(request.body);
  if (!result.success) {
    sendValidationError(
      response,
      "Username and password are required",
      result.error,
    );
    return;
  }

  const { username, password } = result.data;

  const insertResult = await insertUser({
    id: randomUUID(),
    username,
    password_hash: await bcrypt.hash(password, 10),
  });
  if (insertResult.kind === "username-already-exists") {
    sendErrorResponse(response, 409, "Username already exists");
    return;
  }

  response.status(201).json({ message: "User registered" });
};

export function createLoginController(config: AppConfig): RequestHandler {
  return async (request, response) => {
    const loginRequest = LoginRequestSchema.safeParse(request.body);

    if (!loginRequest.success) {
      sendValidationError(
        response,
        "Invalid login request",
        loginRequest.error,
      );
      return;
    }

    const { username, password } = loginRequest.data;

    const user = await getUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      sendErrorResponse(response, 401, "Invalid username or password");
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
