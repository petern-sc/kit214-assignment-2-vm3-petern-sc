import { Router } from "express";
import { getRandomQuote } from "./quotes.controller.js";

const infoRouter = Router();

infoRouter.get("/info", (_request, response) => {
  response.type("application/json").json({ name: "Peter N" });
});
infoRouter.get("/quote", getRandomQuote);

export default infoRouter;
