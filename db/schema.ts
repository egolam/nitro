import { InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const userTypeEnum = pgEnum("user_type", ["individual", "corporate"]);

export const genderEnum = pgEnum("gender", [
  "male",
  "female",
  "unisex",
  "unassigned",
]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  phoneNumber: text("phone_number").unique(),
  phoneNumberVerified: boolean("phone_number_verified"),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("accounts_userId_idx").on(table.userId)],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  users: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("sessions_userId_idx").on(table.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  users: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)],
);

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
  },
  (t) => [
    index("idx_product_gender").on(t.gender),
    index("idx_product_factory_name").on(t.factoryName),
    index("idx_product_perfume").on(t.perfume),
    index("idx_product_brand").on(t.brand),
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

export const favourites = pgTable(
  "favorites",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.productId] }),
    index("idx_favorites_user_id").on(t.userId),
    index("idx_favorites_product_id").on(t.productId),
    uniqueIndex("fav_unique").on(t.userId, t.productId),
  ],
);

export const userAddresses = pgTable(
  "user_addresses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    sameAddress: boolean("same_address").notNull().default(true),
    userType: userTypeEnum("user_type").notNull().default("individual"),

    name: text("name").notNull(),
    nameBill: text("name_bill").notNull().default(""),
    surname: text("surname").notNull(),
    surnameBill: text("surname_bill").notNull().default(""),
    phone: text("phone").notNull(),
    phoneBill: text("phone_bill").notNull(),

    province: text("province").notNull(),
    provinceBill: text("province_bill").notNull().default(""),
    district: text("district").notNull(),
    districtBill: text("district_bill").notNull().default(""),

    addressLine: text("address_line").notNull(),
    addressLineBill: text("address_line_bill").notNull().default(""),

    firmName: text("firm_name").notNull().default(""),
    taxOffice: text("tax_office").notNull().default(""),
    taxId: text("tax_id").notNull().default(""),

    isDefault: boolean("is_default").notNull().default(true),
    isActive: boolean("is_active").notNull().default(true),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [index("idx_user_addresses_user_id").on(t.userId)],
);

export type UserAddress = InferSelectModel<typeof userAddresses>;
export type NewUserAddress = InferSelectModel<typeof userAddresses>;

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

export const favouritesRelations = relations(favourites, ({ one }) => ({
  user: one(users, {
    fields: [favourites.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [favourites.productId],
    references: [products.id],
  }),
}));

export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
  user: one(users, {
    fields: [userAddresses.userId],
    references: [users.id],
  }),
}));

export const productFillsRelations = relations(productFills, ({ one }) => ({
  product: one(products, {
    fields: [productFills.productId],
    references: [products.id],
  }),
}));
