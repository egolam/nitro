"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { productDemands } from "@/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteOrderAction(productId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { error: "Oturum açmanız gerekiyor" };
  }

  try {
    const [latestOrder] = await db
      .select({ id: productDemands.id })
      .from(productDemands)
      .where(
        and(
          eq(productDemands.userId, session.user.id),
          eq(productDemands.productId, productId),
          isNull(productDemands.deletedAt),
        ),
      )
      .orderBy(desc(productDemands.createdAt))
      .limit(1);

    if (!latestOrder) {
      return { error: "Silinecek talep bulunamadı" };
    }

    await db
      .update(productDemands)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(productDemands.id, latestOrder.id));

    revalidatePath("/taleplerim");
    revalidatePath("/", "layout"); // Revalidate all pages since demand totals affect global UI
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { error: "Bir hata oluştu" };
  }
}
