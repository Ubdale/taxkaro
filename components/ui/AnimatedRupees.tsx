"use client";

import NumberFlow, { continuous } from "@number-flow/react";
import { useReducedMotion } from "motion/react";
import { formatPkr } from "@/lib/tax-rates";

/**
 * The headline figure. NumberFlow rolls each digit to its new value rather
 * than swapping the whole string, which makes changing an input feel like the
 * number is being recalculated rather than replaced.
 *
 * Accessibility note, learned the hard way: NumberFlow renders a plain text
 * span in the light DOM on first paint, but REMOVES it once the value updates —
 * after that the digits exist only inside its shadow root. Measured directly:
 * post-update the element is literally `<number-flow-react></number-flow-react>`
 * to anything reading the accessibility tree. Left alone, the most important
 * number on the page goes silent the moment someone changes an input.
 *
 * So the visual component is marked aria-hidden and the real value is carried
 * by our own visually-hidden live region, which also means the new figure is
 * announced when it changes — the correct behaviour for a calculator anyway.
 */
export default function AnimatedRupees({
  value,
  className,
  label = "Tax due",
}: {
  value: number;
  className?: string;
  label?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <span className={className}>
      <span className="sr-only" role="status" aria-live="polite">
        {label}: {formatPkr(value)}
      </span>
      <NumberFlow
        aria-hidden
        value={value}
        plugins={reduced ? undefined : [continuous]}
        animated={!reduced}
        // Mirrors formatPkr so the animated and announced values never disagree.
        format={{
          style: "currency",
          currency: "PKR",
          maximumFractionDigits: 0,
        }}
        locales="en-PK"
        transformTiming={{
          duration: 650,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        spinTiming={{ duration: 750, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
    </span>
  );
}
