import { asc, desc, eq, and } from "drizzle-orm";
import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { users } from "../schema.js";
import type { SortField, SortDirection } from "../../api/chirps.js";


export async function createChirp(chirp: NewChirp) {
  const [rows] = await db
    .insert(chirps)
    .values(chirp)
    .returning();
  return rows;
}

export async function getChirps(options?: {
  authorId?: string;
  sortField?: SortField;
  sortDirection?: SortDirection;
}) {
  //nullish coalescing: if options is null or undefined, it uses {} instead.
  const { 
    authorId, 
    sortField = "created_at", // default field
    sortDirection = "asc", // default direction 
  } = options ?? {}; 

  //base query that gets everything
   const base = db
    .select({
      id: chirps.id,
      createdAt: chirps.createdAt,
      body: chirps.body,
      userId: chirps.userId,
      authorEmail: users.email,
    })
    .from(chirps)
    .leftJoin(users, eq(chirps.userId, users.id));

  //withFilters handles only conditional WHERE logic.
  const withFilters = //ternary op to get filters
    authorId
      ? base.where(
          and(
            authorId ? eq(chirps.userId, authorId) : undefined,
          ),
        )
      : base;

  // choose the column based on sortField
  const sortColumn =
    sortField === "created_at"
      ? chirps.createdAt
      : sortField === "body"
      ? chirps.body
      : users.email; // or whatever column matches "email"

  const withSorting =
    sortDirection === "asc"
      ? await withFilters.orderBy(asc(sortColumn))
      : await withFilters.orderBy(desc(sortColumn));

  return withSorting;

}

export async function getChirp(id: string) {
  const [result] = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id, id))
  return result;
}

export async function deleteChirp(id: string) {
  const rows = await db
    .delete(chirps)
    .where(
      and(
        eq(chirps.id, id),
      ),
    )
    .returning();
   
  return rows.length > 0;
}