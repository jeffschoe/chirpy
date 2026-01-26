import { getUserByEmail } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errors.js";
import { checkPasswordHash, makeJWT } from "../auth.js";

import type { Request, Response } from "express";
import type { UserResponse } from "./users.js";
import { config } from "../config.js";

export type LoginResponse = UserResponse & {
  token: string; 
};

export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    password: string;
    email: string;
    expiresIn?: number; //seconds
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

  let duration = config.jwt.defaultDuration;
  if (params.expiresIn && !(params.expiresIn > config.jwt.defaultDuration)) {
    duration = params.expiresIn;
  }
  
  const accessToken = makeJWT(user.id, duration, config.jwt.secret);

  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token: accessToken,
  } satisfies LoginResponse);
  
}