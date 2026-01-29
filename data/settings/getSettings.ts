import { db } from "@/db";
import { settings } from "@/db/schema";

export async function getSettings() {
  const result = await db.query.settings.findFirst({
    with: {
      saleStatus: true,
    },
  });
  return result;
}
