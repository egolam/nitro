import { getProductsAction } from "@/actions/shop/products/getProductsAction";
import { ProductList } from "@/components/products/ProductList";
import { SearchInput } from "@/components/products/SearchInput";
import { TagFilter } from "@/components/products/TagFilter";
import { authClient } from "@/lib/auth-client";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function FavorilerimPage() {
  const { data: session } = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session) {
    redirect("/giris-yap?redirectURL=/profil/favorilerim");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["products", null, { favoritesOnly: true }],
    queryFn: ({ pageParam }) =>
      getProductsAction(pageParam as string | null, null, true),
    initialPageParam: null,
  });

  return (
    <section className="flex flex-col gap-4 max-w-7xl flex-1 w-full">
      <header className="flex flex-col gap-4">
        <h3 className="text-violet-700 leading-none font-medium">
          FAVORİLERİM
        </h3>
        <div className="w-full flex justify-between items-end gap-4">
          <TagFilter />
          <div className="w-full sm:w-1/3 self-end">
            <SearchInput />
          </div>
        </div>
      </header>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductList userId={session.user.id} favoritesOnly={true} />
      </HydrationBoundary>
    </section>
  );
}
