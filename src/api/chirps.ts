import type { Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
import { createChirp, getChirps } from "../db/queries/chirps.js";


export async function handlerChirpsCreate(req: Request, res: Response) {
  type parameters = {
    body: string;
    userId: string;
  };

  const params: parameters = req.body; // req.body is automatically parsed thank to app.use(express.json()) in index.ts

  const cleaned = validateChirp(params.body);
  const chirp = await createChirp({
    body: cleaned,
    userId: params.userId
  });
  if (!chirp) {
    throw new Error(`Could not create chirp`);
  }

  respondWithJSON(res, 201, chirp);
  
}

function validateChirp(body: string): string {
 
  const maxChirpLength = 140;
  if (body.length > maxChirpLength) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${maxChirpLength}`
    );
  }

  const badWords = ["kerfuffle", "sharbert", "fornax"];

  const cleanedBody = body.split(" ")
    .map((word) =>
      badWords.includes(word.toLowerCase()) ? "****" : word
    )
    .join(" ");

  return cleanedBody;
  
}

export async function handlerChirpsRetrieve(_req: Request, res: Response) {
  
  const chirps = await getChirps();
  if (!chirps) {
    throw new Error(`Could not get chirps`);
  }

  respondWithJSON(res, 200, chirps);
  
}