import { auth } from "@/auth";
import { AddAddressForm } from "@/components/profile/address/AddAddressForm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AddAddressPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/giris-yap?redirectURL=/profil/adreslerim/adres-ekle");
  }

  return (
    <section className="flex flex-col gap-4">
      <header className="flex justify-between">
        <h3 className="text-violet-700 leading-none font-medium">ADRES EKLE</h3>
      </header>
      <AddAddressForm isEditing={false} />
    </section>
  );
}
