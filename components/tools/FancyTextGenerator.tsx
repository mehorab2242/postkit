"use client";

import { useMemo, useState } from "react";

import { CopyButton } from "@/components/ui/CopyButton";
import { applyStyle, styles } from "@/lib/fancyText";

const INITIAL_VISIBLE = 8;

export default function FancyTextGenerator() {
  const [input, setInput] = useState("");
  const [showAll, setShowAll] = useState(false);

  const text = input || "Your text here";

  /* 23 styles across a long input is a lot of DOM, so the rest stay collapsed
     until asked for. */
  const visible = useMemo(
    () => (showAll ? styles : styles.slice(0, INITIAL_VISIBLE)),
    [showAll],
  );

  const rows = useMemo(
    () =>
      visible.map((style) => ({
        id: style.id,
        name: style.name,
        output: applyStyle(text, style),
      })),
    [visible, text],
  );

  return (
    <div className="p-4">
      <label htmlFor="fancy-input" className="block text-small font-bold">
        Your text
      </label>
      <input
        id="fancy-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Type something"
        className="mt-1 min-h-11 w-full border border-rule bg-white px-3 text-body"
      />

      <ul className="mt-6 divide-y divide-rule border-y border-rule">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex items-center justify-between gap-3 py-2"
          >
            <span className="min-w-0">
              <span className="block text-micro uppercase tracking-wide text-muted">
                {row.name}
              </span>
              <span className="block truncate text-lead">{row.output}</span>
            </span>
            <CopyButton text={row.output} className="shrink-0 border border-rule" />
          </li>
        ))}
      </ul>

      {!showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-4 inline-flex min-h-11 items-center font-bold text-mark"
        >
          Show all {styles.length} styles
        </button>
      )}

      <p className="mt-6 text-small text-muted">
        These are Unicode substitutions, not fonts. Screen readers read them out
        as symbol names, and some platforms strip them from search — worth
        keeping your bio&apos;s important words in plain text.
      </p>
    </div>
  );
}
