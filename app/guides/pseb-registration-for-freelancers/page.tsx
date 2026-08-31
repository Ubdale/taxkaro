import type { Metadata } from "next";
import Link from "next/link";
import GuideShell from "@/components/GuideShell";
import { IT_EXPORT, formatPkr } from "@/lib/tax-rates";

const PATH = "/guides/pseb-registration-for-freelancers";
const TITLE = "PSEB registration for freelancers: is it worth it?";
const DESCRIPTION =
  "PSEB registration cuts the IT-export final tax from 1% to 0.25%. What it costs, what it requires, and the income level where it starts paying for itself.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", url: PATH },
};

const FEE = 1000;
/** Income at which the 0.75pp saving covers the ~Rs 1,000 registration fee. */
const BREAK_EVEN = Math.ceil(FEE / (IT_EXPORT.nonPseb - IT_EXPORT.pseb));

export default function Page() {
  const examples = [600_000, 1_200_000, 3_000_000, 6_000_000, 12_000_000];

  return (
    <GuideShell
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      datePublished="2026-09-01"
      readingTime="6 min read"
    >
      <p>
        The short answer, for almost any freelancer earning from foreign clients:{" "}
        <strong>yes, and the maths is not close.</strong>
      </p>
      <p>
        Registration with the Pakistan Software Export Board costs around{" "}
        {formatPkr(FEE)} and takes five to ten working days. It reduces your
        final tax on exported IT services from{" "}
        <strong>{IT_EXPORT.nonPseb * 100}%</strong> of gross receipts to{" "}
        <strong>{IT_EXPORT.pseb * 100}%</strong>. That is a saving of{" "}
        {((IT_EXPORT.nonPseb - IT_EXPORT.pseb) * 100).toFixed(2)} percentage
        points on everything you earn.
      </p>

      <h2>Where it breaks even</h2>
      <p>
        The fee pays for itself once your annual export income passes roughly{" "}
        <strong>{formatPkr(BREAK_EVEN)}</strong>. Above that, every rupee is pure
        saving.
      </p>

      <table>
        <thead>
          <tr>
            <th>Annual export income</th>
            <th>Tax at {IT_EXPORT.nonPseb * 100}%</th>
            <th>Tax at {IT_EXPORT.pseb * 100}%</th>
            <th>You save</th>
          </tr>
        </thead>
        <tbody>
          {examples.map((income) => {
            const without = income * IT_EXPORT.nonPseb;
            const with_ = income * IT_EXPORT.pseb;
            return (
              <tr key={income}>
                <td>{formatPkr(income)}</td>
                <td>{formatPkr(without)}</td>
                <td>{formatPkr(with_)}</td>
                <td>
                  <strong>{formatPkr(without - with_)}</strong>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p>
        At {formatPkr(3_000_000)} a year — a fairly ordinary full-time freelance
        income — registration saves you {formatPkr(3_000_000 * 0.0075)} annually
        for a one-off {formatPkr(FEE)}. There are not many decisions in tax with
        that return.
      </p>

      <h2>What you need to register</h2>
      <p>
        PSEB has a dedicated freelancer category, separate from the company
        registration route. You will generally need:
      </p>
      <ul>
        <li>A valid CNIC</li>
        <li>
          An <strong>NTN</strong> from FBR&apos;s IRIS portal — if you do not have
          one,{" "}
          <Link href="/guides/how-to-become-a-filer-in-pakistan">
            start there first
          </Link>
        </li>
        <li>A personal bank account in your own name</li>
        <li>
          Evidence of freelance work — contracts, platform profiles, or invoices
          and remittance records
        </li>
        <li>The registration fee, around {formatPkr(FEE)}</li>
      </ul>
      <p>
        Registration is done through PSEB&apos;s online portal. Processing
        typically takes five to ten working days, and renewal is periodic rather
        than one-time, so diarise it.
      </p>

      <h2>The conditions that actually matter</h2>
      <p>
        Registration alone is not sufficient. The reduced rate is conditional,
        and the conditions are where people come unstuck:
      </p>

      <h3>The {IT_EXPORT.bankingChannelRequirement * 100}% banking channel rule</h3>
      <p>
        At least {IT_EXPORT.bankingChannelRequirement * 100}% of your export
        proceeds must be brought into Pakistan through{" "}
        <strong>approved banking channels</strong>. Money received through
        informal transfer arrangements does not count toward this, and falling
        below the threshold puts the whole concessionary rate at risk — not just
        the portion received informally.
      </p>
      <p>
        Practically: get paid into a Pakistani bank account, through Payoneer or
        Wise into your own bank, or by direct wire. Keep your{" "}
        <strong>Proceeds Realisation Certificates</strong> from the bank. They are
        the evidence that the money arrived the right way, and you will want them
        if anything is ever queried.
      </p>

      <h3>You must actually file</h3>
      <p>
        The final-tax treatment depends on filing your income tax return. A
        freelancer who registers with PSEB but never files does not get the
        {" "}{IT_EXPORT.pseb * 100}% rate — they get the worst of both worlds, having
        paid the fee and still being off the Active Taxpayers List with doubled
        withholding everywhere else.
      </p>

      <h3>Sales tax returns, where applicable</h3>
      <p>
        Where you are registered for sales tax, those returns need to be filed for
        the relevant periods too. Provincial sales tax on services is
        administered separately from FBR, and whether it applies depends on your
        province and the nature of your service.
      </p>

      <h2>How long the rate is guaranteed</h2>
      <p>
        The concessionary regime for IT and IT-enabled services exports is
        legislated to run until <strong>{IT_EXPORT.regimeGuaranteedUntil}</strong>.
        That is unusually long-dated for Pakistani tax policy and is deliberate —
        it exists to give the export sector planning certainty.
      </p>
      <p>
        It is still a policy choice that a future Finance Act could revisit, so
        do not build a ten-year plan on it. For anything inside the next few
        years, it is about as stable as tax policy gets here.
      </p>

      <h2>When it might not be worth it</h2>
      <p>
        To be fair to the other side, registration is not automatic for everyone:
      </p>
      <ul>
        <li>
          <strong>If your clients are Pakistani</strong>, section 154A does not
          apply at all. You are on the ordinary business slabs and PSEB
          registration does nothing for your income tax.
        </li>
        <li>
          <strong>If you earn very little</strong> — below roughly{" "}
          {formatPkr(BREAK_EVEN)} a year from exports — the fee costs more than
          it saves in year one, though it turns positive quickly as you grow.
        </li>
        <li>
          <strong>If you cannot meet the banking-channel condition</strong>,
          registering does not get you the rate. Fix how you get paid first.
        </li>
      </ul>
      <p>
        Outside those cases, the arithmetic is straightforward.{" "}
        <Link href="/">Run your own number through the calculator</Link> — it
        shows the saving for your actual income.
      </p>
    </GuideShell>
  );
}
