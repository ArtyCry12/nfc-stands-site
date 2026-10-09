/**
 * Founder-approved standard review-stand tiers (MDL per unit).
 * Custom products must NOT use this table — they are individually quoted.
 */
export const STANDARD_REVIEW_STAND_TIERS = [
  { minQty: 1, maxQty: 2, unitPriceMdl: 450 },
  { minQty: 3, maxQty: 6, unitPriceMdl: 400 },
  { minQty: 7, maxQty: 10, unitPriceMdl: 350 },
  { minQty: 11, maxQty: 19, unitPriceMdl: 300 },
  { minQty: 20, maxQty: Number.POSITIVE_INFINITY, unitPriceMdl: 250 },
] as const;

export const STANDARD_PRICE_RULE_ID = "standard-review-stand-tiers-v1";

export type StandardPriceResult = {
  priceType: "fixed-tier";
  quantity: number;
  unitPriceMdl: number;
  totalPriceMdl: number;
  priceSource: typeof STANDARD_PRICE_RULE_ID;
};

export type CustomQuoteResult = {
  priceType: "custom-quote";
  quantity: number | null;
  unitPriceMdl: null;
  totalPriceMdl: null;
  priceSource: null;
};

export function unitPriceForStandardStand(quantity: number): number {
  if (!Number.isFinite(quantity) || quantity < 1) {
    throw new Error("Quantity must be an integer >= 1");
  }
  const qty = Math.floor(quantity);
  const tier = STANDARD_REVIEW_STAND_TIERS.find(
    (t) => qty >= t.minQty && qty <= t.maxQty,
  );
  if (!tier) throw new Error("No tier for quantity");
  return tier.unitPriceMdl;
}

export function priceStandardReviewStand(quantity: number): StandardPriceResult {
  const qty = Math.floor(quantity);
  const unitPriceMdl = unitPriceForStandardStand(qty);
  return {
    priceType: "fixed-tier",
    quantity: qty,
    unitPriceMdl,
    totalPriceMdl: unitPriceMdl * qty,
    priceSource: STANDARD_PRICE_RULE_ID,
  };
}

export function customQuote(quantity: number | null = null): CustomQuoteResult {
  return {
    priceType: "custom-quote",
    quantity,
    unitPriceMdl: null,
    totalPriceMdl: null,
    priceSource: null,
  };
}
