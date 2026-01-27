import { db } from "./index";
import { products } from "./schema";

console.log("Debug seed started");

async function main() {
  console.log("Inside main");
  // Just try to log something from schema
  console.log("Products table object:", products);
}

main().catch(console.error);
