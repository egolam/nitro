"use server";

import { db } from "@/db";
import { userAddresses } from "@/db/schema";
import { authClient } from "@/lib/auth-client";
import { addressSchema } from "@/schemas/address";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

export type SubmitAddressResult =
  | { success: true; message: string }
  | { success: false; message: string };

export async function addAddress(input: unknown): Promise<SubmitAddressResult> {
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
    const { success, data } = await addressSchema.safeParseAsync(input);

    if (success) {
      if (data.isDefault === true) {
        await db
          .update(userAddresses)
          .set({ isDefault: false })
          .where(eq(userAddresses.userId, session.user.id));
      }
      await db.insert(userAddresses).values({
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
      });
    }

    revalidatePath("/profil/adreslerim");
    return { success: true, message: "Adres başarıyla kaydedildi" };
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
