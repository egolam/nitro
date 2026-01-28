# Production Deployment Guide

## 1. Database Schema (Automatic)

Your application is configured to **automatically apply schema changes** when it starts.

- **How**: The `migrate-and-start.sh` script runs `npm run db:push` before starting the server.
- **Safety**: `db:push` is generally safe. It will fail if there are data conflicts (e.g., dropping a column with data), preventing accidental data loss.

## 2. Environment Variables

Ensure these are set in Dokploy:

- `DATABASE_URL`: Connection string to your production PostgreSQL.
- `BETTER_AUTH_SECRET`: Random string for auth security.
- `BETTER_AUTH_URL`: Your full production domain (e.g. `https://myapp.com`).

---

## 3. Inserting Real Products (Data)

**⚠️ WARNING: Do NOT use `SEED_ON_START=true` in production unless you want to WIPE your database.** The current `db/seed.ts` is for development testing only.

### Option A: Drizzle Studio (Recommended for < 50 products)

You can manage your production database from your local machine using Drizzle Studio.

1. Update your local `.env` file's `DATABASE_URL` to point to your **PRODUCTION** database temporarily.
2. Run:
   ```bash
   npm run db:std
   ```
3. A web interface will open. You can manually add rows to the `products`, `prices`, etc. tables.
4. **Important**: Revert your local `.env` back to localhost after you are done.

### Option B: Production Seed Script (Recommended for bulk import)

If you have a CSV or JSON of real products, we should create a new script (e.g., `db/seed-prod.ts`) that **upserts** (adds or updates) data without deleting everything.

**Template for `db/seed-prod.ts`**:

```typescript
import { db } from ".";
import { products, productPrices } from "./schema";

const REAL_PRODUCTS = [
  {
    stockId: "SKU-001",
    factoryName: "Real Factory",
    brand: "Chanel",
    perfume: "No 5",
    price: 15000 // cents
  },
  // ... more products
];

async function main() {
  for (const p of REAL_PRODUCTS) {
    // 1. Create Product
    const [inserted] = await db.insert(products).values({ ... }).onConflictDoNothing().returning();

    // 2. Add Price
    if (inserted) {
        await db.insert(productPrices).values({ ... });
    }
  }
}
main();
```

You can run this locally against production DB: `npx tsx db/seed-prod.ts`.

### Option C: Admin Panel

Long-term, you should build an `/admin` page in the app to create products via a UI.

---

## 4. Troubleshooting

### Error: `getaddrinfo ENOTFOUND ...`

If you see an error like `[cause]: Error: getaddrinfo ENOTFOUND maresans-db-olf0ie` in your logs, your application **cannot find the database**.

**Cause**: The `DATABASE_URL` environment variable is pointing to a hostname that does not exist or is not accessible from the application container.

**Solution**:

1. Go to your **Database** dashboard in Dokploy.
2. Find the **Internal Host** or **Service Name**. It is usually the name of the database service (e.g., `postgres` or `maresans-db`).
3. If your App and Database are in the **same project/network** in Dokploy, use the **service name** as the hostname.
   - Example DB Service Name: `my-db`
   - Correct URL: `postgres://user:pass@my-db:5432/db_name`
4. If you copied the "Internal URL" from Dokploy, ensure it is exactly correct.
5. **Redeploy** the application after changing the environment variable.
