"use client";

import { ChevronDown } from "lucide-react";
import { useId } from "react";

/**
 * The inputs are set inside a plain-English sentence rather than a form, so
 * each control has to sit on the text baseline and size itself to its content.
 *
 * Both are real form controls with real labels — the label is visually hidden
 * because the surrounding sentence already reads as the question, but it still
 * has to exist for anyone navigating by form field.
 */

export function SlotNumber({
  value,
  onChange,
  label,
  prefix = "₨",
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  prefix?: string;
}) {
  const id = useId();

  return (
    <span className="slot px-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <span aria-hidden className="text-brand-400">
        {prefix}
      </span>
      <input
        id={id}
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // Sized to its content so the sentence reflows naturally as digits are
        // typed. `ch` tracks digit width in a tabular font.
        style={{ width: `${Math.max(value.length, 3) + 0.5}ch` }}
        className="tnum bg-transparent text-center font-semibold text-brand-700 outline-none"
      />
    </span>
  );
}

export function SlotSelect<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
}) {
  const id = useId();
  const current = options.find((o) => o.value === value)?.label ?? "";

  return (
    <span className="slot px-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {/* The visible text is a span so the control can size to the chosen
          option; the native select sits transparently on top and keeps the
          platform's own picker, which is far better on a phone than anything
          hand-built. */}
      <span aria-hidden className="whitespace-nowrap font-semibold text-brand-700">
        {current}
      </span>
      <ChevronDown aria-hidden className="size-4 shrink-0 text-brand-400" />
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </span>
  );
}
