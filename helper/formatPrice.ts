export function formatPrice(price: number) {
  const formattedPrice = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(price);
  return formattedPrice;
}
