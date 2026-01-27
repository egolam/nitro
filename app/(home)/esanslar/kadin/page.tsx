import { ProductList } from "@/components/products/ProductList";
import { SearchInput } from "@/components/products/SearchInput";
import { TagFilter } from "@/components/products/TagFilter";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getProductsAction } from "@/actions/shop/products/getProductsAction";

export default async function KadinPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["products", "female"],
    queryFn: ({ pageParam }) =>
      getProductsAction(pageParam as string | null, "female"),
    initialPageParam: null,
  });

  const { data: session } = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  return (
    <section className="max-w-7xl flex-1 pt-4 flex flex-col gap-4">
      <header className="flex flex-col gap-4">
        <h3 className="text-violet-700 leading-none font-medium">
          KADIN ESANSLAR
        </h3>
        <div className="w-full flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <TagFilter />
          <div className="w-full sm:w-1/3">
            <SearchInput />
          </div>
        </div>
      </header>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductList userId={session?.user.id} />
      </HydrationBoundary>
    </section>
  );
}
