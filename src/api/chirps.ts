import type { Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";

export async function handlerChirpsValidate(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body; // req.body is automatically parsed thank to app.use(express.json()) in index.ts

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${maxChirpLength}`
    );
  }

  const badWords = ["kerfuffle", "sharbert", "fornax"];

  const cleanedBody = params.body.split(" ")
    .map((word) =>
      badWords.includes(word.toLowerCase()) ? "****" : word
    )
    .join(" ");


  respondWithJSON(res, 200, {
    cleanedBody: cleanedBody,
  });
  
}