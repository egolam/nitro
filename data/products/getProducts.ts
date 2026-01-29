import { db } from "@/db";
import { products, favourites, productTags, tags, settings } from "@/db/schema";
import { and, desc, lt, eq, exists, sql, inArray } from "drizzle-orm";
import { getExchangeRate } from "@/lib/exchange-rate";
import { calculateProductPricePerGram, roundPrice } from "@/lib/pricing";

export type ProductWithMeta = {
  id: string;
  factoryName: string;
  brand: string;
  perfume: string;
  gender: "male" | "female" | "unisex" | "unassigned" | null;
  image: string | null;
  slug: string;
  minBuyGrams: number;
  minBuyThreshold: number;
  totalDemand: number;

  price: {
    amountCents: number;
    currency: string;
    unitValue: number;
    unitType: string;
    // Calculated fields
    pricePerGram?: number;
    minBuyPrice?: number;
    priceCurrency?: string;
  } | null;

  tags: {
    id: number;
    name: string;
  }[];

  isFavorite: boolean;
};

export async function getProducts(
  userId?: string,
  options?: {
    cursor?: number | null;
    limit?: number;
    gender?: "male" | "female" | "unisex" | null;
    favoritesOnly?: boolean;
    search?: string;
    tags?: string[];
  },
): Promise<{ data: ProductWithMeta[]; nextCursor: number | null }> {
  const limit = options?.limit ?? 8;
  const cursor = options?.cursor ?? 0;
  const gender = options?.gender;
  const favoritesOnly = options?.favoritesOnly;

  const data = await db.query.products.findMany({
    orderBy: (products, { desc, sql }) => [
      desc(sql`total_demand`),
      desc(products.createdAt),
    ],
    limit: limit + 1,
    offset: cursor,
    where: and(
      gender ? eq(products.gender, gender) : undefined,
      favoritesOnly && userId
        ? exists(
            db
              .select()
              .from(favourites)
              .where(
                and(
                  eq(favourites.productId, products.id),
                  eq(favourites.userId, userId),
                ),
              ),
          )
        : undefined,
      options?.search
        ? sql`${products.searchVector} @@ to_tsquery('simple', ${options.search
            .trim()
            .split(/\s+/)
            .map((term) => `${term}:*`)
            .join(" & ")})`
        : undefined,
      ...(options?.tags && options.tags.length > 0
        ? options.tags.map((tag) =>
            exists(
              db
                .select()
                .from(productTags)
                .innerJoin(tags, eq(productTags.tagId, tags.id))
                .where(
                  and(
                    eq(productTags.productId, products.id),
                    eq(tags.name, tag),
                  ),
                ),
            ),
          )
        : []),
    ),
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
      favourites: userId
        ? {
            where: (fav, { eq }) => eq(fav.userId, userId),
          }
        : undefined,
    },
  });

  const hasMore = data.length > limit;
  const slicedData = hasMore ? data.slice(0, limit) : data;
  const nextCursor = hasMore ? cursor + limit : null;

  const [appSettings] = await db.select().from(settings).limit(1);
  const exchangeRate = await getExchangeRate();

  return {
    data: slicedData.map((p) => {
      let pricePerGram = 0;
      let minBuyPrice = 0;

      if (p.price && appSettings) {
        pricePerGram = calculateProductPricePerGram(
          p.price.amountCents,
          {
            vat: appSettings.vat,
            profitMargin: appSettings.profitMargin,
            discount: appSettings.discount,
          },
          exchangeRate,
        );
        minBuyPrice = pricePerGram * p.minBuyGrams;
      }

      return {
        id: p.id,
        factoryName: p.factoryName,
        brand: p.brand,
        perfume: p.perfume,
        gender: p.gender,
        image: p.image,
        slug: p.slug,
        minBuyGrams: p.minBuyGrams,
        minBuyThreshold: p.minBuyThreshold,
        totalDemand: Number(p.totalDemand),
        price: p.price
          ? {
              amountCents: p.price.amountCents,
              currency: p.price.currency,
              unitValue: p.price.unitValue,
              unitType: p.price.unitType,
              pricePerGram: roundPrice(pricePerGram),
              minBuyPrice: roundPrice(minBuyPrice),
              priceCurrency: "TRY",
            }
          : null,
        tags: p.tags.map((pt) => ({
          id: pt.tag.id,
          name: pt.tag.name,
        })),
        isFavorite: !!p.favourites?.length,
      };
    }),
    nextCursor,
  };
}
