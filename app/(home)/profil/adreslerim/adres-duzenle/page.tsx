import { auth } from "@/auth";
import { AddAddressForm } from "@/components/profile/address/AddAddressForm";
import { db } from "@/db";
import { userAddresses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function EditAddressPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const addressId = (await searchParams).id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(
      `/giris-yap?redirectURL=/profil/adreslerim/adres-duzenle?id=${addressId}`,
    );
  } else if (!addressId) {
    redirect("/");
  }

  const data = await db
    .select()
    .from(userAddresses)
    .where(eq(userAddresses.id, addressId))
    .limit(1);

  return (
    <section className="flex flex-col gap-4">
      <header className="flex justify-between">
        <h3 className="text-violet-700 leading-none">ADRES DÜZENLE</h3>
      </header>
      <AddAddressForm
        isEditing={true}
        address={data[0]}
        addressId={addressId}
      />
    </section>
  );
}
