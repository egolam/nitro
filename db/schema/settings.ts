import {
  pgTable,
  integer,
  doublePrecision,
  serial,
  decimal,
  real,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { saleStatus } from "./sale_status";

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  saleNumber: integer("sale_number").notNull().default(0),
  discount: real("discount").notNull().default(0.2),
  vat: real("vat").notNull().default(0.2),
  profitMargin: real("profit_margin").notNull().default(0.2),
  exchangeRate: real("exchange_rate").notNull().default(43.58),
  saleStatusId: integer("sale_status_id").references(() => saleStatus.id),
  shippingPrice: real("shipping_price").notNull().default(120),
});

export const settingsRelations = relations(settings, ({ one }) => ({
  saleStatus: one(saleStatus, {
    fields: [settings.saleStatusId],
    references: [saleStatus.id],
  }),
}));
