import { getUserByEmail } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errors.js";
import { checkPasswordHash, getBearerToken, makeJWT, makeRefreshToken } from "../auth.js";

import type { Request, Response } from "express";
import type { UserResponse } from "./users.js";
import { config } from "../config.js";
import { saveRefreshToken, revokeRefreshToken, userForRefreshToken } from "../db/queries/refresh.js";


export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    password: string;
    email: string;
  };

  const params: parameters = req.body;
  if (!params.password || !params.email) { // no password or email sent in request
    throw new BadRequestError("Missing required fields");
  };

  const user = await getUserByEmail(params.email);
  if (!user) {
    throw new UserNotAuthenticatedError("Incorrect email or password")
  };

  const matching = await checkPasswordHash(
    params.password, 
    user.hashedPassword
  );
  if (!matching) {
    throw new UserNotAuthenticatedError("Incorrect email or password")
  };

  const accessToken = makeJWT(
    user.id, 
    config.jwt.defaultDuration, 
    config.jwt.secret
  );

  const refreshToken = makeRefreshToken();

  const saved = await saveRefreshToken(user.id, refreshToken);
  if (!saved) {
    throw new UserNotAuthenticatedError(`Could not save refresh token`);
  }

  type LoginResponse = UserResponse & {
    token: string; 
    refreshToken: string;
  };

  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token: accessToken,
    refreshToken,
  } satisfies LoginResponse);
}


export async function handlerRefresh(req: Request, res: Response) {

  //need to check format is "Authorization: Bearer <token>""
  const refreshToken = getBearerToken(req);

  //lookup the token in the DB with a getToken query
  const result = await userForRefreshToken(refreshToken);
  //if it doesn't exist, or is expired, or revoked, respond with 401
  if (!result) {
    throw new UserNotAuthenticatedError("Invalid refresh token") //401
  }
  const user = result.user;

  //make new accessToken
  const accessToken = makeJWT(
    user.id,
    config.jwt.defaultDuration,
    config.jwt.secret
  )

  type RefreshResponse = {
    token: string;
  };

  respondWithJSON(res, 200, {
    token: accessToken
  } satisfies RefreshResponse);
}

export async function handlerRevoke(req: Request, res: Response) {
  const refreshToken = getBearerToken(req);
  await revokeRefreshToken(refreshToken);
  res.status(204).send(); // ensures there is no content in the body
}