import { pgEnum } from "drizzle-orm/pg-core";

export const userTypeEnum = pgEnum("user_type", ["individual", "corporate"]);

export const genderEnum = pgEnum("gender", [
  "male",
  "female",
  "unisex",
  "unassigned",
]);
