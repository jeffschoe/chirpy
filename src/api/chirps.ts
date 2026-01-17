import type { Request, Response } from "express";

import { respondWithJSON, respondWithError } from "./json.js";

export async function handlerChirpsValidate(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body; // req.body is automatically parsed thank to app.use(express.json()) in index.ts

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    respondWithError(res, 400, "Chirp is too long");
    return;
  }

  const cleanedBody = cleanBody(params.body);

  respondWithJSON(res, 200, {
    cleanedBody: cleanedBody,
  });
  
}

function cleanBody(body: string) {

  const badWords = ["kerfuffle", "sharbert", "fornax"];

  return body
    .split(" ")
    .map((word) =>
      badWords.includes(word.toLowerCase()) ? "****" : word
    )
    .join(" ");
}
