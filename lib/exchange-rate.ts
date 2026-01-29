import { db } from "@/db";
import { settings } from "@/db/schema/settings";

export async function getExchangeRate(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.frankfurter.app/latest?from=USD&to=TRY",
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );

    if (!res.ok) throw new Error("Failed to fetch exchange rate");

    const data = await res.json();
    return data.rates.TRY;
  } catch (error) {
    console.error(
      "Exchange rate fetch failed, falling back to settings:",
      error,
    );

    // Fallback to database setting
    const [setting] = await db.select().from(settings).limit(1);
    return setting?.exchangeRate || 43.58; // Default fallback if DB is empty
  }
}
