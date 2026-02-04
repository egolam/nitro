import { db } from "@/db";
import {
  productDemandsViewSQL,
  products,
  settings as settingsSchema,
  productPrices,
} from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { cache } from "react";
import { getExchangeRate } from "@/lib/exchange-rate";
import { calculateProductPricePerGram, roundPrice } from "@/lib/pricing";

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
    })
    .from(productDemandsViewSQL)
    .innerJoin(products, eq(productDemandsViewSQL.productId, products.id))
    .where(eq(productDemandsViewSQL.userId, userId))
    .groupBy(products.id)
    .orderBy(desc(sql`max(${productDemandsViewSQL.createdAt})`));

  // Fetch settings and exchange rate
  const [appSettings] = await db.select().from(settingsSchema).limit(1);
  const exchangeRate = await getExchangeRate();

  const enhancedData = await Promise.all(
    data.map(async (item) => {
      // Fetch product price (base cost)
      const [priceRow] = await db
        .select()
        .from(productPrices)
        .where(eq(productPrices.productId, item.id));

      let pricePerGram = 0;

      if (priceRow && appSettings) {
        pricePerGram = calculateProductPricePerGram(
          priceRow.amountCents,
          {
            vat: appSettings.vat,
            profitMargin: appSettings.profitMargin,
            discount: appSettings.discount,
          },
          exchangeRate,
        );
      }

      return {
        ...item,
        pricePerGram: roundPrice(pricePerGram),
      };
    }),
  );

  return enhancedData;
});
