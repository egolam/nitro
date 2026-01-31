import { db } from ".";
import {
  accounts,
  certificates,
  favourites,
  manufacturers,
  productCertificates,
  productFills,
  productManufacturers,
  productPrices,
  products,
  productStorage,
  productTags,
  sessions,
  tags,
  userAddresses,
  users,
  verifications,
} from "./schema";

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
  "Essence Works",
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

const TAG_NAMES = ["delux", "top", "new", "featured"];
const CERTIFICATE_NAMES = ["ifra", "allergen", "msds", "coa"];

console.log("🌱 Seeding products...");

const createdProducts: string[] = [];

async function main() {

  // 🏷️ Seed Tags
  const tagIds: Record<string, number> = {};
  for (const name of TAG_NAMES) {
    let tag = await db.query.tags.findFirst({
      where: (t, { eq }) => eq(t.name, name),
    });

    if (!tag) {
      try {
        const [newTag] = await db.insert(tags).values({ name }).returning();
        tag = newTag;
      } catch (e: any) {
        // If unique constraint error, fetch again
        if (e.code === "23505" || e.message?.includes("unique")) {
          tag = await db.query.tags.findFirst({
            where: (t, { eq }) => eq(t.name, name),
          });
        }
        if (!tag) throw e; // Re-throw if still not found or other error
      }
    }
    if (!tag) throw new Error(`Tag ${name} could not be resolved`);
    tagIds[name] = tag.id;
  }
  console.log("✅ Tags seeded:", Object.keys(tagIds));

  // 📜 Seed Certificates
  const certIds: number[] = [];
  for (const name of CERTIFICATE_NAMES) {
    let cert = await db.query.certificates.findFirst({
      where: (c, { eq }) => eq(c.name, name),
    });

    if (!cert) {
      try {
        const [newCert] = await db
          .insert(certificates)
          .values({ name })
          .returning();
        cert = newCert;
      } catch (e: any) {
        if (e.code === "23505" || e.message?.includes("unique")) {
          cert = await db.query.certificates.findFirst({
            where: (c, { eq }) => eq(c.name, name),
          });
        }
        if (!cert) throw e;
      }
    }
    certIds.push(cert.id);
  }
  console.log("✅ Certificates seeded:", certIds.length);

  for (let i = 0; i < 45; i++) {
    const factoryName = randomFrom(FACTORIES);
    const brand = randomFrom(BRANDS);
    const perfume = randomFrom(PERFUMES);

    const slug = randomSlug(
      `${brand}-${perfume}-${i}-${Math.random().toString(36).substring(7)}`,
    );
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

    // 🏷️ Assign Tag
    // All products which do not have 'delux' tag, should have 'top' tag.
    const isDelux = Math.random() < 0.2;
    const tagName = isDelux ? "delux" : "top";

    // We only assign delux or top as per instructions "other tags are not needed"
    if (tagIds[tagName]) {
      await db.insert(productTags).values({
        productId: product.id,
        tagId: tagIds[tagName],
      });
    }

    // 📜 Assign Certificates (Optional)
    // Randomly assign 0 to 3 certificates
    const numCerts = Math.floor(Math.random() * 4);
    const shuffledCerts = [...certIds].sort(() => 0.5 - Math.random());
    const selectedCerts = shuffledCerts.slice(0, numCerts);

    for (const certId of selectedCerts) {
      await db.insert(productCertificates).values({
        productId: product.id,
        certificateId: certId,
      });
    }

    // 💰 price
    await db.insert(productPrices).values({
      productId: product.id,
      amountCents: Math.floor(2000 + Math.random() * 8000), // 20–100 USD
      currency: "usd",
      unitValue: 1,
      unitType: "kg",
    });
  }
}

main()
  .then(() => {
    console.log("✅ Products & prices seeded");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
