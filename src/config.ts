export type AppConfig = {
  jwtSecret: string;
  port: number;
  roomApiUrl: string;
  tls?: {
    certPath: string;
    keyPath: string;
  };
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

  const roomApiUrl = env.ROOM_API_URL;
  if (!roomApiUrl) {
    throw new Error("ROOM_API_URL must be set");
  }
  const config: AppConfig = {
    jwtSecret,
    port,
    roomApiUrl,
  };

  if (env.APP_ENV === "development") {
    return config;
  }

  const certPath = env.TLS_CERT_PATH;
  const keyPath = env.TLS_KEY_PATH;
  if (!certPath || !keyPath) {
    throw new Error(
      "TLS_CERT_PATH and TLS_KEY_PATH must be set unless APP_ENV=development",
    );
  }

  return { ...config, tls: { certPath, keyPath } };
}
