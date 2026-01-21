import type { Request, Response } from "express";

import { createUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";


export async function handlerUsersCreate(req: Request, res: Response) {

  const params = req.body as { email?: string };
  if (!params.email) { // no email sent in request
    throw new BadRequestError("Missing required fields");
  }

  const user = await createUser({ email: params.email });
  if (!user) {
    throw new Error(`Could not create user`);
  }

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}