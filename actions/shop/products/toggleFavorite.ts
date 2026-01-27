"use server";

import { db } from "@/db";
import { favourites } from "@/db/schema";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

export async function toggleFavorite(productId: string) {
  const { data: session } = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session) {
    return { success: false, message: "Yetkisiz işlem" };
  }
  try {
    const exists = await db.query.favourites.findFirst({
      where: and(
        eq(favourites.userId, session.user.id),
        eq(favourites.productId, productId),
      ),
    });

    if (exists) {
      await db
        .delete(favourites)
        .where(
          and(
            eq(favourites.userId, session.user.id),
            eq(favourites.productId, productId),
          ),
        );

      return {
        success: true,
        isFavorite: false,
        message: "Ürün favorilerden çıkartıldı",
      };
    }

    await db.insert(favourites).values({
      userId: session.user.id,
      productId,
    });

    return {
      success: true,
      isFavorite: true,
      message: "Ürün favorilere eklendi",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      isFavorite: false,
      message: "Bir hata oluştu",
    };
  }
}
