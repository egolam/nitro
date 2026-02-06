import { db } from "@/db";
import { products, settings } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getExchangeRate } from "@/lib/exchange-rate";

export async function getProductBySlug(slug: string, userId?: string) {
  const data = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    extras: {
      totalDemand:
        sql<number>`(SELECT COALESCE(SUM(amount), 0) FROM product_demands WHERE product_id = ${products.id} AND deleted_at IS NULL)`.as(
          "total_demand",
        ),
    },
    with: {
      price: true,
      tags: {
        with: {
          tag: true,
        },
      },
      certificates: {
        with: {
          certificate: true,
        },
      },
      favourites: userId
        ? {
            where: (fav, { eq }) => eq(fav.userId, userId),
          }
        : undefined,
    },
  });

  if (!data) return null;

  const [appSettings] = await db.select().from(settings).limit(1);
  const exchangeRate = await getExchangeRate();

  return {
    id: data.id,
    sku: data.stockId,
    factoryName: data.factoryName,
    brand: data.brand,
    perfume: data.perfume,
    gender: data.gender,
    image: data.image,
    slug: data.slug,
    description: data.description,
    minBuyGrams: data.minBuyGrams,
    minBuyThreshold: data.minBuyThreshold,
    totalDemand: Number(data.totalDemand),
    price: {
      amount: data.price?.amount,
      vat: appSettings.vat,
      profitMargin: appSettings.profitMargin,
      discount: appSettings.discount,
      exchangeRate: exchangeRate,
    },
    tags: data.tags.map((pt) => ({
      id: pt.tag.id,
      name: pt.tag.name,
    })),
    certificates: data.certificates.map((c) => ({
      id: c.certificate.id,
      name: c.certificate.name,
    })),
    isFavorite: !!data.favourites?.length,
  };
}
