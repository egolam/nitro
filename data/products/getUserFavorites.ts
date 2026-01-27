import { db } from "@/db";
import { favourites } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserFavorites(userId: string) {
  const rows = await db
    .select({ productId: favourites.productId })
    .from(favourites)
    .where(eq(favourites.userId, userId));

  return new Set(rows.map((r) => r.productId));
}
