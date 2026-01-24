import type { Request, Response } from "express";
import type { ExistingUser, NewUser } from "../db/schema.js";

import { createUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
import { hashPassword } from "../auth.js";

export type UserResponse = Omit<ExistingUser, "hashedPassword">;


export async function handlerUsersCreate(req: Request, res: Response) {
  type parameters = {
    password: string;
    email: string;
  };

  const params: parameters = req.body;
  if (!params.password || !params.email) { // no password or email sent in request
    throw new BadRequestError("Missing required fields");
  };

  const hashedPassword = await hashPassword(params.password);

  const user = await createUser({ 
    hashedPassword, 
    email: params.email, 
  } satisfies NewUser);
  if (!user) {
    throw new Error(`Could not create user`);
  };

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } satisfies UserResponse);
}