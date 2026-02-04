"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DeleteOrderButton } from "@/components/products/DeleteOrderButton";
import { useStatusStore } from "@/store/useStatusStore";
import Link from "next/link";

type Order = {
  id: string;
  amount: number;
  validAmount: number;
  pendingAmount: number;
  createdAt: Date;
  totalDemand: number;
  pricePerGram: number;
  product: {
    id: string;
    factoryName: string;
    brand: string;
    perfume: string;
    image: string | null;
    minBuyGrams: number;
    minBuyThreshold: number;
    gender: "male" | "female" | "unisex" | "unassigned" | null;
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

  const totalPrice = filteredOrders.reduce((acc, order) => {
    let amount = 0;
    if (status === "valid") {
      amount = order.validAmount;
    } else if (status === "pending") {
      amount = order.pendingAmount;
    } else {
      amount = order.validAmount + order.pendingAmount;
    }
    return acc + (order.pricePerGram || 0) * amount;
  }, 0);

  return (
    <div className="flex flex-col gap-4 flex-1">
      {/* Total Price Info Card */}
      {filteredOrders.length > 0 && totalPrice > 0 && (
        <div className="bg-violet-50 border border-violet-100 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 text-violet-900">
          <div className="flex flex-col">
            <h4 className="font-semibold text-lg">Toplam Tutar</h4>
            <p className="text-sm opacity-80">
              {status === "valid"
                ? "Geçerli Siparişler"
                : status === "pending"
                  ? "Bekleyen Siparişler"
                  : "Tüm Siparişler"}
            </p>
          </div>
          <div className="text-2xl font-bold">
            {totalPrice.toLocaleString("tr-TR", {
              style: "currency",
              currency: "TRY",
            })}
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded border border-dashed h-full">
          <p className="text-lg font-medium text-muted-foreground">
            Henüz talep oluşturulmamış
          </p>
          <Link href="/" className="text-violet-700 hover:underline mt-2">
            Ürünler Sayfasına Git
          </Link>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded border border-dashed h-full">
          <p className="text-lg font-medium text-muted-foreground">
            Aradığınız kriterlere uygun talep bulunamadı.
          </p>
          <p className="text-muted-foreground/80 mt-1">
            Farklı bir arama terimi veya filtre deneyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-background rounded overflow-hidden justify-between flex flex-col shadow-lg gap-4 p-4"
            >
              <div className="flex gap-2 justify-between">
                <div className="flex gap-4 flex-1">
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
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm line-clamp-1">
                      {order.product.factoryName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {order.product.brand} - {order.product.perfume}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium uppercase mt-1">
                      {order.product.gender === "male"
                        ? "Erkek"
                        : order.product.gender === "female"
                          ? "Kadın"
                          : order.product.gender === "unisex"
                            ? "Unisex"
                            : "Belirtilmemiş"}
                    </p>
                  </div>
                </div>

                {canDelete && <DeleteOrderButton productId={order.id} />}
              </div>
              <div className="flex *:flex-1 gap-2">
                {status === "valid" ? (
                  <Badge variant="valid" className="capitalize text-sm rounded">
                    {order.validAmount}gr Geçerli
                  </Badge>
                ) : status === "pending" ? (
                  <Badge
                    variant="pending"
                    className="capitalize text-sm rounded"
                  >
                    {order.pendingAmount}gr Beklemede
                  </Badge>
                ) : (
                  <>
                    <Badge
                      variant="pending"
                      className="capitalize text-sm rounded"
                    >
                      {order.pendingAmount}gr Beklemede
                    </Badge>
                    <Badge
                      variant="valid"
                      className="capitalize text-sm rounded"
                    >
                      {order.validAmount}gr Geçerli
                    </Badge>
                  </>
                )}
              </div>

              {/* Price Display */}
              {order.pricePerGram > 0 && (
                <div className="flex justify-end items-center text-sm border-t pt-2 mt-auto">
                  {/* <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      Birim Fiyat (1gr)
                    </span>
                    <span className="font-medium">
                      {order.pricePerGram.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </span>
                  </div> */}
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">
                      Toplam Tutar
                    </span>
                    <span className="font-bold text-violet-700">
                      {(
                        order.pricePerGram *
                        (status === "valid"
                          ? order.validAmount
                          : status === "pending"
                            ? order.pendingAmount
                            : order.validAmount + order.pendingAmount)
                      ).toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
