import test from "node:test";
import assert from "node:assert/strict";
import { confidenceScore, formatIDR, formatPace, runnerMatchScore } from "../src/lib/shoes/scoring.mjs";

test("formats Indonesian rupiah", () => {
  assert.match(formatIDR(2500000), /2\.500\.000/);
  assert.equal(formatIDR(null), "Price pending");
});

test("formats running pace", () => {
  assert.equal(formatPace(360), "6:00/km");
  assert.equal(formatPace(305), "5:05/km");
});

test("confidence rises with community size and caps at 100", () => {
  assert.equal(confidenceScore(0), 0);
  assert.ok(confidenceScore(100) > confidenceScore(10));
  assert.ok(confidenceScore(1000000) <= 100);
});

test("runner match rewards aligned preferences", () => {
  const base = runnerMatchScore({ runner: {}, shoe: { useCases: [], community: { softness: 3, stability: 3, fitWidth: 3 } } });
  const aligned = runnerMatchScore({
    runner: { goal: "long run", prefersSoft: true, needsStability: true, wideFoot: true },
    shoe: { useCases: ["Long run"], community: { softness: 4.5, stability: 4.2, fitWidth: 4 } },
  });
  assert.ok(aligned > base);
  assert.ok(aligned <= 99);
});
