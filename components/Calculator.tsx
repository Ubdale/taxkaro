"use client";

import { useMemo, useState } from "react";
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

type Period = "monthly" | "annual";
type ClientType = "foreign" | "local";

function parseAmount(raw: string) {
  const n = Number(raw.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-semibold">{label}</div>
      {children}
      {hint ? <p className="mt-1.5 text-xs leading-relaxed text-muted">{hint}</p> : null}
    </div>
  );
}

function Toggle<T extends string>({
  value,
  onChange,
  options,
  name,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  name: string;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="flex rounded border border-line">
      {options.map((o, i) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
            i > 0 ? "border-l border-line" : ""
          } ${
            value === o.value
              ? "bg-brand text-white"
              : "bg-panel text-muted hover:text-brand"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  emphasis = false,
}: {
  label: string;
  value: string;
  sub?: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`rounded border p-4 ${
        emphasis ? "border-brand bg-brand-soft" : "border-line bg-panel"
      }`}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </div>
      <div
        className={`tnum mt-1 text-2xl font-bold tracking-tight ${
          emphasis ? "text-brand" : ""
        }`}
      >
        {value}
      </div>
      {sub ? <div className="mt-1 text-xs text-muted">{sub}</div> : null}
    </div>
  );
}

export default function Calculator() {
  const [raw, setRaw] = useState("300000");
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

  // Foreign IT-export income falls under the section 154A final-tax regime.
  // Local-client income falls on the normal business slabs.
  const isExportRegime = clientType === "foreign";
  const taxDue = isExportRegime ? exportTax.tax : slab.total;
  const takeHome = annualIncome - taxDue;
  const effectiveRate = annualIncome > 0 ? taxDue / annualIncome : 0;

  const salariedComparison = useMemo(
    () => applySlabs(annualIncome, SALARIED_SLABS),
    [annualIncome],
  );

  // The surcharge is a genuine cliff: crossing the threshold applies 10% to the
  // entire tax bill, not just the excess. Worth warning about when close.
  const nearSurchargeCliff =
    !isExportRegime &&
    annualIncome > SURCHARGE.threshold * 0.9 &&
    annualIncome < SURCHARGE.threshold * 1.1;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
      {/* ---------------- Inputs ---------------- */}
      {/* self-start stops the panel stretching to match the results column,
          which otherwise leaves a tall empty block under the last input. */}
      <div className="space-y-5 self-start rounded border border-line bg-panel p-5 lg:sticky lg:top-6">
        <Field
          label="Your freelance income"
          hint="Gross, before any tax. Nothing you type here leaves your browser."
        >
          <div className="flex rounded border border-line focus-within:border-brand">
            <span className="flex items-center border-r border-line px-3 text-sm font-medium text-muted">
              PKR
            </span>
            <input
              inputMode="numeric"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              aria-label="Freelance income in rupees"
              className="tnum w-full bg-transparent px-3 py-2 text-lg font-semibold outline-none"
            />
          </div>
          <div className="mt-2">
            <Toggle
              name="Income period"
              value={period}
              onChange={setPeriod}
              options={[
                { value: "monthly", label: "Per month" },
                { value: "annual", label: "Per year" },
              ]}
            />
          </div>
        </Field>

        <Field
          label="Who pays you?"
          hint={
            isExportRegime
              ? "Foreign clients paying for IT or IT-enabled services fall under section 154A — a final tax on gross receipts, not the slabs."
              : "Pakistani clients means normal business slab rates, which reach 45%."
          }
        >
          <Toggle
            name="Client type"
            value={clientType}
            onChange={setClientType}
            options={[
              { value: "foreign", label: "Foreign clients" },
              { value: "local", label: "Pakistani clients" },
            ]}
          />
        </Field>

        {isExportRegime ? (
          <Field
            label="Registered with PSEB?"
            hint={`PSEB registration drops the final tax from ${IT_EXPORT.nonPseb * 100}% to ${
              IT_EXPORT.pseb * 100
            }% of gross receipts. Registration costs about Rs 1,000.`}
          >
            <Toggle
              name="PSEB registration"
              value={pseb ? "yes" : "no"}
              onChange={(v) => setPseb(v === "yes")}
              options={[
                { value: "no", label: "Not registered" },
                { value: "yes", label: "PSEB registered" },
              ]}
            />
          </Field>
        ) : null}

        <Field
          label="Are you a filer?"
          hint="Filer means you are on FBR's Active Taxpayers List. It does not change your slab rate — it changes the withholding tax deducted from you everywhere else."
        >
          <Toggle
            name="Filer status"
            value={filer ? "filer" : "non-filer"}
            onChange={(v) => setFiler(v === "filer")}
            options={[
              { value: "filer", label: "Filer" },
              { value: "non-filer", label: "Non-filer" },
            ]}
          />
        </Field>
      </div>

      {/* ---------------- Results ---------------- */}
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat
            label="Annual income"
            value={formatPkr(annualIncome)}
            sub={period === "monthly" ? `${formatPkr(parseAmount(raw))} × 12` : undefined}
          />
          <Stat
            label="Tax you owe"
            value={formatPkr(taxDue)}
            sub={`${(effectiveRate * 100).toFixed(2)}% of your income`}
            emphasis
          />
          <Stat
            label="You keep"
            value={formatPkr(takeHome)}
            sub={`${formatPkr(Math.round(takeHome / 12))} per month`}
          />
        </div>

        {/* How the number was reached */}
        <section className="rounded border border-line bg-panel">
          <h2 className="border-b border-line px-4 py-3 text-sm font-bold">
            How this was calculated
          </h2>

          {isExportRegime ? (
            <div className="space-y-3 px-4 py-4 text-sm leading-relaxed">
              <p>
                Your income is treated as{" "}
                <strong>export of IT / IT-enabled services</strong> under section
                154A. That is a <strong>final tax on gross receipts</strong> —
                the slab rates do not apply at all, and no further tax is due on
                this income once you file your return.
              </p>
              <div className="tnum rounded bg-brand-soft px-4 py-3 font-mono text-sm">
                {formatPkr(annualIncome)} × {(exportTax.rate * 100).toFixed(2)}% ={" "}
                <strong>{formatPkr(exportTax.tax)}</strong>
              </div>
              {!pseb ? (
                <p className="rounded border border-brand bg-brand-soft px-4 py-3">
                  <strong>Registering with PSEB would save you{" "}
                  {formatPkr(exportTax.tax - itExportTax(annualIncome, true).tax)}{" "}
                  this year.</strong>{" "}
                  The rate drops from {IT_EXPORT.nonPseb * 100}% to{" "}
                  {IT_EXPORT.pseb * 100}%, and registration costs around Rs 1,000.
                </p>
              ) : null}
              <p className="text-muted">
                Conditions apply: at least{" "}
                {IT_EXPORT.bankingChannelRequirement * 100}% of your export
                proceeds must come into Pakistan through banking channels, and you
                must file your income tax return. This regime is legislated to run
                until {IT_EXPORT.regimeGuaranteedUntil}.
              </p>
              <p className="text-muted">
                For comparison, the same income taxed on normal business slabs
                would cost <strong>{formatPkr(slab.total)}</strong> — that is the
                scale of what this regime is worth.
              </p>
            </div>
          ) : (
            <div className="px-4 py-2">
              <table className="w-full text-sm">
                <tbody>
                  {slab.rows.map((row) => (
                    <tr key={row.label} className="border-b border-line last:border-b-0">
                      <td className="py-2.5 pr-4">
                        <div className="font-medium">{row.label}</div>
                        <div className="text-xs text-muted">{row.detail}</div>
                      </td>
                      <td className="tnum py-2.5 text-right font-semibold">
                        {formatPkr(row.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-brand">
                    <td className="py-2.5 font-bold">Total tax</td>
                    <td className="tnum py-2.5 text-right font-bold text-brand">
                      {formatPkr(slab.total)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="pb-3 pt-1 text-xs leading-relaxed text-muted">
                Freelancing income is business income, so these are the
                non-salaried slabs. They are harsher than the salaried ones: a
                salaried person on {formatPkr(annualIncome)} would pay{" "}
                {formatPkr(salariedComparison.total)}.
              </p>
            </div>
          )}
        </section>

        {nearSurchargeCliff ? (
          <div className="rounded border border-warn bg-warn-soft px-4 py-3 text-sm leading-relaxed">
            <strong>Watch the {formatPkr(SURCHARGE.threshold)} line.</strong> Above
            it, a {SURCHARGE.rate * 100}% surcharge applies to your{" "}
            <em>entire</em> tax bill, not just the amount above the threshold.
            Crossing it by one rupee costs roughly{" "}
            {formatPkr(
              applySlabs(SURCHARGE.threshold + 1, BUSINESS_SLABS, { surcharge: true })
                .total -
                applySlabs(SURCHARGE.threshold, BUSINESS_SLABS, { surcharge: true })
                  .total,
            )}
            .
          </div>
        ) : null}

        {/* Filer vs non-filer */}
        <section className="rounded border border-line bg-panel">
          <h2 className="border-b border-line px-4 py-3 text-sm font-bold">
            What being a {filer ? "filer" : "non-filer"} costs you
          </h2>
          <div className="space-y-3 px-4 py-4 text-sm leading-relaxed">
            <p>
              Filer status does not change the slab table — this is the part most
              people get wrong. What it changes is the{" "}
              <strong>withholding tax deducted from you everywhere else</strong>:
              on bank transactions, property, vehicles, and payments from clients.
              Under the Tenth Schedule those rates are generally{" "}
              <strong>doubled</strong> for people not on the Active Taxpayers List.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[26rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                    <th className="py-2 pr-3 font-medium">Withholding on</th>
                    <th className="py-2 pr-3 text-right font-medium">Filer</th>
                    <th className="py-2 text-right font-medium">Non-filer</th>
                  </tr>
                </thead>
                <tbody className="tnum">
                  <tr className="border-b border-line">
                    <td className="py-2 pr-3">
                      Payment for IT services from a Pakistani client
                    </td>
                    <td className="py-2 pr-3 text-right">
                      {(LOCAL_SERVICES_WHT.itServicesFiler * 100).toFixed(0)}%
                    </td>
                    <td className="py-2 text-right font-semibold text-warn">
                      {(
                        LOCAL_SERVICES_WHT.itServicesFiler *
                        NON_FILER_MULTIPLIER *
                        100
                      ).toFixed(0)}
                      %
                    </td>
                  </tr>
                  <tr className="border-b border-line">
                    <td className="py-2 pr-3">Other services (indicative)</td>
                    <td className="py-2 pr-3 text-right">
                      {(LOCAL_SERVICES_WHT.generalServicesFilerLow * 100).toFixed(0)}–
                      {(LOCAL_SERVICES_WHT.generalServicesFilerHigh * 100).toFixed(0)}%
                    </td>
                    <td className="py-2 text-right font-semibold text-warn">
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
                  <tr>
                    <td className="py-2 pr-3">
                      Section 154A IT export final tax
                    </td>
                    <td className="py-2 pr-3 text-right" colSpan={2}>
                      <span className="text-muted">
                        Same either way — but claiming it requires filing a return
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs leading-relaxed text-muted">
              Service withholding rates are shown as a range because published FBR
              rate cards disagree on the exact figure for general services. Treat
              them as indicative and confirm the rate for your specific service
              before relying on it. The doubling rule for non-filers is general;
              vehicles are tripled and a few categories have their own fixed
              non-filer figures.
            </p>

            {!filer && isExportRegime ? (
              <p className="rounded border border-warn bg-warn-soft px-4 py-3">
                <strong>As a non-filer you cannot properly use the 154A regime.</strong>{" "}
                Filing a return is a condition of the final-tax treatment, so
                staying off the Active Taxpayers List puts the{" "}
                {IT_EXPORT.pseb * 100}% rate out of reach and exposes you to
                doubled withholding everywhere else.
              </p>
            ) : null}
          </div>
        </section>

        {/* AdSense unit goes here */}
        <div
          data-ad-placement="calculator-sidebar"
          className="flex min-h-[90px] items-center justify-center rounded border border-dashed border-line text-xs uppercase tracking-widest text-muted"
        >
          Advertisement
        </div>

        <p className="text-xs leading-relaxed text-muted">
          Estimates only, based on published FBR rates for {TAX_YEAR}. They do not
          account for deductible expenses, tax credits, provincial sales tax on
          services, or your particular circumstances. This is not tax advice.
        </p>
      </div>
    </div>
  );
}
