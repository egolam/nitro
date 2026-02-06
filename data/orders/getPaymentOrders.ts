import { db } from "@/db";
import {
  productDemands,
  products,
  productPrices,
  settings as settingsSchema,
} from "@/db/schema";
import { eq, desc, sql, and, isNull } from "drizzle-orm";
import { cache } from "react";
import { getExchangeRate } from "@/lib/exchange-rate";

export const getPaymentOrders = cache(async (userId: string) => {
  const data = await db
    .select({
      id: products.id,
      amount: sql<number>`sum(${productDemands.amount})`.mapWith(Number),
      // For payment orders, validAmount is effectively the total amount associated with this status
      validAmount: sql<number>`sum(${productDemands.amount})`.mapWith(Number),
      pendingAmount: sql<number>`0`.mapWith(Number), // No pending amount for payment status
      createdAt: sql<Date>`max(${productDemands.createdAt})`,
      totalDemand: sql<number>`0`.mapWith(Number), // Not needed for this view but keeping shape if reused
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
    .from(productDemands)
    .innerJoin(products, eq(productDemands.productId, products.id))
    .where(
      and(
        eq(productDemands.userId, userId),
        eq(productDemands.status, "payment"),
        isNull(productDemands.deletedAt),
      ),
    )
    .groupBy(products.id)
    .orderBy(desc(sql`max(${productDemands.createdAt})`));

  // Fetch settings and exchange rate
  const [appSettings] = await db.select().from(settingsSchema).limit(1);
  const exchangeRate = await getExchangeRate();

  // Enhance data with price calculations
  const enhancedData = await Promise.all(
    data.map(async (item) => {
      // Fetch product price (base cost)
      const [priceRow] = await db
        .select()
        .from(productPrices)
        .where(eq(productPrices.productId, item.id));

      return {
        ...item,
        price: priceRow
          ? {
              amount: priceRow.amount,
              vat: appSettings?.vat ?? 0,
              profitMargin: appSettings?.profitMargin ?? 0,
              discount: appSettings?.discount ?? 0,
              exchangeRate: exchangeRate,
            }
          : undefined,
        currency: "TRY",
      };
    }),
  );

  return {
    orders: enhancedData,
    shippingPrice: appSettings?.shippingPrice ?? 150,
  };
});
