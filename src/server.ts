import "dotenv/config";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";

const config = loadConfig();
const app = createApp(config);

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
