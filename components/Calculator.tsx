"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import {
  BUSINESS_SLABS,
  IT_EXPORT,
  LOCAL_SERVICES_WHT,
  NON_FILER_MULTIPLIER,
  SALARIED_SLABS,
  SURCHARGE,
  applySlabs,
  formatPkr,
  itExportTax,
} from "@/lib/tax-rates";
import Icon from "./ui/Icon";
import Receipt from "./Receipt";
import { SlotNumber, SlotSelect } from "./ui/Slot";

type Period = "month" | "year";
type ClientType = "foreign" | "local";
type Pseb = "no" | "yes";
type Filer = "filer" | "nonfiler";

function parseAmount(raw: string) {
  const n = Number(raw.replace(/[^0-9]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function groupDigits(raw: string) {
  const digits = raw.replace(/[^0-9]/g, "").slice(0, 12);
  return digits ? Number(digits).toLocaleString("en-PK") : "";
}

export default function Calculator() {
  const reduced = useReducedMotion();
  const [raw, setRaw] = useState("300,000");
  const [period, setPeriod] = useState<Period>("month");
  const [clientType, setClientType] = useState<ClientType>("foreign");
  const [pseb, setPseb] = useState<Pseb>("no");
  const [filer, setFiler] = useState<Filer>("filer");

  const annualIncome = useMemo(() => {
    const n = parseAmount(raw);
    return period === "month" ? n * 12 : n;
  }, [raw, period]);

  const slab = useMemo(
    () => applySlabs(annualIncome, BUSINESS_SLABS, { surcharge: true }),
    [annualIncome],
  );
  const exportTax = useMemo(
    () => itExportTax(annualIncome, pseb === "yes"),
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
    <div className="space-y-10">
      {/* ------------------------- The declaration -------------------------
          Inputs live inside a sentence rather than a form. Someone who has
          never filed a return can read this aloud and know they answered it
          correctly, which a labelled field grid does not give you. */}
      <div className="sentence max-w-4xl text-brand-950">
        I earn{" "}
        <SlotNumber
          value={raw}
          onChange={(v) => setRaw(groupDigits(v))}
          label="Your income in rupees"
        />{" "}
        per{" "}
        <SlotSelect
          label="Income period"
          value={period}
          onChange={setPeriod}
          options={[
            { value: "month", label: "month" },
            { value: "year", label: "year" },
          ]}
        />{" "}
        from{" "}
        <SlotSelect
          label="Where your clients are"
          value={clientType}
          onChange={setClientType}
          options={[
            { value: "foreign", label: "foreign" },
            { value: "local", label: "Pakistani" },
          ]}
        />{" "}
        clients.{" "}
        {isExport ? (
          <>
            I&apos;m{" "}
            <SlotSelect
              label="PSEB registration status"
              value={pseb}
              onChange={setPseb}
              options={[
                { value: "no", label: "not registered" },
                { value: "yes", label: "registered" },
              ]}
            />{" "}
            with PSEB, and I&apos;m{" "}
          </>
        ) : (
          <>I&apos;m </>
        )}
        <SlotSelect
          label="Filer status"
          value={filer}
          onChange={setFiler}
          options={[
            { value: "filer", label: "a filer" },
            { value: "nonfiler", label: "a non-filer" },
          ]}
        />
        .
      </div>

      {/* --------------------- Receipt + explanation --------------------- */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-12">
        <div className="min-w-0 lg:sticky lg:top-8 lg:self-start">
          <Receipt
            gross={annualIncome}
            taxDue={taxDue}
            takeHome={takeHome}
            effectiveRate={effectiveRate}
            rows={isExport ? [] : slab.rows}
            regimeLabel={
              isExport
                ? `154A · ${(exportTax.rate * 100).toFixed(2)}% final`
                : "Non-salaried slabs"
            }
            regimeNote={
              isExport
                ? `A final tax on gross receipts — no further tax is due on this income once you file. At least ${
                    IT_EXPORT.bankingChannelRequirement * 100
                  }% of proceeds must reach Pakistan through banking channels.`
                : `Freelancing is business income, so these are the non-salaried slabs. A salaried person on the same income would pay ${formatPkr(
                    salaried.total,
                  )}.`
            }
          />
        </div>

        <div className="min-w-0 space-y-6">
          {isExport && pseb === "no" && psebSaving > 0 ? (
            <motion.div
              layout={!reduced}
              className="rounded-2xl bg-brand-900 p-6 text-white"
            >
              <p className="flex items-start gap-2.5 text-lg font-semibold leading-snug text-balance">
                <Icon name="verified" className="mt-0.5 size-5 text-gold-400" />
                Registering with PSEB would save you {formatPkr(psebSaving)} this
                year.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-200 text-pretty">
                The rate drops from {IT_EXPORT.nonPseb * 100}% to{" "}
                {IT_EXPORT.pseb * 100}% of gross receipts. Registration costs
                about Rs 1,000 and takes five to ten working days.
              </p>
              <a
                href="/guides/pseb-registration-for-freelancers"
                className="group mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-gold-500 px-5 text-sm font-semibold text-brand-950 transition-colors hover:bg-gold-400"
              >
                How to register
                <Icon
                  name="arrow_forward"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                />
              </a>
            </motion.div>
          ) : null}

          {nearCliff ? (
            <div className="rounded-2xl border-2 border-gold-500 bg-gold-300/20 p-5 text-sm leading-relaxed text-brand-900 text-pretty">
              <Icon
                name="warning"
                className="mr-1.5 size-4 -translate-y-0.5 text-gold-600"
              />
              <strong>Mind the {formatPkr(SURCHARGE.threshold)} line.</strong>{" "}
              Above it a {SURCHARGE.rate * 100}% surcharge applies to your{" "}
              <em>entire</em> tax bill, not just the excess. Crossing it by one
              rupee costs roughly {formatPkr(cliffCost)}.
            </div>
          ) : null}

          <section className="rounded-2xl border border-brand-100 bg-white p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Icon name="info" className="size-4 text-brand-400" />
              Why this number
            </h2>
            {isExport ? (
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-brand-800">
                <p className="text-pretty">
                  Exporting IT or IT-enabled services puts you under{" "}
                  <strong>section 154A</strong>, which taxes gross receipts at a
                  flat rate and settles the liability outright. The slab rates do
                  not apply at all.
                </p>
                <p className="rounded-xl bg-brand-50 px-4 py-3 font-mono text-[13px] text-brand-900">
                  {formatPkr(annualIncome)} × {(exportTax.rate * 100).toFixed(2)}%
                  = <strong>{formatPkr(exportTax.tax)}</strong>
                </p>
                <p className="text-pretty">
                  On ordinary business slabs the same income would cost{" "}
                  <strong>{formatPkr(slab.total)}</strong>. That gap is what this
                  regime is worth, and why the banking-channel condition is worth
                  taking seriously.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-brand-800">
                <p className="text-pretty">
                  Pakistani slab tables are <strong>cumulative</strong>: each band
                  carries a fixed amount covering all tax below it, plus a rate on
                  the excess. Only one band is ever applied — you do not add them
                  up.
                </p>
                <p className="rounded-xl bg-brand-50 px-4 py-3 font-mono text-[13px] text-brand-900">
                  fixed amount + (income − band floor) × band rate
                </p>
                <p className="text-pretty">
                  Your marginal rate is{" "}
                  <strong>{(slab.marginalRate * 100).toFixed(0)}%</strong>, but
                  the effective rate across your whole income is{" "}
                  {(effectiveRate * 100).toFixed(2)}%.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-brand-100 bg-white p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Icon name="verified" className="size-4 text-brand-400" />
              What being {filer === "filer" ? "a filer" : "a non-filer"} costs you
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-800 text-pretty">
              Filer status does not change the slab table — that is the part most
              people get wrong. It changes the{" "}
              <strong>withholding deducted from you everywhere else</strong>,
              which the Tenth Schedule generally doubles for people off the
              Active Taxpayers List.
            </p>

            <div className="relative mt-4 min-w-0 overflow-x-auto">
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
                      {(LOCAL_SERVICES_WHT.generalServicesFilerLow * 100).toFixed(
                        0,
                      )}
                      –
                      {(
                        LOCAL_SERVICES_WHT.generalServicesFilerHigh * 100
                      ).toFixed(0)}
                      %
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

            <p className="mt-4 text-xs leading-relaxed text-brand-700/80 text-pretty">
              Service rates are a range because published FBR rate cards disagree
              on the exact figure. Confirm the rate for your service before
              relying on it. Vehicles are tripled rather than doubled.
            </p>

            {filer === "nonfiler" && isExport ? (
              <p className="mt-4 rounded-xl border-2 border-gold-500 bg-gold-300/20 p-4 text-sm leading-relaxed text-brand-900 text-pretty">
                <strong>As a non-filer you cannot use the 154A rate.</strong>{" "}
                Filing a return is a condition of the final-tax treatment, so
                staying off the list puts the {IT_EXPORT.pseb * 100}% rate out of
                reach and doubles your withholding everywhere else.
              </p>
            ) : null}
          </section>

          {/* AdSense unit goes here */}
          <div
            data-ad-placement="calculator-below-results"
            className="flex min-h-[90px] items-center justify-center rounded-2xl border border-dashed border-brand-200 text-xs uppercase tracking-widest text-brand-700/70"
          >
            Advertisement
          </div>
        </div>
      </div>
    </div>
  );
}
