import assert from "node:assert/strict";
import { priceStandardReviewStand, unitPriceForStandardStand } from "./pricing";

const cases: [number, number][] = [
  [1, 450],
  [2, 450],
  [3, 400],
  [6, 400],
  [7, 350],
  [10, 350],
  [11, 300],
  [19, 300],
  [20, 250],
  [100, 250],
];

for (const [qty, unit] of cases) {
  assert.equal(unitPriceForStandardStand(qty), unit, `unit @ ${qty}`);
  const priced = priceStandardReviewStand(qty);
  assert.equal(priced.unitPriceMdl, unit);
  assert.equal(priced.totalPriceMdl, unit * qty);
  assert.equal(priced.priceSource, "standard-review-stand-tiers-v1");
  assert.equal(priced.priceType, "fixed-tier");
}

assert.throws(() => unitPriceForStandardStand(0));
assert.throws(() => unitPriceForStandardStand(-1));

console.log("pricing.test.ts OK", cases.length, "tiers");
