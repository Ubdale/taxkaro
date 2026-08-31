/**
 * ============================================================================
 * FBR TAX RATES — TAX YEAR 2027 (income year 1 July 2026 – 30 June 2027)
 * ============================================================================
 *
 * UPDATE THIS FILE EVERY YEAR. Pakistan's rates are reset by the Finance Act
 * each June and take effect on 1 July. When you update it:
 *
 *   1. Change TAX_YEAR and RATES_VERIFIED_ON below.
 *   2. Re-check every table against a primary source before shipping.
 *   3. Update the "last verified" line rendered on the calculator page — it is
 *      read from RATES_VERIFIED_ON, so it moves automatically, but the wording
 *      around it may need revisiting.
 *
 * SOURCES (checked 1 September 2026):
 *   - Slab tables: PwC Worldwide Tax Summaries, Pakistan — Individual — Taxes
 *     on personal income (last reviewed 24 August 2026).
 *     https://taxsummaries.pwc.com/pakistan/individual/taxes-on-personal-income
 *   - Section 154A IT/ITeS export rates: corroborated across three independent
 *     sources; 0.25% PSEB-registered / 1% otherwise, both final tax, regime
 *     extended to 30 June 2029 by the 2026-27 budget.
 *   - Tenth Schedule non-filer rule: withholding rates are increased by 100%
 *     for persons not on the Active Taxpayers List, with specific exceptions.
 *
 * ACCURACY WARNING: these figures are transcribed from secondary sources, not
 * from the Ordinance itself. Secondary sources disagree on some section 153
 * service rates in particular, which is why local-services withholding is
 * presented in this app as an indicative range rather than a hard number.
 * Nothing here is tax advice.
 */

export const TAX_YEAR = "2026–27" as const;
/** FBR's own label for the same period. */
export const FBR_TAX_YEAR_LABEL = "Tax Year 2027" as const;
export const RATES_VERIFIED_ON = "2026-09-01" as const;

export type Slab = {
  /** Inclusive lower bound of the band, in PKR. */
  from: number;
  /** Exclusive upper bound, or null for the top band. */
  to: number | null;
  /** Fixed PKR amount payable once income enters this band. */
  fixed: number;
  /** Marginal rate applied to income above `from`, as a fraction. */
  rate: number;
};

/**
 * Individuals whose income is mainly business or professional income — which
 * is what a freelancer with local clients is. Note these are materially
 * harsher than the salaried slabs: 15% starts immediately above the threshold
 * where a salaried person pays 1%.
 */
export const BUSINESS_SLABS: Slab[] = [
  { from: 0, to: 600_000, fixed: 0, rate: 0 },
  { from: 600_000, to: 1_200_000, fixed: 0, rate: 0.15 },
  { from: 1_200_000, to: 1_600_000, fixed: 90_000, rate: 0.2 },
  { from: 1_600_000, to: 3_200_000, fixed: 170_000, rate: 0.3 },
  { from: 3_200_000, to: 5_600_000, fixed: 650_000, rate: 0.4 },
  { from: 5_600_000, to: null, fixed: 1_610_000, rate: 0.45 },
];

/**
 * Salaried individuals — included for the comparison on the guide page, since
 * "why do I pay so much more than my salaried friend" is a question every
 * freelancer eventually asks. Applies when salary exceeds 75% of taxable
 * income, so it does not apply to a typical freelancer.
 */
export const SALARIED_SLABS: Slab[] = [
  { from: 0, to: 600_000, fixed: 0, rate: 0 },
  { from: 600_000, to: 1_200_000, fixed: 0, rate: 0.01 },
  { from: 1_200_000, to: 2_200_000, fixed: 6_000, rate: 0.11 },
  { from: 2_200_000, to: 3_200_000, fixed: 116_000, rate: 0.2 },
  { from: 3_200_000, to: 4_100_000, fixed: 316_000, rate: 0.25 },
  { from: 4_100_000, to: 5_600_000, fixed: 541_000, rate: 0.29 },
  { from: 5_600_000, to: 7_000_000, fixed: 976_000, rate: 0.32 },
  { from: 7_000_000, to: null, fixed: 1_424_000, rate: 0.35 },
];

/** Non-salaried individuals pay a surcharge on top of computed tax above this. */
export const SURCHARGE = {
  threshold: 10_000_000,
  rate: 0.1,
} as const;

/**
 * Section 154A — export of IT and IT-enabled services. This is the regime that
 * applies to most Pakistani freelancers with foreign clients, and it is by far
 * the largest number on this page: a final tax of 0.25% or 1% of gross
 * receipts, versus slab rates reaching 45%.
 */
export const IT_EXPORT = {
  pseb: 0.0025,
  nonPseb: 0.01,
  /** Share of export proceeds that must arrive through banking channels. */
  bankingChannelRequirement: 0.8,
  regimeGuaranteedUntil: "30 June 2029",
} as const;

/**
 * Tenth Schedule: withholding for people not on the Active Taxpayers List is
 * generally the filer rate plus 100%. Vehicles are tripled and some sections
 * carry their own fixed non-filer figures, so this multiplier is a rule of
 * thumb, not a universal law.
 */
export const NON_FILER_MULTIPLIER = 2;

/**
 * Indicative section 153(1)(b) withholding on services billed to Pakistani
 * withholding agents. Published rate cards disagree here — some list 11% for
 * general services, others 7%, with a reduced rate for IT services — so this
 * is deliberately modelled as a range and labelled as indicative in the UI
 * rather than presented as a precise figure the user can rely on.
 */
export const LOCAL_SERVICES_WHT = {
  itServicesFiler: 0.04,
  generalServicesFilerLow: 0.07,
  generalServicesFilerHigh: 0.11,
  /** No withholding below this in aggregate annual payments per provider. */
  deMinimis: 30_000,
} as const;

export type TaxBreakdownRow = {
  label: string;
  detail: string;
  amount: number;
};

export type SlabResult = {
  tax: number;
  surcharge: number;
  total: number;
  /** Highest band the income actually reached. */
  marginalRate: number;
  effectiveRate: number;
  rows: TaxBreakdownRow[];
};

/**
 * Applies a slab table. Pakistan's tables are cumulative: each band carries a
 * fixed amount covering all tax on income below it, plus a marginal rate on
 * the excess — so only one band is ever evaluated, not a running total.
 */
export function applySlabs(
  income: number,
  slabs: Slab[],
  opts: { surcharge?: boolean } = {},
): SlabResult {
  const taxable = Math.max(0, Math.round(income));
  const band =
    slabs.find((s) => taxable > s.from && (s.to === null || taxable <= s.to)) ??
    slabs[0];

  const excess = Math.max(0, taxable - band.from);
  const tax = Math.round(band.fixed + excess * band.rate);

  const surcharge =
    opts.surcharge && taxable > SURCHARGE.threshold
      ? Math.round(tax * SURCHARGE.rate)
      : 0;

  const rows: TaxBreakdownRow[] = [];

  if (band.rate === 0) {
    rows.push({
      label: "Below the taxable threshold",
      detail: `Income up to ${formatPkr(slabs[0].to ?? 0)} is not taxed.`,
      amount: 0,
    });
  } else {
    if (band.fixed > 0) {
      rows.push({
        label: "Fixed amount for your slab",
        detail: `Covers all tax on the first ${formatPkr(band.from)}.`,
        amount: band.fixed,
      });
    }
    rows.push({
      label: `${(band.rate * 100).toFixed(0)}% on income above ${formatPkr(band.from)}`,
      detail: `${(band.rate * 100).toFixed(0)}% of ${formatPkr(excess)}.`,
      amount: Math.round(excess * band.rate),
    });
  }

  if (surcharge > 0) {
    rows.push({
      label: `${SURCHARGE.rate * 100}% surcharge`,
      detail: `Applies because income exceeds ${formatPkr(SURCHARGE.threshold)}.`,
      amount: surcharge,
    });
  }

  const total = tax + surcharge;

  return {
    tax,
    surcharge,
    total,
    marginalRate: band.rate,
    effectiveRate: taxable > 0 ? total / taxable : 0,
    rows,
  };
}

/** Section 154A final tax on gross export receipts. */
export function itExportTax(gross: number, psebRegistered: boolean) {
  const rate = psebRegistered ? IT_EXPORT.pseb : IT_EXPORT.nonPseb;
  return { rate, tax: Math.round(Math.max(0, gross) * rate) };
}

export function formatPkr(amount: number, opts: { decimals?: boolean } = {}) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: opts.decimals ? 2 : 0,
  }).format(amount);
}

/** 4_500_000 -> "45 lakh"; 12_000_000 -> "1.2 crore". Used in explanatory copy. */
export function formatLakhCrore(amount: number) {
  if (amount >= 10_000_000) {
    const cr = amount / 10_000_000;
    return `${cr % 1 === 0 ? cr : cr.toFixed(2)} crore`;
  }
  if (amount >= 100_000) {
    const lakh = amount / 100_000;
    return `${lakh % 1 === 0 ? lakh : lakh.toFixed(1)} lakh`;
  }
  return new Intl.NumberFormat("en-PK").format(amount);
}
