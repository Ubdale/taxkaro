"use client";

import { motion, useReducedMotion } from "motion/react";
import AnimatedRupees from "./ui/AnimatedRupees";
import {
  FBR_TAX_YEAR_LABEL,
  RATES_VERIFIED_ON,
  TAX_YEAR,
  formatPkr,
  type TaxBreakdownRow,
} from "@/lib/tax-rates";

type Props = {
  gross: number;
  taxDue: number;
  takeHome: number;
  effectiveRate: number;
  /** Empty for the final-tax regime, which has no slab working to show. */
  rows: TaxBreakdownRow[];
  regimeLabel: string;
  regimeNote: string;
};

export default function Receipt({
  gross,
  taxDue,
  takeHome,
  effectiveRate,
  rows,
  regimeLabel,
  regimeNote,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      layout={!reduced}
      className="receipt rounded-sm px-6 py-8 sm:px-8"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Slip header */}
      <div className="border-b-2 border-dashed border-brand-200 pb-5 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand-600">
          Estimated tax
        </p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-brand-700/70">
          {FBR_TAX_YEAR_LABEL} &middot; {TAX_YEAR}
        </p>
      </div>

      {/* Ledger */}
      <dl className="space-y-3 py-6 font-mono text-[13px] text-brand-800">
        <div className="leader">
          <span>Gross income</span>
          <span className="font-semibold">{formatPkr(gross)}</span>
        </div>
        <div className="leader">
          <span>Basis</span>
          <span className="font-semibold">{regimeLabel}</span>
        </div>

        {rows.length > 0 ? (
          <>
            <div className="pt-2 text-[10px] uppercase tracking-widest text-brand-700/60">
              Working
            </div>
            {rows.map((row) => (
              <div key={row.label} className="leader">
                <span className="max-w-[62%] text-brand-700">{row.label}</span>
                <span>{formatPkr(row.amount)}</span>
              </div>
            ))}
          </>
        ) : null}
      </dl>

      {/* Total */}
      <div className="relative border-y-2 border-brand-900 py-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-700">
          Total payable
        </p>
        <AnimatedRupees
          value={taxDue}
          label="Total tax payable"
          className="mt-1 block text-4xl font-semibold tracking-tight text-brand-950 sm:text-5xl"
        />

        {/* Rubber stamp */}
        <div className="pointer-events-none absolute -top-2 right-0 sm:right-2">
          <div className="stamp flex size-24 flex-col items-center justify-center text-center text-gold-600">
            <span className="tnum text-lg font-bold leading-none">
              {(effectiveRate * 100).toFixed(2)}%
            </span>
            <span className="mt-1 font-mono text-[8px] uppercase leading-tight tracking-widest">
              effective
              <br />
              rate
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-3 pt-5 font-mono text-[12px] text-brand-800">
        <div className="leader">
          <span>You keep</span>
          <span className="font-semibold text-brand-600">{formatPkr(takeHome)}</span>
        </div>
        <div className="leader">
          <span>Per month</span>
          <span className="font-semibold">
            {formatPkr(Math.round(takeHome / 12))}
          </span>
        </div>
      </div>

      <p className="mt-6 border-t border-dashed border-brand-200 pt-4 text-center text-[11px] leading-relaxed text-brand-700/70 text-pretty">
        {regimeNote}
      </p>
      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-brand-700/50">
        Not a demand notice &middot; rates verified{" "}
        {new Date(RATES_VERIFIED_ON).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>
    </motion.div>
  );
}
