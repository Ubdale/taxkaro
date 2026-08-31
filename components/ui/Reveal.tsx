"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Scroll-in reveal for content sections.
 *
 * Deliberately animates TRANSFORM ONLY — opacity stays at 1 throughout.
 *
 * The obvious implementation fades from opacity 0, but this site lives or dies
 * on search traffic, and that would leave the guides and FAQ — the actual SEO
 * content — rendered invisible until something scrolls them into view. That is
 * a bad bet against a crawler's viewport, and it means anyone whose JS fails
 * sees a blank page. A slide with no fade reads almost identically and cannot
 * hide text.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ y: 14 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay }}
    >
      {children}
    </motion.div>
  );
}
