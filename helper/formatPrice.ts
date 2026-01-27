export function formatPrice(price: number) {
  const base = price / 100;
  const formattedPrice = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(base);
  return formattedPrice;
}
