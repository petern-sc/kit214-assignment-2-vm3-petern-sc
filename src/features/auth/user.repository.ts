import { database } from "../../shared/database.js";
import type { UserRecord } from "./models/user.js";

// Fails on unique constraint on username.
// https://dev.mysql.com/doc/mysql-errors/8.0/en/server-error-reference.html#error_er_dup_entry
// isDuplicateKeyError assisted by AI. The docs for mysql2, knex, and mysql
// are quite sparse on how to get here by myself.
function isDuplicateKeyError(error: unknown): boolean {
  if (error instanceof Error && "code" in error) {
    return error.code === "ER_DUP_ENTRY";
  } else {
    return false;
  }
}

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
