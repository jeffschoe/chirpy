import argon2 from 'argon2';
import jwt from "jsonwebtoken";
import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

import { BadRequestError, UserNotAuthenticatedError } from './api/errors.js';

const TOKEN_ISSUER = "chirpy";


export async function hashPassword(password: string) {
  return argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string) {
  // Use the argon2.verify function to compare the password in the 
  // HTTP request with the password that is stored in the database.
  if (!password) return false; // Guard against empty/undefined password

  try {
    return argon2.verify(hash, password); // Catch argon2 errors
  } catch {
    return false;
  }

}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {

  const issuedAt = Math.floor(Date.now() / 1000); // in seconds
  const expiresAt = issuedAt + expiresIn;
  const token = jwt
  .sign({
    iss: TOKEN_ISSUER,
    sub: userID,
    iat: issuedAt,
    exp: expiresAt,
  } satisfies payload, 
  secret,
  { algorithm: "HS256" },
  );

  return token;
}

export function validateJWT(tokenString: string, secret: string) {
 let decoded: payload;

  try {
    decoded = jwt.verify(tokenString, secret) as payload;
  } catch {
    throw new UserNotAuthenticatedError("Invalid token");
  }

  if (decoded.iss !== TOKEN_ISSUER) {
    throw new UserNotAuthenticatedError("Invalid issuer");
  }

  // sub = subject of the token, which is the user's ID
  if (typeof decoded.sub !== "string") {
    throw new UserNotAuthenticatedError("No user ID in token");
  }

  return decoded.sub;
}

export function getBearerToken(req: Request) {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    throw new BadRequestError("Authorization header does not exist");
  }
  

  return extractBearerToken(authHeader);

}

export function extractBearerToken(header: string) {
  if (header.slice(0,7) !== "Bearer ") {
    throw new BadRequestError("Malformed Authorization header");
  }
  const tokenString = header.slice(7,);
  if (tokenString.length === 0) {
    throw new BadRequestError("Authorization header token string missing");
  }

  return tokenString

}