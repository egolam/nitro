import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { saleStatusEnum } from "./enums";

export const saleStatus = pgTable("sale_status", {
  id: serial("id").primaryKey(),
  name: saleStatusEnum("name").notNull().unique().default("open"),
  description: text("description"),
});
