import { db } from "@/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Dropping view product_demands_view...");
  try {
    await db.execute(sql`DROP VIEW IF EXISTS product_demands_view CASCADE`);
    console.log("View dropped successfully.");
  } catch (e) {
    console.error("Error dropping view:", e);
  }
  process.exit(0);
}

main();
