"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

type Option<T extends string> = { value: T; label: string };

/**
 * A segmented control where the selected pill slides between options via a
 * shared layoutId, rather than each segment flashing its own background. It is
 * the one piece of motion the user drives directly, so it carries the most
 * weight for how responsive the tool feels.
 */
export default function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
  label: string;
}) {
  const reduced = useReducedMotion();
  // layoutId must be unique per control, or pills animate between components.
  const groupId = useId();

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex gap-1 rounded-xl bg-brand-50 p-1"
    >
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            className={`relative h-11 flex-1 rounded-lg px-3 text-sm font-medium transition-colors ${
              selected ? "text-white" : "text-brand-700 hover:text-brand-500"
            }`}
          >
            {selected ? (
              reduced ? (
                <span className="absolute inset-0 rounded-lg bg-brand-800" />
              ) : (
                <motion.span
                  layoutId={`segmented-${groupId}`}
                  className="absolute inset-0 rounded-lg bg-brand-800"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )
            ) : null}
            <span className="relative z-10">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
