"use server";

import { auth } from "@/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { productDemands } from "@/db/schema/orders";
import { products } from "@/db/schema/products";
import { revalidatePath } from "next/cache";
import { sql, eq } from "drizzle-orm";
import { getSettings } from "@/data/settings/getSettings";

export async function addOrderAction(productId: string, amount: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { error: "Oturum açmanız gerekiyor" };
  }

  const settings = await getSettings();
  const currentStatus = settings?.saleStatus?.name;

  if (currentStatus !== "open") {
    revalidatePath("/", "layout");
    return {
      error: "Sadece 'Talep Toplanıyor' aşamasında sipariş ekleyebilirsiniz.",
    };
  }

  try {
    // Fetch product atomic unit
    const [product] = await db
      .select({ minBuyGrams: products.minBuyGrams })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    const atomicAmount = product?.minBuyGrams || 50;
    const count = Math.floor(amount / atomicAmount);

    if (count < 1) {
      return { error: "Miktar en az bir birim olmalıdır" };
    }

    const orderGroupId = crypto.randomUUID();
    const now = Date.now();
    const rows = Array.from({ length: count }).map((_, i) => ({
      userId: session.user.id!, // asserted because check above
      productId,
      amount: atomicAmount,
      orderGroupId,
      status: "pending",
      createdAt: new Date(now + i), // Stagger timestamps to ensure FIFO order in window functions
    }));

    await db.insert(productDemands).values(rows as any); // Type cast might be needed if naive inference fails, but usually fine.
    // actually 'as any' is unsafe. define type or let it infer.
    // productDemands schema expects: userId, productId, amount, orderGroupId, status.
    // All provided.

    // Calculate new totals to return for optimistic update
    const result = await db.execute(sql`
      SELECT 
        SUM(amount) as total_demand,
        (SELECT min_buy_threshold FROM products WHERE id = ${productId}) as min_buy_threshold
      FROM product_demands 
      WHERE product_id = ${productId} AND deleted_at IS NULL
    `);

    const stats = result.rows[0];

    revalidatePath("/taleplerim");
    revalidatePath("/", "layout");

    return {
      success: true,
      newTotalDemand: Number(stats?.total_demand || 0),
      minBuyThreshold: Number(stats?.min_buy_threshold || 0),
    };
  } catch (error) {
    console.error("Error adding order:", error);
    return { error: "Talep oluşturulurken bir hata oluştu" };
  }
}
