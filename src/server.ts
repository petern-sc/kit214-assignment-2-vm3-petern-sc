import "dotenv/config";
import { readFileSync } from "node:fs";
import { createServer as createHttpsServer } from "node:https";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";

const config = loadConfig();
const app = createApp(config);

const appListener = () => {
  const protocol = config.tls ? "HTTPS" : "HTTP";
  console.log(`${protocol} server listening on port ${config.port}`);
};

if (config.tls) {
  const options = {
    cert: readFileSync(config.tls.certPath),
    key: readFileSync(config.tls.keyPath),
  };

  createHttpsServer(options, app).listen(config.port, appListener);
} else {
  app.listen(config.port, appListener);
}
