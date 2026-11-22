import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("./theme.js", import.meta.url), "utf8");

test("theme bootstrap restores supported preferences and defaults to light", () => {
  for (const [saved, expected] of [
    [null, "light"],
    ["dark", "dark"],
    ["light", "light"],
    ["invalid", "light"],
  ]) {
    const document = { documentElement: { dataset: {} } };
    runInNewContext(source, {
      document,
      localStorage: { getItem: () => saved },
      console,
    });
    assert.equal(document.documentElement.dataset.theme, expected);
  }
});

test("blocked browser storage does not prevent the light theme from loading", () => {
  const document = { documentElement: { dataset: {} } };
  const warnings = [];
  runInNewContext(source, {
    document,
    localStorage: {
      getItem() {
        throw new Error("Blocked");
      },
    },
    console: { warn: (...args) => warnings.push(args) },
  });
  assert.equal(document.documentElement.dataset.theme, "light");
  assert.equal(warnings.length, 1);
});
