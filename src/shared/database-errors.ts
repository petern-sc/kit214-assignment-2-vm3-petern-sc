// https://dev.mysql.com/doc/mysql-errors/8.0/en/server-error-reference.html#error_er_dup_entry
// isDuplicateKeyError assisted by AI. The docs for mysql2, knex, and mysql
// are quite sparse on how to get here by myself.
export function isDuplicateKeyError(error: unknown): boolean {
  if (error instanceof Error && "code" in error) {
    return error.code === "ER_DUP_ENTRY";
  } else {
    return false;
  }
}
