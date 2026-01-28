import { auth } from "@/auth";
import { headers } from "next/headers";
import { getOrders } from "@/data/orders/getOrders";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ProgressBar } from "@/components/products/ProgressBar";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/helper/formatPrice";
import { DeleteOrderButton } from "@/components/products/DeleteOrderButton";

export const metadata = {
  title: "Taleplerim | MARESANS",
};

export default async function OrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/giris-yap");
  }

  const orders = await getOrders(session.user.id);

  return (
    <section className="max-w-7xl flex-1 pt-4 flex flex-col gap-4">
      <header className="flex flex-col gap-4">
        <h3 className="text-violet-700 leading-none font-medium">TALEPLERİM</h3>
        <p className="text-sm text-muted-foreground">
          Oluşturduğunuz tüm ürün taleplerini buradan takip edebilirsiniz.
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/20 rounded border border-dashed">
          <p className="text-lg font-medium text-muted-foreground">
            Henüz bir talebiniz bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-background border rounded-lg overflow-hidden flex flex-col shadow-sm"
            >
              <div className="p-4 flex gap-4">
                <div className="relative w-20 h-20 bg-muted rounded-md overflow-hidden shrink-0">
                  {order.product.image && (
                    <Image
                      src={order.product.image}
                      alt={order.product.factoryName}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-1">
                        {order.product.factoryName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {order.product.brand} - {order.product.perfume}
                      </p>
                    </div>
                    <DeleteOrderButton productId={order.id} />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {order.validAmount ? (
                      <Badge variant="valid" className="capitalize">
                        {order.validAmount}g Onaylandı
                      </Badge>
                    ) : null}
                    {order.pendingAmount ? (
                      <Badge variant="pending" className="capitalize">
                        {order.pendingAmount}g Beklemede
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Talep İlerlemesi</span>
                    <span>
                      {Math.round(
                        (Number(order.totalDemand) /
                          Math.max(
                            order.product.minBuyThreshold,
                            Math.ceil(
                              Number(order.totalDemand) /
                                order.product.minBuyThreshold,
                            ) * order.product.minBuyThreshold,
                          )) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <ProgressBar
                    current={Number(order.totalDemand)}
                    total={Math.max(
                      order.product.minBuyThreshold,
                      Math.ceil(
                        Number(order.totalDemand) /
                          order.product.minBuyThreshold,
                      ) * order.product.minBuyThreshold,
                    )}
                    threshold={order.product.minBuyThreshold}
                  />
                </div>
                <div className="mt-4 pt-3 border-t flex justify-between items-center text-xs text-muted-foreground">
                  <span>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("tr-TR")
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
