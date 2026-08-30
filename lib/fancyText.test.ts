import assert from "node:assert/strict";
import { test } from "node:test";

import { ALL_CHARACTERS, applyStyle, styles } from "./fancyText.ts";

/**
 * The Mathematical Alphanumeric block has reserved gaps, so an offset-built map
 * can silently leave characters unstyled. Every substitution style must change
 * every one of A–Z, a–z, 0–9, or say so by not claiming to cover it.
 */

/**
 * Characters a style legitimately leaves as themselves — either because the
 * style is defined that way (small caps keeps capitals and digits) or because
 * Unicode has no such form (no superscript Q, no small-cap X, and the
 * rotationally symmetric letters are their own upside-down twins).
 */
const SELF_MAPPED: Record<string, string> = {
  "small-caps": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789x",
  superscript: "Qq",
  "upside-down": "HINOSXZlosxz08",
};

/** Styles that legitimately have no digit forms in Unicode. */
const NO_DIGITS = new Set([
  "italic",
  "bold-italic",
  "script",
  "bold-script",
  "fraktur",
  "bold-fraktur",
  "sans-italic",
  "sans-bold-italic",
  "squared",
  "negative-squared",
]);

for (const style of styles) {
  if (style.combining) {
    test(`${style.id} appends its combining mark to every character`, () => {
      for (const character of ALL_CHARACTERS) {
        assert.equal(
          applyStyle(character, style),
          character + style.combining,
          `${style.id} did not mark ${character}`,
        );
      }
    });

    continue;
  }

  test(`${style.id} maps every letter and digit`, () => {
    const unmapped: string[] = [];

    for (const character of ALL_CHARACTERS) {
      const isDigit = character >= "0" && character <= "9";

      if (isDigit && NO_DIGITS.has(style.id)) {
        continue;
      }

      if (SELF_MAPPED[style.id]?.includes(character)) {
        continue;
      }

      if (applyStyle(character, style) === character) {
        unmapped.push(character);
      }
    }

    assert.deepEqual(
      unmapped,
      [],
      `${style.id} fell through to plain text for: ${unmapped.join(" ")}`,
    );
  });

  test(`${style.id} produces one output character per input character`, () => {
    for (const character of ALL_CHARACTERS) {
      assert.equal(
        [...applyStyle(character, style)].length,
        1,
        `${style.id} produced a broken pair for ${character}`,
      );
    }
  });
}

test("upside down reverses the string", () => {
  const style = styles.find((item) => item.id === "upside-down")!;
  const output = [...applyStyle("abc", style)];

  assert.equal(output.length, 3);
  assert.equal(output[0], applyStyle("c", style));
});

test("unmapped characters survive unchanged", () => {
  const bold = styles.find((item) => item.id === "bold")!;

  assert.equal(applyStyle("hi there!", bold).endsWith("!"), true);
  assert.equal(applyStyle("a b", bold).includes(" "), true);
});
