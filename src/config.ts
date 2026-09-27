export type AppConfig = {
  jwtSecret: string;
  port: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const jwtSecret = env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET must be set");
  }

  const port = Number(env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  return { jwtSecret, port };
}
