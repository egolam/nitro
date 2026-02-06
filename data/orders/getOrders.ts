import { db } from "@/db";
import {
  productDemandsViewSQL,
  products,
  settings,
  productPrices,
} from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { cache } from "react";
import { getExchangeRate } from "@/lib/exchange-rate";

export const getOrders = cache(async (userId: string) => {
  const data = await db
    .select({
      id: products.id, // Use product ID as the key for the merged card
      amount: sql<number>`sum(${productDemandsViewSQL.amount})`.mapWith(Number),
      validAmount:
        sql<number>`sum(${productDemandsViewSQL.validAmount})`.mapWith(Number),
      pendingAmount:
        sql<number>`sum(${productDemandsViewSQL.pendingAmount})`.mapWith(
          Number,
        ),
      createdAt: sql<Date>`max(${productDemandsViewSQL.createdAt})`,
      totalDemand:
        sql<number>`(SELECT COALESCE(SUM(amount), 0) FROM product_demands WHERE product_id = ${products.id} AND deleted_at IS NULL)`.as(
          "total_demand",
        ),
      product: {
        id: products.id,
        factoryName: products.factoryName,
        brand: products.brand,
        perfume: products.perfume,
        image: products.image,
        minBuyGrams: products.minBuyGrams,
        minBuyThreshold: products.minBuyThreshold,
        gender: products.gender,
      },
      price: {
        amount: productPrices.amount,
      },
    })
    .from(productDemandsViewSQL)
    .innerJoin(products, eq(productDemandsViewSQL.productId, products.id))
    .innerJoin(productPrices, eq(products.id, productPrices.productId))
    .where(eq(productDemandsViewSQL.userId, userId))
    .groupBy(products.id, productPrices.id)
    .orderBy(desc(sql`max(${productDemandsViewSQL.createdAt})`));

  // Fetch settings and exchange rate
  const [appSettings] = await db.select().from(settings).limit(1);
  const exchangeRate = await getExchangeRate();

  const enhancedData = data.map((item) => {
    return {
      ...item,
      price: item.price
        ? {
            amount: item.price.amount,
            vat: appSettings?.vat ?? 0,
            profitMargin: appSettings?.profitMargin ?? 0,
            discount: appSettings?.discount ?? 0,
            exchangeRate: exchangeRate,
          }
        : undefined,
    };
  });

  return enhancedData;
});
