import { loadEnvFile } from "node:process";

/**
 * this file will hold any stateful, in-memory data we'll need to keep track of. 
 * In our case, we just need to keep track of the number of requests 
 * we've received.
 */

loadEnvFile();

type APIConfig = {
  fileServerHits: number;
  dbURL: string;
}

export const config: APIConfig = {
  fileServerHits: 0,
  dbURL: envOrThrow("DB_URL"),
}

function envOrThrow(key: string) {
  //generic, so can be used for dbURL string, or other env vars
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value; // found val for the key
}