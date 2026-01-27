import { db } from "@/db";
import { CircleAlert, TriangleAlert } from "lucide-react";
import { userAddresses } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { AddressItem } from "@/components/profile/address/AddressItem";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AddressesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/giris-yap");
  }

  const data = await db
    .select()
    .from(userAddresses)
    .where(eq(userAddresses.isActive, true))
    .orderBy(desc(userAddresses.isDefault), desc(userAddresses.updatedAt));

  return (
    <section className="flex flex-col gap-4">
      <header className="flex justify-between">
        <h3 className="text-violet-700 leading-none font-medium">ADRESLERİM</h3>
        <Link
          href="/profil/adreslerim/adres-ekle"
          className="w-30 h-8 rounded bg-violet-700 hover:bg-violet-600 text-sm flex items-center justify-center text-muted"
        >
          ADRES EKLE
        </Link>
      </header>
      {data.length > 0 && (
        <div className="bg-yellow-500/75 text-yellow-900 text-sm p-3 rounded flex gap-2">
          <div>
            <CircleAlert size={16} />
          </div>
          <p className="leading-none">
            Kurumsal bilgilerinizi sadece düzenleme yaparken görebilirsiniz
          </p>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {data.length > 0 ? (
          data.map((item) => <AddressItem item={item} key={item.id} />)
        ) : (
          <div className="flex gap-2 text-sm rounded p-4 border border-red-500 bg-red-500/10">
            <div className="text-red-700">
              <TriangleAlert className="size-4" />
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="leading-none text-red-700 font-semibold">
                KAYITLI ADRES BULUNAMADI
              </h4>
              <p className="text-foreground/80 text-sm">
                Maresans&apos;tan alışveriş yapabilmek için en az 1 adres
                eklemeniz gerekiyor
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
