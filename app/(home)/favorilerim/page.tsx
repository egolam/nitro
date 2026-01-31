import { getProductsAction } from "@/actions/shop/products/getProductsAction";
import { ProductList } from "@/components/products/ProductList";
import { SearchInput } from "@/components/products/SearchInput";
import { TagFilter } from "@/components/products/TagFilter";
import { auth } from "@/auth";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSettings } from "@/data/settings/getSettings";

export const metadata = {
  title: "Favorilerim | MARESANS",
};

export default async function FavoritesPage() {
  const queryClient = new QueryClient();

  // Prefetch first page
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["products", null, { favoritesOnly: true }], // Match key in ProductList
    queryFn: ({ pageParam }) =>
      getProductsAction(pageParam as number | null, null, true),
    initialPageParam: 0,
  });

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/giris-yap");
  }

  const settings = await getSettings();
  const canAddOrder = settings?.saleStatus?.name === "open";

  return (
    <section className="max-w-5xl flex-1 pt-4 flex flex-col gap-4 w-full">
      <header className="flex flex-col gap-4">
        <h3 className="text-violet-700 leading-none font-medium">
          FAVORİLERİM
        </h3>
        <div className="w-full flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <TagFilter />
          <div className="w-full sm:w-1/5">
            <SearchInput />
          </div>
        </div>
      </header>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductList
          userId={session?.user.id}
          favoritesOnly
          canAddOrder={canAddOrder}
        />
      </HydrationBoundary>
    </section>
  );
}
