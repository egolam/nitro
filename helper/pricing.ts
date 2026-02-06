export function roundPrice(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateProductPricePerGram(
  amount: number,
  vat: number,
  profitMargin: number,
  discount: number,
  exchangeRate: number,
  minBuyGrams: number,
  minBuyThreshold: number,
) {
  const priceWithVat = amount * (1 + vat);
  const priceWithProfitMargin = priceWithVat * (1 + profitMargin);
  const priceWithDiscount = priceWithProfitMargin * (1 - discount);
  const priceInTRY = priceWithDiscount * exchangeRate;
  const priceInGram = priceInTRY / minBuyThreshold;
  return roundPrice(priceInGram * minBuyGrams);
}

export function determineOrderAmount(
  order: { validAmount: number; pendingAmount: number },
  status: "valid" | "pending" | "all",
): number {
  if (status === "valid") {
    return order.validAmount;
  } else if (status === "pending") {
    return order.pendingAmount;
  } else {
    return order.validAmount + order.pendingAmount;
  }
}

export function calculateOrderTotal(
  pricePerGram: number,
  amount: number,
): number {
  return pricePerGram * amount;
}

export function calculateOrderListTotal(
  orders: any[],
  status: "valid" | "pending" | "all",
): number {
  return orders.reduce((acc, order) => {
    const amount = determineOrderAmount(order, status);
    return acc + calculateOrderTotal(order.pricePerGram || 0, amount);
  }, 0);
}
