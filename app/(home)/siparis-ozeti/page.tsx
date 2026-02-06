import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPaymentOrders } from "@/data/orders/getPaymentOrders";
import Image from "next/image";
import { formatPrice } from "@/helper/formatPrice";
import Link from "next/link";
import { getUserAddress } from "@/data/users/getUserAddress";
import { AddressItem } from "@/components/profile/address/AddressItem";
import {
  calculateProductPricePerGram,
  calculateOrderTotal,
} from "@/helper/pricing";

export const metadata = {
  title: "Sipariş Özeti | MARESANS",
};

export default async function OrderSummaryPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/giris-yap");
  }

  const { orders, shippingPrice } = await getPaymentOrders(session.user.id);
  const userAddress = await getUserAddress(session.user.id);

  if (orders.length === 0) {
    redirect("/");
  }

  // Calculate totals on the fly
  const totalPrice = orders.reduce((acc, order) => {
    if (!order.price) return acc;
    const pricePerGram =
      calculateProductPricePerGram(
        order.price.amount,
        order.price.vat,
        order.price.profitMargin,
        order.price.discount,
        order.price.exchangeRate,
        order.product.minBuyGrams,
        order.product.minBuyThreshold,
      ) / order.product.minBuyGrams;

    // For payment orders, 'amount' is used. In getPaymentOrders, 'validAmount' is SUM(amount).
    // The legacy code used order.totalPrice which was calculated from validAmount.
    // 'amount' and 'validAmount' in getPaymentOrders are identical (SUM(amount)).
    return acc + calculateOrderTotal(pricePerGram, order.validAmount);
  }, 0);

  const grandTotal = totalPrice + shippingPrice;

  return (
    <section className="max-w-7xl flex-1 pt-4 flex flex-col gap-4 w-full">
      <header className="flex gap-2 items-center">
        <h3 className="text-violet-700 leading-none font-medium">
          SİPARİŞ ÖZETİ
        </h3>
        <p className="text-xs rounded-xs px-2 bg-violet-700 text-muted">
          {orders.length} ürün
        </p>
      </header>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="flex flex-col gap-4 w-full md:w-2/3">
          <ul className="bg-background rounded border flex flex-col divide-y px-4 h-fit">
            {orders.map((order) => {
              let orderTotal = 0;
              if (order.price) {
                const pricePerGram =
                  calculateProductPricePerGram(
                    order.price.amount,
                    order.price.vat,
                    order.price.profitMargin,
                    order.price.discount,
                    order.price.exchangeRate,
                    order.product.minBuyGrams,
                    order.product.minBuyThreshold,
                  ) / order.product.minBuyGrams;
                orderTotal = calculateOrderTotal(
                  pricePerGram,
                  order.validAmount,
                );
              }

              return (
                <li key={order.id} className="py-4 flex gap-4">
                  <div className="relative size-16 rounded-xs overflow-hidden">
                    <Image
                      src={order.product.image!}
                      fill
                      alt={order.product.factoryName}
                    />
                  </div>
                  <div className="text-sm flex flex-col justify-between flex-1">
                    <div>
                      <p className="font-medium">{order.product.factoryName}</p>
                      <div className="text-xs text-muted-foreground">
                        <p>
                          {order.product.brand} {order.product.perfume}
                        </p>
                        <p className="font-medium">
                          {order.product.gender === "male"
                            ? "Erkek"
                            : order.product.gender === "female"
                              ? "Kadın"
                              : "Unisex"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-muted-foreground">
                        {order.amount} gr
                      </p>

                      <p>{formatPrice(orderTotal)}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="py-4 flex flex-col justify-between gap-4 bg-background p-4 rounded border flex-1 h-fit md:w-1/3">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Ara Toplam</span>
              <span className="font-medium text-foreground">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Kargo</span>
              <span className="font-medium text-foreground">
                {shippingPrice > 0 ? formatPrice(shippingPrice) : "Ücretsiz"}
              </span>
            </div>
            <div className="flex justify-between items-center text-violet-700 pt-2 border-t text-sm">
              <span>Genel Toplam (KDV Dahil)</span>
              <span className="font-medium">{formatPrice(grandTotal)}</span>
            </div>
          </div>
          {userAddress ? (
            <div className="flex gap-2 items-center text-sm">
              <div className="bg-background border border-dashed rounded p-2 w-1/2">
                <h4 className="text-sm text-muted-foreground">
                  Teslimat Adresi
                </h4>
                <div className="pl-2">
                  <p className="pt-1 truncate">{userAddress.addressLine}</p>
                  <div className="flex gap-2">
                    <p className="capitalize">{userAddress.district}</p>
                    <span>/</span>
                    <p className="truncate">
                      {userAddress.province.toLocaleUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-background border border-dashed rounded p-2 w-1/2">
                <h4 className="text-sm text-muted-foreground">Fatura Adresi</h4>
                <div className="pl-2">
                  <p className="pt-1 truncate">
                    {userAddress.sameAddress
                      ? userAddress.addressLine
                      : userAddress.addressLineBill}
                  </p>
                  <div className="flex gap-2">
                    <p className="capitalize">
                      {userAddress.sameAddress
                        ? userAddress.district
                        : userAddress.districtBill}
                    </p>
                    <span>/</span>
                    <p className="truncate">
                      {userAddress.sameAddress
                        ? userAddress.province.toLocaleUpperCase()
                        : userAddress.provinceBill.toLocaleUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col border border-dashed border-destructive text-destructive rounded p-2 gap-2 items-center text-sm">
              <p className="font-medium">Adres bilgisi bulunamadı</p>
              <p>
                <Link
                  href={`/profil/adreslerim`}
                  className="underline hover:text-red-700 transition-colors"
                >
                  Profil / Adreslerim
                </Link>
                'e giderek adresinizi ekleyebilirsiniz
              </p>
            </div>
          )}

          <div className="bg-amber-100 text-amber-800 text-sm p-2 rounded">
            <strong>Bilgilendirme:</strong> Ödemenizi aşağıdaki IBAN numarasına
            gönderirken açıklama kısmına
            <strong>
              {" "}
              SİPARİŞ NO: {new Date().getFullYear()}-{orders.length}{" "}
            </strong>
            yazmayı unutmayınız.
          </div>
          <Link
            href="/odeme"
            className="bg-violet-700 text-sm text-white h-9 flex items-center justify-center rounded hover:bg-violet-600 transition-colors"
          >
            SİPARİŞİ TAMAMLA
          </Link>
        </div>
      </div>
    </section>
  );
}
