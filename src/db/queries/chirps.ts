import { asc, desc, eq, and } from "drizzle-orm";
import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";


export async function createChirp(chirp: NewChirp) {
  const [rows] = await db
    .insert(chirps)
    .values(chirp)
    .returning();
  return rows;
}

export async function getChirps(options?: {
  authorId?: string;
  sort?: "asc" | "desc";
}) {
  //nullish coalescing: if options is null or undefined, it uses {} instead.
  const { authorId, sort } = options ?? {}; 

  //base query that gets everything
  const base = db.select().from(chirps);

  //withFilters handles only conditional WHERE logic.
  const withFilters = //ternary op to get filters
    authorId
      ? base.where(
          and(
            authorId ? eq(chirps.userId, authorId) : undefined,
          ),
        )
      : base;


  //sorting at the end
  let withSorting;

  withSorting = (sort === "asc") //ternary for ordering
  ? await withFilters.orderBy(asc(chirps.createdAt))
  : await withFilters.orderBy(desc(chirps.createdAt))

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