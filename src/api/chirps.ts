import type { Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import { BadRequestError, NotFoundError, UserForbiddenError} from "./errors.js";
import { createChirp, deleteChirp, getChirp, getChirps } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { parse } from "node:path";


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

export async function handlerChirpsRetrieve(req: Request, res: Response) {
  const { author_id, sort } = req.query;
  
  let authorIdQuery: string | undefined;
  if (typeof author_id === "string") {
    authorIdQuery = author_id;
  }

  let sortField: SortField | undefined;
  let sortDirection: SortDirection | undefined;

  if (typeof sort === "string") {
    const parsed = parseSort(sort);
    sortField = parsed.field;
    sortDirection = parsed.direction;
  }

  const options = {
    authorId: authorIdQuery,
    sortField,
    sortDirection,
  }
 
  const chirps = await getChirps(options);

  respondWithJSON(res, 200, chirps);
}

export type SortField = "created_at" | "body" | "email";
export type SortDirection = "asc" | "desc";

function parseSort(sort: string): { field: SortField; direction: SortDirection } {
  const DEFAULT_FIELD: SortField = "created_at";

  const splitSort = sort.split(":");

  if (splitSort.length === 1) {
    // treat “no colon” as “just a direction” ("asc" or "desc") for default field
    const dir = splitSort[0];
    validateDirection(dir);
    return { field: DEFAULT_FIELD, direction: dir as SortDirection }
  }

  if (splitSort.length === 2) {
    const [field, dir] = splitSort as [string, string];

    validateDirection(dir);

    if (field !== "created_at" && field !== "body" && field !== "email") {
      throw new BadRequestError("Invalid sort field.");
    }

    return { field, direction: dir as SortDirection};
  }

  // more than one ":" → bad format
  throw new BadRequestError("Invalid sort format");

}

function validateDirection(dir: string) {
  if (dir !== "asc" && dir !== "desc") {
    throw new BadRequestError("Invalid sort direction.")
  }
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
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.jwt.secret)
  
  const chirpId = req.params.chirpId;

  const chirp = await getChirp(chirpId);
  if (!chirp) {
    throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`);
  }
  if (chirp.userId !== userId) {
    throw new UserForbiddenError("You can't delete this chirp")
  }

  const deleted = await deleteChirp(chirpId);
  if (!deleted) {
    throw new Error(`Failed to delete chirp with chirpId: ${chirpId}`);
  }
  
  res.status(204).send();

}