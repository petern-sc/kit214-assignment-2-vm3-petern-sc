import knex from "knex";

export const database = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "rooms_app",
    password: process.env.DB_PASSWORD ?? "rooms_password",
    database: process.env.DB_NAME ?? "rooms_db",
  },
  pool: {
    min: 0,
    max: 10,
  },
});
