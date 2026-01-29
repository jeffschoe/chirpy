import type { Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import { BadRequestError, NotFoundError, UserNotAuthenticatedError } from "./errors.js";
import { createChirp, getChirp, getChirps } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";


export async function handlerChirpsCreate(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body; // req.body is automatically parsed thank to app.use(express.json()) in index.ts

  const token = getBearerToken(req);
  const userId = validateJWT(token, config.jwt.secret)
  
  const cleaned = validateChirp(params.body);
  const chirp = await createChirp({
    body: cleaned,
    userId
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

export async function handlerChirpsGet(req: Request, res: Response) {
  
  const chirpId = req.params.chirpId;

  const chirp = await getChirp(chirpId);
  if (!chirp) {
    throw new NotFoundError(`Could not get chirp with id: ${chirpId}`);
  }

  respondWithJSON(res, 200, chirp);
}

export async function handlerChirpsDelete(req: Request, res: Response) {
  
  const chirpId = req.params.chirpId;

  const chirp = await getChirp(chirpId);
  if (!chirp) {
    throw new NotFoundError(`Could not get chirp with id: ${chirpId}`);
  }

  respondWithJSON(res, 200, chirp);
}