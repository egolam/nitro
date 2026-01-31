import { ProductList } from "@/components/products/ProductList";
import { SearchInput } from "@/components/products/SearchInput";
import { TagFilter } from "@/components/products/TagFilter";
import { auth } from "@/auth";
import { headers } from "next/headers";

import { getSettings } from "@/data/settings/getSettings";

export default async function MalePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const settings = await getSettings();
  const canAddOrder = settings?.saleStatus?.name === "open";

  return (
    <section className="max-w-5xl flex-1 pt-4 flex flex-col gap-4 w-full">
      <header className="flex flex-col gap-4">
        <h3 className="text-violet-700 leading-none font-medium">
          ERKEK ESANSLAR
        </h3>
        <div className="w-full flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <TagFilter />
          <div className="w-full sm:w-1/5">
            <SearchInput />
          </div>
        </div>
      </header>
      <ProductList userId={session?.user.id} canAddOrder={canAddOrder} />
    </section>
  );
}
