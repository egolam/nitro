import { db } from "@/db";

export async function getSettings() {
  const result = await db.query.settings.findFirst({
    with: {
      saleStatus: true,
    },
  });
  return result;
}
