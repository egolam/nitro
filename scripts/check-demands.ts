import { db } from "@/db";
import { productDemands } from "@/db/schema/orders";
import { sql } from "drizzle-orm";

async function main() {
  const result = await db
    .select({
      status: productDemands.status,
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(productDemands)
    .groupBy(productDemands.status);

  console.log("Current Product Demands Status Counts:");
  console.table(result);
}

main().catch(console.error);
