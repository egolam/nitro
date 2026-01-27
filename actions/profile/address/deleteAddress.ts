"use server";

import { db } from "@/db";
import { userAddresses } from "@/db/schema";
import { authClient } from "@/lib/auth-client";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

type ResponseObject = {
  success: boolean;
  message: string;
};

export async function deleteAddress(id: string): Promise<ResponseObject> {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session) {
    return {
      success: false,
      message: "Yetkisiz işlem",
    };
  }

  try {
    await db
      .update(userAddresses)
      .set({ isActive: false })
      .where(
        and(
          eq(userAddresses.id, id),
          eq(userAddresses.userId, session.user.id),
          eq(userAddresses.isActive, true),
        ),
      );

    const lastAddress = await db
      .select()
      .from(userAddresses)
      .where(
        and(
          eq(userAddresses.userId, session.user.id),
          eq(userAddresses.isActive, true),
        ),
      );

    if (lastAddress.length === 1) {
      await db
        .update(userAddresses)
        .set({ isDefault: true })
        .where(eq(userAddresses.userId, session.user.id));
    }

    revalidatePath("/profil/adreslerim");

    return {
      success: true,
      message: "Adresiniz başarıyla silindi",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Bir hata oluştu",
    };
  }
}
