"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DeleteOrderButton } from "@/components/products/DeleteOrderButton";
import { useStatusStore } from "@/store/useStatusStore";

type Order = {
  id: string;
  amount: number;
  validAmount: number;
  pendingAmount: number;
  createdAt: Date;
  totalDemand: number;
  product: {
    id: string;
    factoryName: string;
    brand: string;
    perfume: string;
    image: string | null;
    minBuyGrams: number;
    minBuyThreshold: number;
  };
};

export function OrderList({
  orders,
  canDelete,
}: {
  orders: Order[];
  canDelete: boolean;
}) {
  const searchParams = useSearchParams();

  const q = searchParams.get("q")?.toLowerCase() || "";
  const { status } = useStatusStore();

  const filteredOrders = orders.filter((order) => {
    // Search Filter
    if (q) {
      const searchString =
        `${order.product.factoryName} ${order.product.brand} ${order.product.perfume}`.toLowerCase();
      if (!searchString.includes(q)) return false;
    }

    // Status Filter
    if (status === "valid") return order.validAmount > 0;
    if (status === "pending") return order.pendingAmount > 0;

    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/20 rounded border border-dashed">
          <p className="text-lg font-medium text-muted-foreground">
            {q
              ? "Aramanızla eşleşen talep bulunamadı."
              : "Bu kriterlere uygun talep bulunmuyor."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-background rounded overflow-hidden justify-between flex flex-col shadow-lg h-50 p-4"
            >
              <div className="flex gap-2 justify-between">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 bg-muted rounded-xs overflow-hidden shrink-0">
                    {order.product.image && (
                      <Image
                        src={order.product.image}
                        alt={order.product.factoryName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm line-clamp-1">
                      {order.product.factoryName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {order.product.brand} - {order.product.perfume}
                    </p>
                  </div>
                </div>

                {canDelete && <DeleteOrderButton productId={order.id} />}
              </div>
              <div className="flex *:flex-1 gap-2">
                <Badge
                  variant="valid"
                  className="capitalize text-sm px-2 rounded-xs text-muted"
                >
                  {order.validAmount}gr Geçerli
                </Badge>

                <Badge
                  variant="pending"
                  className="capitalize text-sm px-2 rounded-xs text-muted"
                >
                  {order.pendingAmount}gr Beklemede
                </Badge>
              </div>

              {/* Price Display */}
              {(order as any).pricePerGram > 0 && (
                <div className="flex justify-between items-center text-sm border-t pt-2 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      Birim Fiyat (1gr)
                    </span>
                    <span className="font-medium">
                      {(order as any).pricePerGram.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">
                      Toplam Tutar
                    </span>
                    <span className="font-bold text-violet-700">
                      {(order as any).totalPrice.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </span>
                  </div>
                </div>
              )}

              <div className="border-t flex justify-between items-center text-xs text-muted-foreground pt-4">
                <span>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("tr-TR")
                    : "-"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
