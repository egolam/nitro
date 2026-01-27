import { db } from ".";
import { products } from "./schema";

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSku(): string {
  return Math.floor(1_000_000 + Math.random() * 9_000_000).toString();
}

function randomSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const FACTORIES = [
  "Aroma Labs",
  "Essence Factory",
  "Pure Scents Co",
  "Oriental Extracts",
  "Nordic Fragrance",
  "Amber Works",
];

const BRANDS = [
  "Noiré",
  "Veloura",
  "Maison V",
  "Scentium",
  "Olfacto",
  "Luxera",
  "Parfüme",
];

const PERFUMES = [
  "Black Oud",
  "White Musk",
  "Amber Rose",
  "Vanilla Smoke",
  "Ocean Breeze",
  "Leather Wood",
  "Citrus Bloom",
  "Midnight Iris",
  "Golden Saffron",
];

console.log("🌱 Seeding products...");

const createdProducts = [];

for (let i = 0; i < 45; i++) {
  const factoryName = randomFrom(FACTORIES);
  const brand = randomFrom(BRANDS);
  const perfume = randomFrom(PERFUMES);

  const slug = randomSlug(`${brand}-${perfume}-${i}`);
  const stockId = randomSku();

  const [product] = await db
    .insert(products)
    .values({
      stockId,
      factoryName,
      brand,
      perfume,
      slug,
      gender: randomFrom(["male", "female", "unisex"]),
      minBuyGrams: 50,
      minBuyThreshold: 1000,
      image: "https://content.maresans.com/images/product1.webp",
    })
    .returning({ id: products.id });

  createdProducts.push(product.id);

  // 💰 price
  await db.insert(productPrices).values({
    productId: product.id,
    amountCents: Math.floor(2000 + Math.random() * 8000), // 20–100 USD
    currency: "usd",
    unitValue: 1,
    unitType: "kg",
  });
}

console.log("✅ Products & prices seeded");
