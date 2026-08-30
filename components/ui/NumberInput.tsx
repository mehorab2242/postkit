"use client";

import { useId } from "react";

type NumberInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
};

/**
 * Text input rather than `type="number"`, so pasted values like `12,400` are
 * accepted instead of silently rejected by the browser. Digits only are kept.
 */
export function NumberInput({
  label,
  value,
  onChange,
  hint,
  placeholder,
}: NumberInputProps) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div>
      <label htmlFor={id} className="block text-small font-bold">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/[^\d.]/g, ""))}
        inputMode="numeric"
        placeholder={placeholder}
        aria-describedby={hint ? hintId : undefined}
        className="mt-1 min-h-11 w-full border border-rule bg-white px-3 font-mono text-body"
      />
      {hint && (
        <p id={hintId} className="mt-1 text-small text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
