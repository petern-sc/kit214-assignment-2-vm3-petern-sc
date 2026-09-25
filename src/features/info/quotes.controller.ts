import type { RequestHandler } from "express";
import { HttpClient } from "../../shared/http-client.js";

interface Quote {
  content: string;
}

const quotableClient = new HttpClient("https://api.quotable.io");

export const getRandomQuote: RequestHandler = async (_request, response) => {
  const quotes = await quotableClient.get<Quote[]>("/quotes/random");
  const quote = quotes[0].content;
  response.status(418).json({ quote });
};
