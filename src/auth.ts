import argon2 from 'argon2';
import jwt from "jsonwebtoken";
import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
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
    throw new UserNotAuthenticatedError("Malformed authorization header");
  }
  
  return extractBearerToken(authHeader);
}

export function extractBearerToken(header: string) {
  const splitAuth = header.split(" ");
  if (splitAuth.length < 2 || splitAuth[0] !== "Bearer") {
    throw new BadRequestError("Malformed authorization header");
  }
  return splitAuth[1];
}

export function makeRefreshToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function getApiKey(req: Request) {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    throw new UserNotAuthenticatedError("Malformed authorization header");
  }

  return extractApiKey(authHeader);
}

export function extractApiKey(header: string) {
  const splitAuth = header.split(" ");
  if (splitAuth.length < 2 || splitAuth[0] !== "ApiKey") {
    throw new BadRequestError("Malformed authorization header");
  }
  return splitAuth[1];
}