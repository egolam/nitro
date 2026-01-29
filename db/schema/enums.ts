import { pgEnum } from "drizzle-orm/pg-core";

export const userTypeEnum = pgEnum("user_type", ["individual", "corporate"]);

export const genderEnum = pgEnum("gender", [
  "male",
  "female",
  "unisex",
  "unassigned",
]);

export const saleStatusEnum = pgEnum("status_name", [
  "open",
  "partial",
  "confirmed",
  "payment",
  "completed",
]);

export const productDemandStatusEnum = pgEnum("product_demand_status", [
  "pending",
  "valid",
  "confirmed",
  "payment",
  "paid",
  "packaged",
  "shipped",
]);
