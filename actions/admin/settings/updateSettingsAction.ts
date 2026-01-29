"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { productDemands, productDemandsViewSQL } from "@/db/schema/orders";
import { saleStatus } from "@/db/schema/sale_status";
import { settings } from "@/db/schema/settings";
import { settingsSchema } from "@/lib/schemas/settings";
import { and, eq, gt, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

export async function updateSettingsAction(
  data: z.infer<typeof settingsSchema>,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.role !== "admin") {
    return { error: "Yetkisiz işlem" };
  }

  const parsed = settingsSchema.safeParse(data);

  if (!parsed.success) {
    return { error: "Geçersiz veri" };
  }

  try {
    const [existing] = await db.select().from(settings).limit(1);

    if (existing) {
      await db
        .update(settings)
        .set(parsed.data)
        .where(eq(settings.id, existing.id));
    } else {
      await db.insert(settings).values(parsed.data);
    }

    // Trigger Logic for Product Demand Status
    if (parsed.data.saleStatusId) {
      const [statusRow] = await db
        .select()
        .from(saleStatus)
        .where(eq(saleStatus.id, parsed.data.saleStatusId));

      if (statusRow) {
        if (statusRow.name === "confirmed") {
          // Trigger: Pending (Valid) -> Confirmed
          // 1. Identify rows that are effectively "valid" (calculated by view)
          const validRows = await db
            .select({ id: productDemandsViewSQL.id })
            .from(productDemandsViewSQL)
            .where(gt(productDemandsViewSQL.validAmount, 0));

          const validIds = validRows
            .map((r) => r.id)
            .filter((id): id is string => id !== null);

          if (validIds.length > 0) {
            const result = await db
              .update(productDemands)
              .set({ status: "confirmed" })
              .where(
                and(
                  inArray(productDemands.id, validIds),
                  eq(productDemands.status, "pending"),
                ),
              )
              .returning({ updatedId: productDemands.id });
            console.log(
              "Updated rows count (Valid -> Confirmed):",
              result.length,
            );
          } else {
            console.log("No valid rows found to confirm.");
          }
        } else if (statusRow.name === "payment") {
          // Trigger: Confirmed -> Payment
          const result = await db
            .update(productDemands)
            .set({ status: "payment" })
            .where(eq(productDemands.status, "confirmed"))
            .returning({ updatedId: productDemands.id });
          console.log(
            "Updated rows count (Confirmed -> Payment):",
            result.length,
          );
        }
      }
    }

    revalidatePath("/");
    revalidatePath("/admin/ayarlar");

    return { success: true };
  } catch (error) {
    console.error("Settings update error:", error);
    return { error: "Ayarlar güncellenirken bir hata oluştu" };
  }
}
