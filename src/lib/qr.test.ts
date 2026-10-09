import assert from "node:assert/strict";
import { PNG } from "pngjs";
import jsQR from "jsqr";
import {
  generateQrPngBuffer,
  validateDestinationUrl,
} from "./qr";

async function main() {
  assert.equal(validateDestinationUrl("").ok, false);
  assert.equal(validateDestinationUrl("javascript:alert(1)").ok, false);
  assert.equal(validateDestinationUrl("ftp://example.com").ok, false);
  assert.equal(
    validateDestinationUrl("https://maps.google.com/?q=Place").ok,
    true,
  );

  const target = "https://g.page/r/touchform-demo-review";
  const { buffer, url } = await generateQrPngBuffer(target, 256);
  assert.equal(url, new URL(target).toString());

  const png = PNG.sync.read(buffer);
  const code = jsQR(
    new Uint8ClampedArray(png.data.buffer, png.data.byteOffset, png.data.byteLength),
    png.width,
    png.height,
  );
  assert.ok(code, "QR should be scannable");
  assert.equal(code.data, url);
  console.log("qr.test.ts OK — decoded", code.data);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
