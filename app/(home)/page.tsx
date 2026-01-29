import { ProductList } from "@/components/products/ProductList";
import { SearchInput } from "@/components/products/SearchInput";
import { TagFilter } from "@/components/products/TagFilter";
import { auth } from "@/auth";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getProductsAction } from "@/actions/shop/products/getProductsAction";
import { headers } from "next/headers";
import { getSettings } from "@/data/settings/getSettings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["products"],
    queryFn: ({ pageParam }) => getProductsAction(pageParam as number | null),
    initialPageParam: 0,
  });

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const settings = await getSettings();
  const canAddOrder = settings?.saleStatus?.name === "open";

  return (
    <section className="max-w-7xl flex-1 pt-4 flex flex-col gap-4 w-full">
      <header className="flex flex-col gap-4">
        <h3 className="text-violet-700 leading-none font-medium">
          TÜM ESANSLAR
        </h3>
        <div className="w-full flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <TagFilter />
          <div className="w-full sm:w-1/3">
            <SearchInput />
          </div>
        </div>
      </header>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductList userId={session?.user.id} canAddOrder={canAddOrder} />
      </HydrationBoundary>
    </section>
  );
}
