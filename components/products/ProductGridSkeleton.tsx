import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";

export function ProductGridSkeleton() {
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
