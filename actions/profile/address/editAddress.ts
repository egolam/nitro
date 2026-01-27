"use server";

import { db } from "@/db";
import { userAddresses } from "@/db/schema";
import { authClient } from "@/lib/auth-client";
import { addressSchema } from "@/schemas/address";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

export type SubmitAddressResult =
  | { success: true; message: string }
  | { success: false; message: string };

export async function editAddress(
  input: unknown,
  addressId: string,
): Promise<SubmitAddressResult> {
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

  if (!addressId) {
    return {
      success: false,
      message: "Adres bulunamadı",
    };
  }
  try {
    const { success, data } = await addressSchema.safeParseAsync(input);

    if (success) {
      if (data.isDefault === true) {
        await db
          .update(userAddresses)
          .set({ isDefault: false })
          .where(eq(userAddresses.userId, session.user.id));
      }
      await db
        .update(userAddresses)
        .set({
          userId: session.user.id,

          isDefault: data.isDefault,

          name: data.name,
          surname: data.surname,
          phone: data.phone,
          province: data.province,
          district: data.district,
          addressLine: data.addressLine,

          userType: data.userType,

          firmName: data.userType === "corporate" ? data.firmName : "",
          taxOffice: data.userType === "corporate" ? data.taxOffice : "",
          taxId: data.userType === "corporate" ? data.taxId : "",

          sameAddress: data.sameAddress,

          nameBill: !data.sameAddress ? data.nameBill : "",
          surnameBill: !data.sameAddress ? data.surnameBill : "",
          phoneBill: !data.sameAddress ? data.phoneBill : "",
          provinceBill: !data.sameAddress ? data.provinceBill : "",
          districtBill: !data.sameAddress ? data.districtBill : "",
          addressLineBill: !data.sameAddress ? data.addressLineBill : "",
        })
        .where(
          and(
            eq(userAddresses.id, addressId),
            eq(userAddresses.userId, session.user.id),
          ),
        );
    } else {
      return {
        message: "Eksik bilgi girdiniz",
        success: false,
      };
    }

    revalidatePath("/profil/adreslerim");
    return { success: true, message: "Adres başarıyla güncellendi" };
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err);
      return {
        success: false,
        message: err.message,
      };
    }
    return {
      success: false,
      message: "Bir hata oluştu",
    };
  }
}
