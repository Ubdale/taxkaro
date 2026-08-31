"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Globe2,
  Info,
  Landmark,
  TrendingDown,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import {
  BUSINESS_SLABS,
  IT_EXPORT,
  LOCAL_SERVICES_WHT,
  NON_FILER_MULTIPLIER,
  SALARIED_SLABS,
  SURCHARGE,
  TAX_YEAR,
  applySlabs,
  formatPkr,
  itExportTax,
} from "@/lib/tax-rates";
import AnimatedRupees from "./ui/AnimatedRupees";
import Segmented from "./ui/Segmented";

type Period = "monthly" | "annual";
type ClientType = "foreign" | "local";

function parseAmount(raw: string) {
  const n = Number(raw.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** 3600000 -> "3,600,000" so the input stays readable while typing. */
function groupDigits(raw: string) {
  const digits = raw.replace(/[^0-9]/g, "");
  return digits ? Number(digits).toLocaleString("en-PK") : "";
}

function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-2">
      <div className="text-sm font-semibold text-brand-950">{children}</div>
      {hint ? (
        <p className="mt-1 text-xs leading-relaxed text-brand-700/80 text-pretty">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default function Calculator() {
  const reduced = useReducedMotion();
  const [raw, setRaw] = useState("300,000");
  const [period, setPeriod] = useState<Period>("monthly");
  const [clientType, setClientType] = useState<ClientType>("foreign");
  const [pseb, setPseb] = useState(false);
  const [filer, setFiler] = useState(true);

  const annualIncome = useMemo(() => {
    const n = parseAmount(raw);
    return period === "monthly" ? n * 12 : n;
  }, [raw, period]);

  const slab = useMemo(
    () => applySlabs(annualIncome, BUSINESS_SLABS, { surcharge: true }),
    [annualIncome],
  );
  const exportTax = useMemo(
    () => itExportTax(annualIncome, pseb),
    [annualIncome, pseb],
  );
  const salaried = useMemo(
    () => applySlabs(annualIncome, SALARIED_SLABS),
    [annualIncome],
  );

  const isExport = clientType === "foreign";
  const taxDue = isExport ? exportTax.tax : slab.total;
  const takeHome = annualIncome - taxDue;
  const effectiveRate = annualIncome > 0 ? taxDue / annualIncome : 0;
  const psebSaving = exportTax.tax - itExportTax(annualIncome, true).tax;

  const nearCliff =
    !isExport &&
    annualIncome > SURCHARGE.threshold * 0.9 &&
    annualIncome < SURCHARGE.threshold * 1.1;

  const cliffCost =
    applySlabs(SURCHARGE.threshold + 1000, BUSINESS_SLABS, { surcharge: true })
      .total -
    applySlabs(SURCHARGE.threshold, BUSINESS_SLABS, { surcharge: true }).total;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)] lg:gap-8">
      {/* ---------------------------- Inputs ---------------------------- */}
      <div className="min-w-0 self-start rounded-2xl border border-brand-100 bg-white p-6 shadow-[0_1px_3px_rgba(7,42,29,0.06),0_12px_32px_-12px_rgba(7,42,29,0.12)] lg:sticky lg:top-6">
        <div className="mb-6">
          <Label hint="Gross, before tax. Nothing you type here leaves your browser.">
            What do you earn?
          </Label>
          <div className="flex items-center rounded-xl border-2 border-brand-100 bg-paper transition-colors focus-within:border-brand-400">
            <span className="pl-4 pr-1 text-lg font-semibold text-brand-400">
              ₨
            </span>
            <input
              inputMode="numeric"
              value={raw}
              onChange={(e) => setRaw(groupDigits(e.target.value))}
              aria-label="Freelance income in rupees"
              className="tnum h-14 w-full bg-transparent pr-4 text-2xl font-semibold tracking-tight outline-none"
            />
          </div>
          <div className="mt-3">
            <Segmented
              label="Income period"
              value={period}
              onChange={setPeriod}
              options={[
                { value: "monthly", label: "Per month" },
                { value: "annual", label: "Per year" },
              ]}
            />
          </div>
        </div>

        <div className="mb-6">
          <Label
            hint={
              isExport
                ? "Exporting IT services puts you under section 154A — a final tax on gross receipts, not the slabs."
                : "Pakistani clients means ordinary business slabs, which reach 45%."
            }
          >
            <span className="inline-flex items-center gap-1.5">
              <Globe2 className="size-4 text-brand-400" aria-hidden />
              Who pays you?
            </span>
          </Label>
          <Segmented
            label="Client type"
            value={clientType}
            onChange={setClientType}
            options={[
              { value: "foreign", label: "Foreign" },
              { value: "local", label: "Pakistani" },
            ]}
          />
        </div>

        {isExport ? (
          <div className="mb-6">
            <Label
              hint={`Registration costs about Rs 1,000 and cuts the rate from ${
                IT_EXPORT.nonPseb * 100
              }% to ${IT_EXPORT.pseb * 100}%.`}
            >
              Registered with PSEB?
            </Label>
            <Segmented
              label="PSEB registration"
              value={pseb ? "yes" : "no"}
              onChange={(v) => setPseb(v === "yes")}
              options={[
                { value: "no", label: "Not yet" },
                { value: "yes", label: "Registered" },
              ]}
            />
          </div>
        ) : null}

        <div>
          <Label hint="Filer status does not change your slab rate. It changes the withholding deducted from you everywhere else.">
            Are you a filer?
          </Label>
          <Segmented
            label="Filer status"
            value={filer ? "filer" : "non-filer"}
            onChange={(v) => setFiler(v === "filer")}
            options={[
              { value: "filer", label: "Filer" },
              { value: "non-filer", label: "Non-filer" },
            ]}
          />
        </div>
      </div>

      {/* ---------------------------- Results ---------------------------- */}
      <div className="min-w-0 space-y-6">
        {/* The answer, given the weight it deserves. */}
        <div className="relative overflow-hidden rounded-2xl bg-brand-900 p-6 text-white sm:p-8">
          {/* Banknote-style engraving, decorative only. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[24px] border-brand-800/60"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full border-[20px] border-brand-800/40"
          />

          <div className="relative">
            <p className="text-sm font-medium text-brand-200">
              Tax on {formatPkr(annualIncome)} for {TAX_YEAR}
            </p>

            <AnimatedRupees
              value={taxDue}
              className="mt-2 block text-4xl font-semibold tracking-tight sm:text-6xl"
            />

            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-t border-brand-700 pt-5">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-brand-300">
                  <TrendingDown className="size-3.5" aria-hidden />
                  Effective rate
                </div>
                <div className="tnum mt-1 text-xl font-semibold text-gold-400">
                  {(effectiveRate * 100).toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-brand-300">
                  <Wallet className="size-3.5" aria-hidden />
                  You keep
                </div>
                <div className="tnum mt-1 text-xl font-semibold">
                  {formatPkr(takeHome)}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-brand-300">
                  <Landmark className="size-3.5" aria-hidden />
                  Monthly
                </div>
                <div className="tnum mt-1 text-xl font-semibold">
                  {formatPkr(Math.round(takeHome / 12))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The PSEB nudge is the highest-value thing this tool can say. */}
        {isExport && !pseb && psebSaving > 0 ? (
          <motion.div
            layout={!reduced}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border-2 border-gold-400 bg-gold-300/20 p-5"
          >
            <div className="flex-1">
              <p className="flex items-center gap-2 font-semibold text-brand-950 text-pretty">
                <BadgeCheck className="size-5 shrink-0 text-gold-600" aria-hidden />
                Registering with PSEB would save you {formatPkr(psebSaving)} this
                year.
              </p>
              <p className="mt-1 text-sm text-brand-800 text-pretty">
                The rate drops from {IT_EXPORT.nonPseb * 100}% to{" "}
                {IT_EXPORT.pseb * 100}%. Registration costs about Rs 1,000.
              </p>
            </div>
            <a
              href="/guides/pseb-registration-for-freelancers"
              className="group inline-flex h-11 items-center gap-2 rounded-xl bg-brand-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
            >
              How to register
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
          </motion.div>
        ) : null}

        {/* Working */}
        <section className="overflow-hidden rounded-2xl border border-brand-100 bg-white">
          <h2 className="flex items-center gap-2 border-b border-brand-100 px-6 py-4 text-sm font-semibold">
            <Info className="size-4 text-brand-400" aria-hidden />
            How this was worked out
          </h2>

          {isExport ? (
            <div className="space-y-4 p-6 text-sm leading-relaxed text-brand-800">
              <p className="text-pretty">
                Your income is treated as <strong>export of IT services</strong>{" "}
                under section 154A — a{" "}
                <strong>final tax on gross receipts</strong>. The slab rates do
                not apply, and no further tax is due on this income once you file.
              </p>
              <div className="tnum rounded-xl bg-brand-50 px-5 py-4 text-base font-medium text-brand-900">
                {formatPkr(annualIncome)} × {(exportTax.rate * 100).toFixed(2)}% ={" "}
                <strong>{formatPkr(exportTax.tax)}</strong>
              </div>
              <p className="text-pretty">
                On ordinary business slabs the same income would cost{" "}
                <strong>{formatPkr(slab.total)}</strong>. That gap is what this
                regime is worth.
              </p>
              <p className="text-xs text-brand-700/80 text-pretty">
                Conditions: at least {IT_EXPORT.bankingChannelRequirement * 100}%
                of proceeds must reach Pakistan through banking channels, and you
                must file your return. Legislated until{" "}
                {IT_EXPORT.regimeGuaranteedUntil}.
              </p>
            </div>
          ) : (
            <div className="p-6">
              <dl className="space-y-3">
                {slab.rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-4 border-b border-brand-100 pb-3"
                  >
                    <dt>
                      <span className="text-sm font-medium text-brand-950">
                        {row.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-brand-700/80">
                        {row.detail}
                      </span>
                    </dt>
                    <dd className="tnum shrink-0 text-sm font-semibold">
                      {formatPkr(row.amount)}
                    </dd>
                  </div>
                ))}
                <div className="flex items-baseline justify-between gap-4 pt-1">
                  <dt className="font-semibold">Total tax</dt>
                  <dd className="tnum text-xl font-semibold text-brand-600">
                    {formatPkr(slab.total)}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-brand-700/80 text-pretty">
                Freelancing is business income, so these are the non-salaried
                slabs — harsher than the salaried ones. A salaried person on{" "}
                {formatPkr(annualIncome)} would pay {formatPkr(salaried.total)}.
              </p>
            </div>
          )}
        </section>

        {nearCliff ? (
          <div className="rounded-2xl border-2 border-gold-500 bg-gold-300/20 p-5 text-sm leading-relaxed text-brand-900 text-pretty">
            <TriangleAlert
              className="mr-1.5 inline size-4 -translate-y-0.5 text-gold-600"
              aria-hidden
            />
            <strong>Mind the {formatPkr(SURCHARGE.threshold)} line.</strong> Above
            it a {SURCHARGE.rate * 100}% surcharge applies to your{" "}
            <em>entire</em> tax bill, not just the excess. Crossing it by one
            rupee costs roughly {formatPkr(cliffCost)}.
          </div>
        ) : null}

        {/* Filer comparison */}
        <section className="overflow-hidden rounded-2xl border border-brand-100 bg-white">
          <h2 className="flex items-center gap-2 border-b border-brand-100 px-6 py-4 text-sm font-semibold">
            <BadgeCheck className="size-4 text-brand-400" aria-hidden />
            What being a {filer ? "filer" : "non-filer"} costs you
          </h2>
          <div className="space-y-4 p-6">
            <p className="text-sm leading-relaxed text-brand-800 text-pretty">
              Filer status does not change the slab table — that is the part most
              people get wrong. It changes the{" "}
              <strong>withholding deducted from you everywhere else</strong>.
              Under the Tenth Schedule those rates are generally doubled for
              people off the Active Taxpayers List.
            </p>

            <div className="min-w-0 overflow-x-auto">
              <table className="w-full min-w-[20rem] border-collapse text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-brand-700">
                    <th className="pb-2 font-medium">Withholding on</th>
                    <th className="pb-2 text-right font-medium">Filer</th>
                    <th className="pb-2 text-right font-medium">Non-filer</th>
                  </tr>
                </thead>
                <tbody className="tnum">
                  <tr className="border-t border-brand-100">
                    <td className="py-3 pr-3 text-brand-800">
                      IT services from a Pakistani client
                    </td>
                    <td className="py-3 text-right font-medium">
                      {(LOCAL_SERVICES_WHT.itServicesFiler * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 text-right font-semibold text-gold-600">
                      {(
                        LOCAL_SERVICES_WHT.itServicesFiler *
                        NON_FILER_MULTIPLIER *
                        100
                      ).toFixed(0)}
                      %
                    </td>
                  </tr>
                  <tr className="border-t border-brand-100">
                    <td className="py-3 pr-3 text-brand-800">
                      Other services (indicative)
                    </td>
                    <td className="py-3 text-right font-medium">
                      {(LOCAL_SERVICES_WHT.generalServicesFilerLow * 100).toFixed(0)}–
                      {(LOCAL_SERVICES_WHT.generalServicesFilerHigh * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 text-right font-semibold text-gold-600">
                      {(
                        LOCAL_SERVICES_WHT.generalServicesFilerLow *
                        NON_FILER_MULTIPLIER *
                        100
                      ).toFixed(0)}
                      –
                      {(
                        LOCAL_SERVICES_WHT.generalServicesFilerHigh *
                        NON_FILER_MULTIPLIER *
                        100
                      ).toFixed(0)}
                      %
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs leading-relaxed text-brand-700/80 text-pretty">
              Service rates are shown as a range because published FBR rate cards
              disagree on the exact figure. Confirm the rate for your service
              before relying on it. Vehicles are tripled rather than doubled.
            </p>

            {!filer && isExport ? (
              <p className="rounded-xl border-2 border-gold-500 bg-gold-300/20 p-4 text-sm leading-relaxed text-brand-900 text-pretty">
                <strong>As a non-filer you cannot use the 154A rate.</strong>{" "}
                Filing a return is a condition of the final-tax treatment, so
                staying off the list puts the {IT_EXPORT.pseb * 100}% rate out of
                reach and doubles your withholding everywhere else.
              </p>
            ) : null}
          </div>
        </section>

        {/* AdSense unit goes here */}
        <div
          data-ad-placement="calculator-below-results"
          className="flex min-h-[90px] items-center justify-center rounded-2xl border border-dashed border-brand-200 text-xs uppercase tracking-widest text-brand-700/70"
        >
          Advertisement
        </div>

        <p className="text-xs leading-relaxed text-brand-700/80 text-pretty">
          Estimates based on published FBR rates for {TAX_YEAR}. They do not
          account for deductible expenses, tax credits, provincial sales tax on
          services, or your particular circumstances. This is not tax advice.
        </p>
      </div>
    </div>
  );
}
