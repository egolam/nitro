import { db } from "@/db";
import { products, favourites, productTags, tags, settings } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getExchangeRate } from "@/lib/exchange-rate";
import { calculateProductPricePerGram, roundPrice } from "@/lib/pricing";

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

  let pricePerGram = 0;
  let minBuyPrice = 0;

  if (data.price && appSettings) {
    pricePerGram = calculateProductPricePerGram(
      data.price.amountCents,
      {
        vat: appSettings.vat,
        profitMargin: appSettings.profitMargin,
        discount: appSettings.discount,
      },
      exchangeRate,
    );
    minBuyPrice = pricePerGram * data.minBuyGrams;
  }

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
    price: data.price
      ? {
          amountCents: data.price.amountCents,
          currency: data.price.currency,
          unitValue: data.price.unitValue,
          unitType: data.price.unitType,
          pricePerGram: roundPrice(pricePerGram),
          minBuyPrice: roundPrice(minBuyPrice),
          priceCurrency: "TRY",
        }
      : null,
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
