import express from "express";

const app = express();

app.use(express.json());

app.get("/", (_request, response) => {
  response.json({ message: "Hello, world!" });
});

export default app;
