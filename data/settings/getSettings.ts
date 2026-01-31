import { db } from "@/db";

export async function getSettings() {
  try {
    const result = await db.query.settings.findFirst({
      with: {
        saleStatus: true,
      },
    });
    return result;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return null;
  }
}
