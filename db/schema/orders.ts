import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { products } from "./products";
import { productDemandStatusEnum } from "./enums";

export const productDemands = pgTable(
  "product_demands",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    // Group ID to link atomic rows of the same single order action
    orderGroupId: uuid("order_group_id").notNull(),

    // The atomic amount (e.g. 50 grams)
    amount: integer("amount").notNull().default(50),

    // Status can be 'pending', 'valid', etc.
    status: productDemandStatusEnum("status").notNull().default("pending"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [
    index("idx_product_demands_product_id").on(t.productId),
    index("idx_product_demands_user_id").on(t.userId),
    index("idx_product_demands_group_id").on(t.orderGroupId),
    index("idx_product_demands_created_at").on(t.createdAt), // Critical for FIFO
  ],
);

export const productDemandsRelations = relations(productDemands, ({ one }) => ({
  user: one(users, {
    fields: [productDemands.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [productDemands.productId],
    references: [products.id],
  }),
}));

import { sql } from "drizzle-orm";
import { pgView } from "drizzle-orm/pg-core";

// export const productDemandsView = pgView("product_demands_view").as((qb) => {
//   return qb
//     .select({
//       id: productDemands.id,
//       userId: productDemands.userId,
//       productId: productDemands.productId,
//       amount: productDemands.amount,
//       createdAt: productDemands.createdAt,
//
//       // Window function to calculate running total
//       runningTotal:
//         sql<number>`sum(${productDemands.amount}) OVER (PARTITION BY ${productDemands.productId} ORDER BY ${productDemands.createdAt})`.as(
//           "running_total",
//         ),
//
//       // Total demand for the product (partitioned)
//       totalDemand:
//         sql<number>`sum(${productDemands.amount}) OVER (PARTITION BY ${productDemands.productId})`.as(
//           "total_demand",
//         ),
//
//       // Product threshold joined (we need to join manually in SQL if QB doesn't support complex window interaction easily, but here we can try)
//       // Actually, joining inside the view definition is cleaner if we use raw SQL for the whole thing for complexity.
//       // Drizzle QB with window functions + joins is verbose.
//       // Let's use the sql template capability for the entire view logic to be safe and clear.
//     })
//     .from(productDemands);
// });

// Better approach: Pure SQL definition for complex logic
export const productDemandsViewSQL = pgView("product_demands_view", {
  id: uuid("id"),
  userId: text("user_id"),
  productId: uuid("product_id"),
  amount: integer("amount"),
  createdAt: timestamp("created_at"),
  minBuyThreshold: integer("min_buy_threshold"),
  validAmount: integer("valid_amount"),
  pendingAmount: integer("pending_amount"),
}).as(
  sql`
    SELECT
      sub.id,
      sub.user_id,
      sub.product_id,
      sub.amount,
      sub.created_at,
      sub.min_buy_threshold,
      GREATEST(0, LEAST(sub.running_total, sub.valid_limit) - (sub.running_total - sub.amount))::integer as valid_amount,
      (sub.amount - GREATEST(0, LEAST(sub.running_total, sub.valid_limit) - (sub.running_total - sub.amount)))::integer as pending_amount
    FROM (
      SELECT
        pd.id,
        pd.user_id,
        pd.product_id,
        pd.amount,
        pd.created_at,
        p.min_buy_threshold,
        SUM(pd.amount) OVER (PARTITION BY pd.product_id ORDER BY pd.created_at, pd.id) as running_total,
        FLOOR(SUM(pd.amount) OVER (PARTITION BY pd.product_id) / NULLIF(p.min_buy_threshold, 0)) * p.min_buy_threshold as valid_limit
      FROM ${productDemands} pd
      JOIN ${products} p ON pd.product_id = p.id
      WHERE pd.deleted_at IS NULL
    ) sub
  `,
);
