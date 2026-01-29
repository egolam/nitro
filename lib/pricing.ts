export type PriceSettings = {
  vat: number;
  profitMargin: number;
  discount: number;
};

/**
 * Calculates the price per gram in TRY.
 *
 * Formula:
 * 1. base = amountCents
 * 2. withVat = base * (1 + vat)
 * 3. withProfit = withVat * (1 + profitMargin)
 * 4. withDiscount = withProfit * (1 - discount)
 * 5. perGramCents = (withDiscount / 1000) (assuming 1kg unit)
 * 6. perGramTRY = (perGramCents / 100) * exchangeRate
 */
export function calculateProductPricePerGram(
  amountCents: number,
  settings: PriceSettings,
  exchangeRate: number,
): number {
  const base = amountCents;
  const withVat = base * (1 + settings.vat);
  const withProfit = withVat * (1 + settings.profitMargin);
  const withDiscount = withProfit * (1 - settings.discount);

  // unitValue is assumed 1000g (1kg) based on 'kg' default in schema, standardizing to per gram
  // If unitValue varies, we'd need to pass it in. Assuming 1kg for now as per "first price of 1 grams" instruction implying standard unit.
  // Schema defaults: unitValue: 1, unitType: 'kg'. 1 kg = 1000g.
  // amountCents is for 1 unit (1kg).

  const perGramCents = withDiscount / 1000;
  const perGramTRY = (perGramCents / 100) * exchangeRate;

  return perGramTRY;
}

export function roundPrice(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
