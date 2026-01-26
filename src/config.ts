import type { MigrationConfig } from "drizzle-orm/migrator";

import { loadEnvFile } from "node:process";


type Config = {
  api: APIConfig;
  db: DBConfig;
  jwt: JWTConfig
};

type APIConfig = {
  fileServerHits: number;
  port: number;
  platform: string;
}

type DBConfig = {
  dbURL: string;
  migrationConfig: MigrationConfig;
}

type JWTConfig = {
  defaultDuration: number;
  secret: string;
  issuer: string;
}

loadEnvFile();

function envOrThrow(key: string) {
  //generic, so can be used for dbURL string, or other env vars
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value; // found val for the key
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const config: Config = {
  api: {
    fileServerHits: 0,
    port: Number(envOrThrow("PORT")),
    platform: envOrThrow("PLATFORM")
  },
  db: {
    dbURL: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
  jwt: {
    defaultDuration: 60 * 60, // 1 hour in seconds
    secret: envOrThrow("JWT_SECRET"),
    issuer: "chirpy"
  }
}
