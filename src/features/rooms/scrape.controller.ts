import { load } from "cheerio";
import type { RequestHandler } from "express";
import { sendErrorResponse } from "../../shared/error-response.js";

const venueDirectoryUrl = "https://utasbot.dev/static/venue-hire.html";

export function createScrapeRoomsController(
  roomApiUrl: string,
): RequestHandler {
  return async (request, response) => {
    let html: string;
    try {
      const page = await fetch(venueDirectoryUrl, {
        signal: AbortSignal.timeout(10_000),
      });
      if (!page.ok) {
        console.error("Venue directory request failed", {
          method: request.method,
          path: request.originalUrl,
          upstreamStatus: page.status,
        });
        sendErrorResponse(response, 500, "Unable to fetch the scrape website");
        return;
      }

      html = await page.text();
    } catch (error) {
      console.error("Unable to fetch venue directory", {
        method: request.method,
        path: request.originalUrl,
        error,
      });
      sendErrorResponse(response, 500, "Unexpected error occurred");
      return;
    }

    const userId = response.locals.userId as string;
    const rooms = extractRoomNames(html).map((name) => ({
      name,
      targetUrl: roomApiUrl,
      interfaceType: "whiteboard" as const,
      userId,
    }));

    response.status(200).json(rooms);
  };
}

function extractRoomNames(html: string): string[] {
  const $ = load(html);
  const names: string[] = [];

  // AI: Assistance to find the table with the room names and parsing through the html, because it's a pain to
  // read through a chain of html.
  $("table").each((_tableIndex, table) => {
    const $table = $(table);
    const headers = $table
      .find("thead tr")
      .first()
      .children("th")
      .map((_index, header) => $(header).text().toLowerCase())
      .get();
    const nameIndex = headers.indexOf("name");
    if (nameIndex === -1) return;

    $table.find("tbody tr").each((_rowIndex, row) => {
      const nameCell = $(row).children("td").eq(nameIndex);
      nameCell.find("br").replaceWith(" ");
      const name = nameCell.text().trim();
      if (name) names.push(name);
    });
  });

  return names;
}
