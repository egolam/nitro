import { auth } from "@/auth";
import { headers } from "next/headers";
import { getOrders } from "@/data/orders/getOrders";
import { redirect } from "next/navigation";
import { OrderList } from "@/components/orders/OrderList";
import { SearchInput } from "@/components/products/SearchInput";
import { StatusTabs } from "@/components/orders/StatusTabs";
import { getSettings } from "@/data/settings/getSettings";

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
  const settings = await getSettings();
  const status = settings?.saleStatus?.name || "open";
  const canDelete = status === "open" || status === "partial";

  return (
    <section className="max-w-7xl flex-1 pt-4 flex flex-col gap-4 w-full">
      <header className="flex flex-col gap-4">
        <h3 className="text-violet-700 leading-none font-medium">TALEPLERİM</h3>
        <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          {/* <TagFilter /> */}
          <div className="w-full sm:w-1/4">
            <SearchInput />
          </div>
          <StatusTabs />
        </div>
      </header>

      {status === "payment" && (
        <a
          href="/siparis-ozeti"
          className="relative w-full sm:w-fit px-4 py-2 bg-blue-500 text-white text-sm rounded transition ml-auto "
        >
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
          ÖDEMEYE GEÇ
        </a>
      )}

      <OrderList orders={orders} canDelete={canDelete} />
    </section>
  );
}
