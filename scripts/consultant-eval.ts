/**
 * Multi-turn consultant evaluation suite.
 * Run: npx tsx scripts/consultant-eval.ts
 */
import assert from "node:assert/strict";
import { runConsultantTurn } from "../src/lib/consult-dialog";
import { ConceptContractSchema } from "../src/lib/concept-schema";
import { STANDARD_REVIEW_STAND_ID } from "../src/lib/knowledge-base";
import { priceStandardReviewStand } from "../src/lib/pricing";

type CaseResult = { name: string; pass: boolean; detail: string };

const results: CaseResult[] = [];

function check(name: string, fn: () => void) {
  try {
    fn();
    results.push({ name, pass: true, detail: "ok" });
  } catch (error) {
    results.push({
      name,
      pass: false,
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}

check("cafe reviews — asks one clarifier then offer", () => {
  const t1 = runConsultantTurn({
    locale: "en",
    history: [],
    message: "We run a cafe and want more Google reviews",
  });
  assert.equal(t1.readyForOffer, false);
  assert.ok(t1.followUpQuestion);
  assert.ok(t1.ideas.length >= 2);

  const t2 = runConsultantTurn({
    locale: "en",
    history: [
      { role: "user", content: "We run a cafe and want more Google reviews" },
      { role: "assistant", content: t1.reply },
    ],
    message: "Usually on the table after payment",
    quantity: 4,
  });
  assert.equal(t2.readyForOffer, true);
  assert.ok(t2.concept);
  const concept = ConceptContractSchema.parse(t2.concept);
  assert.equal(concept.schema_version, "1.0");
  assert.equal(
    concept.recommendation.physical_product_type,
    STANDARD_REVIEW_STAND_ID,
  );
  assert.equal(concept.commercial.price_type, "fixed-tier");
  const priced = priceStandardReviewStand(4);
  assert.equal(concept.commercial.unit_price_mdl, priced.unitPriceMdl);
  assert.equal(concept.commercial.total_price_mdl, priced.totalPriceMdl);
});

check("smart menu path uses custom quote", () => {
  const t1 = runConsultantTurn({
    locale: "ro",
    history: [],
    message: "Restaurant — vrem meniu digital fără hârtie",
  });
  const t2 = runConsultantTurn({
    locale: "ro",
    history: [
      { role: "user", content: "Restaurant — vrem meniu digital fără hârtie" },
      { role: "assistant", content: t1.reply },
    ],
    message: "Pe masă, lângă șervețele",
  });
  assert.ok(t2.concept);
  const concept = ConceptContractSchema.parse(t2.concept);
  assert.equal(concept.recommendation.digital_experience_type, "smart-menu");
  assert.equal(concept.commercial.price_type, "custom-quote");
  assert.equal(concept.commercial.unit_price_mdl, null);
});

check("custom product never gets standard tier prices", () => {
  const t1 = runConsultantTurn({
    locale: "ru",
    history: [],
    message: "Нужен кастомный NFC объект уникальной формы",
  });
  const t2 = runConsultantTurn({
    locale: "ru",
    history: [
      {
        role: "user",
        content: "Нужен кастомный NFC объект уникальной формы",
      },
      { role: "assistant", content: t1.reply },
    ],
    message: "Ресепшн отеля",
  });
  const concept = ConceptContractSchema.parse(t2.concept!);
  assert.equal(concept.commercial.price_type, "custom-quote");
  assert.notEqual(
    concept.recommendation.physical_product_type,
    STANDARD_REVIEW_STAND_ID,
  );
  assert.ok(concept.production.open_questions.length >= 1);
  assert.equal(concept.production.feasibility, "needs-human-review");
});

check("does not invent dimensions as confirmed facts", () => {
  const t = runConsultantTurn({
    locale: "en",
    history: [
      { role: "user", content: "clinic needs review stand" },
      { role: "assistant", content: "ok" },
    ],
    message: "at reception desk",
    quantity: 2,
  });
  const concept = ConceptContractSchema.parse(t.concept!);
  const dimsClaim = concept.production.known_catalog_facts.some((f) =>
    /\d+\s*mm/i.test(f),
  );
  assert.equal(dimsClaim, false);
  assert.ok(
    concept.production.open_questions.some((q) => /dimension/i.test(q)),
  );
});

check("proactive ideas count >= 2 before offer", () => {
  const t = runConsultantTurn({
    locale: "en",
    history: [],
    message: "hotel wants guest feedback",
  });
  assert.ok(t.ideas.length >= 2);
});

check("extracts destination URL into concept QR field", () => {
  const t = runConsultantTurn({
    locale: "en",
    history: [
      { role: "user", content: "cafe needs Google reviews" },
      { role: "assistant", content: "ok" },
    ],
    message:
      "on the table, destination https://g.page/r/touchform-demo-review please",
    quantity: 3,
  });
  const concept = ConceptContractSchema.parse(t.concept!);
  assert.equal(concept.design.qr_enabled, true);
  assert.equal(
    concept.design.qr_destination_url,
    "https://g.page/r/touchform-demo-review",
  );
});

const failed = results.filter((r) => !r.pass);
for (const r of results) {
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.pass ? "" : " — " + r.detail}`);
}
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length) process.exit(1);
