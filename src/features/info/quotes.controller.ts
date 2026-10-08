import type { RequestHandler } from "express";
import { HttpClient } from "../../shared/http-client.js";

interface Quote {
  quote: string;
}

const quotableClient = new HttpClient("https://dummyjson.com");

export const getRandomQuote: RequestHandler = async (_request, response) => {
  const { quote } = await quotableClient.get<Quote>("/quotes/1");
  response.status(418).json({ quote });
};
