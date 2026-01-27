import { relations, sql } from "drizzle-orm";
import {
  boolean,
  customType,
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { genderEnum } from "./enums";
import { favourites } from "./users";

const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    stockId: text("sku").notNull().unique(),
    factoryName: text("factory_name").notNull(),
    perfume: text("perfume").notNull(),
    brand: text("brand").notNull(),
    slug: text("slug").notNull().unique(),
    image: text("image").default(
      "https://content.maresans.com/images/product1.webp",
    ),
    description: text("description").default("tarafıdan üretilmiştir"),
    gender: genderEnum().default("unassigned"),
    minBuyGrams: integer("min_buy_grams").notNull().default(50),
    minBuyThreshold: integer("min_buy_threshold").notNull().default(1000),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    searchVector: tsvector("search_vector")
      .generatedAlwaysAs(
        sql`to_tsvector('simple', coalesce(brand, '') || ' ' || coalesce(perfume, '') || ' ' || coalesce(factory_name, '') || ' ' || coalesce(sku, ''))`,
      )
      .notNull(),
  },
  (t) => [
    index("idx_product_gender").on(t.gender),
    index("idx_product_factory_name").on(t.factoryName),
    index("idx_product_perfume").on(t.perfume),
    index("idx_product_brand").on(t.brand),
    index("idx_product_search").using("gin", t.searchVector),
  ],
);

export const manufacturers = pgTable("manufacturers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const productManufacturers = pgTable(
  "product_manufacturers",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    manufacturerId: serial("manufacturer_id")
      .notNull()
      .references(() => manufacturers.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.manufacturerId] }),
    index("idx_product_manufacturers_product_id").on(t.productId),
    index("idx_product_manufacturers_manufacturer_id").on(t.manufacturerId),
  ],
);

export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const productCertificates = pgTable(
  "product_certificates",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    certificateId: serial("certificate_id")
      .notNull()
      .references(() => certificates.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.certificateId] }),
    index("idx_product_certificates_product_id").on(t.productId),
    index("idx_product_certificates_certificate_id").on(t.certificateId),
  ],
);

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const productTags = pgTable(
  "product_tags",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    tagId: serial("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.tagId] }),
    index("idx_product_tags_product_id").on(t.productId),
    index("idx_product_tags_tag_id").on(t.tagId),
  ],
);

export const productPrices = pgTable("product_prices", {
  id: serial("id").primaryKey(),

  productId: uuid("product_id")
    .notNull()
    .unique()
    .references(() => products.id, { onDelete: "cascade" }),

  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull().default("usd"),

  unitValue: integer("unit_value").notNull().default(1),
  unitType: text("unit_type").notNull().default("kg"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const productFills = pgTable("product_fills", {
  id: serial("id").primaryKey(),

  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" })
    .unique(), // ✅ one fill record per product

  isFinished: boolean("is_finished").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const productStorage = pgTable("product_storage", {
  id: serial("id").primaryKey(),

  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" })
    .unique(),

  rackNumber: integer("rack_number").notNull().default(0),
  row: text("row").notNull().default("unassigned"),
});

// RELATIONS

export const productsRelations = relations(products, ({ one, many }) => ({
  price: one(productPrices),

  fill: one(productFills),
  storage: one(productStorage),

  manufacturers: many(productManufacturers),
  certificates: many(productCertificates),
  tags: many(productTags),

  favourites: many(favourites),
}));

export const productPricesRelations = relations(productPrices, ({ one }) => ({
  product: one(products, {
    fields: [productPrices.productId],
    references: [products.id],
  }),
}));

export const productStorageRelations = relations(productStorage, ({ one }) => ({
  product: one(products, {
    fields: [productStorage.productId],
    references: [products.id],
  }),
}));

export const manufacturersRelations = relations(manufacturers, ({ many }) => ({
  products: many(productManufacturers),
}));

export const productManufacturersRelations = relations(
  productManufacturers,
  ({ one }) => ({
    product: one(products, {
      fields: [productManufacturers.productId],
      references: [products.id],
    }),
    manufacturer: one(manufacturers, {
      fields: [productManufacturers.manufacturerId],
      references: [manufacturers.id],
    }),
  }),
);

export const certificatesRelations = relations(certificates, ({ many }) => ({
  products: many(productCertificates),
}));

export const productCertificatesRelations = relations(
  productCertificates,
  ({ one }) => ({
    product: one(products, {
      fields: [productCertificates.productId],
      references: [products.id],
    }),
    certificate: one(certificates, {
      fields: [productCertificates.certificateId],
      references: [certificates.id],
    }),
  }),
);

export const tagsRelations = relations(tags, ({ many }) => ({
  products: many(productTags),
}));

export const productTagsRelations = relations(productTags, ({ one }) => ({
  product: one(products, {
    fields: [productTags.productId],
    references: [products.id],
  }),
  tag: one(tags, {
    fields: [productTags.tagId],
    references: [tags.id],
  }),
}));

export const productFillsRelations = relations(productFills, ({ one }) => ({
  product: one(products, {
    fields: [productFills.productId],
    references: [products.id],
  }),
}));
