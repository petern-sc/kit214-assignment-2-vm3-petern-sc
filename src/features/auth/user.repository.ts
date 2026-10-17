import { database } from "../../shared/database.js";
import { isDuplicateKeyError } from "../../shared/database-errors.js";
import type { UserRecord } from "./models/user.js";

export type InsertUserResult =
  { kind: "inserted" } | { kind: "username-already-exists" };

export async function insertUser(user: UserRecord): Promise<InsertUserResult> {
  try {
    await database<UserRecord>("users").insert(user);
    return { kind: "inserted" };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return { kind: "username-already-exists" };
    }

    throw error;
  }
}

export async function getUserByUsername(
  username: string,
): Promise<UserRecord | null> {
  const user = await database<UserRecord>("users")
    .select("id", "username", "password_hash")
    .where({ username })
    .first();

  return user ?? null;
}

export async function listUsers(): Promise<UserRecord[]> {
  return database<UserRecord>("users").select(
    "id",
    "username",
    "password_hash",
  );
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  const user = await database<UserRecord>("users")
    .select("id", "username", "password_hash")
    .where({ id })
    .first();

  return user ?? null;
}
