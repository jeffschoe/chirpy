import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema.js";
import { config } from "../config.js";

const conn = postgres(config.db.dbURL); //creates a connection client to your database.
export const db = drizzle(conn, { schema }); // orm object used to run queries against the database
// an options object { schema } that tells Drizzle what tables/columns exist.
