import { Router } from "express";

const infoRouter = Router();

infoRouter.get("/info", (_request, response) => {
  response.type("application/json").json({ name: "Peter N" });
});

export default infoRouter;
