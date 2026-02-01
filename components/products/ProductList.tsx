"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { useInView } from "react-intersection-observer";
import { getProductsAction } from "@/actions/shop/products/getProductsAction";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";

type ProductListProps = {
  userId?: string;
  favoritesOnly?: boolean;
  canAddOrder?: boolean;
};

import { usePathname, useSearchParams } from "next/navigation";

export function ProductList({
  userId,
  favoritesOnly,
  canAddOrder = true,
}: ProductListProps) {
  const { ref, inView } = useInView();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  let gender: "male" | "female" | "unisex" | null = null;
  if (pathname.includes("/erkek")) gender = "male";
  else if (pathname.includes("/kadin")) gender = "female";
  else if (pathname.includes("/unisex")) gender = "unisex";

  const reverseMapping: Record<string, string> = {
    yeni: "new",
    delux: "delux",
  };

  const urlTags = searchParams.get("filtre")?.split(",") || [];
  const internalTags = urlTags.map((t) => reverseMapping[t]).filter(Boolean);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: [
      "products",
      gender,
      { favoritesOnly },
      searchParams.get("q"),
      internalTags,
    ],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const res = await getProductsAction(
        pageParam,
        gender,
        favoritesOnly,
        searchParams.get("q") ?? undefined,
        internalTags.length > 0 ? internalTags : undefined,
      );
      return res;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === "error") {
    toast.error("Ürünler yüklenirken bir hata oluştu");
  }

  const products = data?.pages.flatMap((page: any) => page.data) ?? [];

  if (status === "pending" || (isFetching && !isFetchingNextPage)) {
    return (
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <li key={i}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded border border-dashed h-full">
        <p className="text-lg font-medium text-muted-foreground">
          Aradığınız kriterlere uygun ürün bulunamadı.
        </p>
        <p className="text-muted-foreground/80 mt-1">
          Farklı bir arama terimi veya filtre deneyebilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <li key={product.id} className="">
          <ProductCard
            product={product}
            userId={userId}
            canAddOrder={canAddOrder}
          />
        </li>
      ))}
      {(isFetchingNextPage || hasNextPage) && (
        <>
          {isFetchingNextPage &&
            Array.from({ length: 4 }).map((_, i) => (
              <li key={`skeleton-${i}`}>
                <ProductCardSkeleton />
              </li>
            ))}
          <li
            ref={ref}
            className="col-span-full py-4 text-center text-muted-foreground h-10"
          >
            {!isFetchingNextPage && hasNextPage ? "Daha fazla yükle" : ""}
          </li>
        </>
      )}
    </ul>
  );
}
