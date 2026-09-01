"use client";

import { useId } from "react";

/**
 * The number slot in the sentence. Sizes itself to its content so the line
 * reflows as digits are typed, and keeps a real label for anyone tabbing
 * through form fields — the surrounding prose reads as the question, but it is
 * not attached to the control in any way assistive tech can use.
 */
export function SlotNumber({
  value,
  onChange,
  label,
  prefix = "Rs",
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  prefix?: string;
}) {
  const id = useId();

  return (
    <span className="slot px-1.5">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <span aria-hidden className="mr-0.5 text-[0.75em] text-brand-400">
        {prefix}
      </span>
      <input
        id={id}
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // `ch` tracks digit width so the field is exactly as wide as the number
        // it holds — but capped, because an eleven-digit income was stretching
        // the sentence past the column and breaking the line badly. Past the cap
        // the field scrolls internally instead of growing.
        style={{
          width: `${Math.min(Math.max(value.length, 3) + 0.5, 13)}ch`,
        }}
        className="tnum bg-transparent text-center font-semibold text-brand-700 outline-none"
      />
    </span>
  );
}

export { default as SlotSelect } from "./SlotSelect";
