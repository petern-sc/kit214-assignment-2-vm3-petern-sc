import express from "express";
import infoRoutes from "./features/info/info.routes.js";

const app = express();

app.use(express.json());

app.get("/", (_request, response) => {
  response.json({ message: "Hello, world!" });
});

app.use(infoRoutes);

export default app;
