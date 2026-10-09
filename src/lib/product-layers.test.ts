import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  PRODUCT_LAYER_VIEW,
  buildLayeredProductSvg,
  resolveSurface,
} from "./product-layers";

function hash(svg: string) {
  return createHash("sha256").update(svg).digest("hex");
}

const a = buildLayeredProductSvg({
  productType: "standard-review-stand",
  colorId: "black",
  brandLabel: "touchform.md",
  reserveQrPlate: true,
});
const b = buildLayeredProductSvg({
  productType: "standard-review-stand",
  colorId: "black",
  brandLabel: "touchform.md",
  reserveQrPlate: true,
});

assert.equal(hash(a), hash(b), "identical inputs must produce identical SVG");
assert.match(a, /data-renderer="layered-v1"/);
assert.match(a, /id="layer-stage"/);
assert.match(a, /id="layer-stand"/);
assert.match(a, /id="layer-branding"/);
assert.match(a, /id="layer-qr"/);
assert.equal(PRODUCT_LAYER_VIEW.qrPlate.size, 168);

const wood = resolveSurface("wood");
assert.equal(wood.grain, true);
const black = resolveSurface("black");
assert.equal(black.body, "#1C1C1C");

const yellow = buildLayeredProductSvg({
  productType: "standard-review-stand",
  colorId: "yellow",
  reserveQrPlate: true,
});
assert.notEqual(hash(a), hash(yellow), "color must change the render");
assert.match(yellow, /#E6B800/);

console.log("product-layers.test.ts OK", hash(a).slice(0, 12));
