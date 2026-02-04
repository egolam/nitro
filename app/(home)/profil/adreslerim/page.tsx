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
    redirect("/giris-yap?redirectURL=/profil/adreslerim");
  }

  const data = await db
    .select()
    .from(userAddresses)
    .where(eq(userAddresses.isActive, true))
    .orderBy(desc(userAddresses.isDefault), desc(userAddresses.updatedAt));

  return (
    <section className="flex flex-col gap-4 bg-background p-4 rounded border">
      <header className="flex justify-between">
        <h3 className="text-violet-700 leading-none font-medium">ADRESLERİM</h3>
        <Link
          href="/profil/adreslerim/adres-ekle"
          className="w-30 h-9 rounded bg-violet-700 hover:bg-violet-600 text-sm flex items-center justify-center text-muted"
        >
          ADRES EKLE
        </Link>
      </header>
      {data.length > 0 && (
        <div className="bg-blue-500/50 text-blue-700 text-sm p-3 rounded flex gap-2">
          <div>
            <CircleAlert size={16} />
          </div>
          <p className="leading-none">
            Kurumsal bilgilerinizi sadece düzenleme yaparken görebilirsiniz
          </p>
        </div>
      )}
      <div className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.length > 0 ? (
          data.map((item) => <AddressItem item={item} key={item.id} />)
        ) : (
          <div className="flex col-span-2 gap-2 text-sm rounded p-4 bg-destructive text-muted">
            <div>
              <TriangleAlert className="size-4" />
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="leading-none font-semibold">
                KAYITLI ADRES BULUNAMADI
              </h4>
              <p className="text-sm">
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
