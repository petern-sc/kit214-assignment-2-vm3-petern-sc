import express from "express";
import infoRoutes from "./features/info/info.routes.js";
import { errorHandler } from "./shared/error-handler.js";

const app = express();

app.use(express.json());

app.get("/", (_request, response) => {
  response.json({ message: "Hello, world!" });
});

app.use(infoRoutes);
app.use(errorHandler);

export default app;
