import { sql } from "drizzle-orm";
import { db } from "@/db";

export type ProductWithMeta = {
  id: string;
  factoryName: string;
  brand: string;
  perfume: string;
  gender: "male" | "female" | "unisex" | "unassigned" | null;
  image: string | null;
  slug: string;
  minBuyGrams: number;

  price: {
    amount: number;
    currency: string;
    unitValue: number;
    unitType: string;
  } | null;

  tags: {
    id: string;
    name: "new" | "delux" | "featured" | "top";
  }[];

  isFavorite: boolean;
};

export async function getProducts(userId?: string) {
  const result = await db.execute<ProductWithMeta>(sql`
    SELECT
      p.id,
      p.factory_name AS "factoryName",
      p.brand,
      p.perfume,
      p.gender,
      p.image,
      p.slug,
      p.min_buy_grams AS "minBuyGrams",

      json_build_object(
        'amount', pr.amount_cents,
        'currency', pr.currency,
        'unitValue', pr.unit_value,
        'unitType', pr.unit_type
      ) AS price,

      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', t.id,
            'name', t.name
          )
        ) FILTER (WHERE t.id IS NOT NULL),
        '[]'
      ) AS tags,

      ${
        userId
          ? sql`CASE WHEN f.product_id IS NOT NULL THEN true ELSE false END`
          : sql`false`
      } AS "isFavorite"

    FROM products p

    LEFT JOIN product_prices pr
      ON pr.product_id = p.id

    LEFT JOIN product_tags pt
      ON pt.product_id = p.id

    LEFT JOIN tags t
      ON t.id = pt.tag_id

    ${
      userId
        ? sql`
          LEFT JOIN favorites f
            ON f.product_id = p.id
           AND f.user_id = ${userId}
        `
        : sql``
    }

    GROUP BY
      p.id,
      pr.amount_cents,
      pr.currency,
      pr.unit_value,
      pr.unit_type,
      ${userId ? sql`f.product_id` : sql`p.id`}

    ORDER BY p.created_at DESC
    LIMIT 9
  `);

  return result.rows;
}
