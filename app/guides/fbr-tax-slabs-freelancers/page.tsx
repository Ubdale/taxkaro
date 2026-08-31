import type { Metadata } from "next";
import Link from "next/link";
import GuideShell from "@/components/GuideShell";
import {
  BUSINESS_SLABS,
  IT_EXPORT,
  SALARIED_SLABS,
  SURCHARGE,
  TAX_YEAR,
  applySlabs,
  formatPkr,
} from "@/lib/tax-rates";

const PATH = "/guides/fbr-tax-slabs-freelancers";
const TITLE = `FBR tax slabs for freelancers, ${TAX_YEAR}`;
const DESCRIPTION = `The slab table freelancers are actually taxed on for ${TAX_YEAR} — the non-salaried rates, not the salaried ones every other calculator shows — plus the surcharge cliff at Rs 10 million.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", url: PATH },
};

function SlabTable({
  slabs,
  caption,
}: {
  slabs: typeof BUSINESS_SLABS;
  caption: string;
}) {
  return (
    <table>
      <caption className="mb-2 text-left text-sm text-brand-700">{caption}</caption>
      <thead>
        <tr>
          <th>Annual taxable income</th>
          <th>Tax</th>
        </tr>
      </thead>
      <tbody>
        {slabs.map((s) => (
          <tr key={s.from}>
            <td>
              {s.to === null
                ? `Above ${formatPkr(s.from)}`
                : s.from === 0
                  ? `Up to ${formatPkr(s.to)}`
                  : `${formatPkr(s.from)} – ${formatPkr(s.to)}`}
            </td>
            <td>
              {s.rate === 0
                ? "Nil"
                : s.fixed > 0
                  ? `${formatPkr(s.fixed)} + ${(s.rate * 100).toFixed(0)}% of the excess`
                  : `${(s.rate * 100).toFixed(0)}% of the excess`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Page() {
  const cliffBelow = applySlabs(SURCHARGE.threshold, BUSINESS_SLABS, {
    surcharge: true,
  });
  const cliffAbove = applySlabs(SURCHARGE.threshold + 1000, BUSINESS_SLABS, {
    surcharge: true,
  });
  const cliffCost = cliffAbove.total - cliffBelow.total;

  const example = 3_000_000;
  const asBusiness = applySlabs(example, BUSINESS_SLABS, { surcharge: true });
  const asSalaried = applySlabs(example, SALARIED_SLABS);

  return (
    <GuideShell
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      datePublished="2026-09-01"
      readingTime="7 min read"
    >
      <p>
        Almost every &ldquo;Pakistan tax calculator&rdquo; you will find online
        shows the <strong>salaried</strong> slab table. If you are a freelancer,
        that table does not apply to you, and the difference is not small — at
        the same income a freelancer can owe several times what a salaried person
        owes.
      </p>
      <p>
        This page shows the table that actually applies, and the one large
        exception that makes it mostly irrelevant for freelancers with foreign
        clients.
      </p>

      <h2>The slabs that apply to freelance income</h2>
      <p>
        Freelance earnings are <strong>business income</strong>, not salary. The
        salaried table applies only where salary makes up more than 75% of your
        taxable income. For a full-time freelancer it never does, so these are
        your rates for {TAX_YEAR}:
      </p>

      <SlabTable
        slabs={BUSINESS_SLABS}
        caption={`Non-salaried individuals and AOPs, ${TAX_YEAR}`}
      />

      <p>
        Note where it starts. The first rupee above {formatPkr(600_000)} is taxed
        at <strong>15%</strong>. For a salaried person, that same rupee is taxed
        at 1%.
      </p>

      <h3>Compare it with the salaried table</h3>

      <SlabTable
        slabs={SALARIED_SLABS}
        caption={`Salaried individuals, ${TAX_YEAR} — shown for comparison only`}
      />

      <p>
        On {formatPkr(example)} of annual income, a freelancer owes{" "}
        <strong>{formatPkr(asBusiness.total)}</strong> while a salaried person
        owes <strong>{formatPkr(asSalaried.total)}</strong>. That gap of{" "}
        {formatPkr(asBusiness.total - asSalaried.total)} is the single most
        common surprise for people who leave a job to freelance.
      </p>

      <h2>How the table is read</h2>
      <p>
        Pakistani slab tables are <strong>cumulative</strong>, not marginal in
        the way people often assume. Each band carries a fixed amount that covers
        all tax on income below it, plus a percentage on the excess. You do not
        add up every band — you find the one band your income lands in and apply
        it once:
      </p>
      <p>
        <code>Tax = fixed amount for your band + (your income − band floor) × band rate</code>
      </p>
      <p>
        So on {formatPkr(example)}: the band is{" "}
        {formatPkr(1_600_000)}–{formatPkr(3_200_000)}, which carries{" "}
        {formatPkr(170_000)} plus 30% of the excess. The excess is{" "}
        {formatPkr(example - 1_600_000)}, so the tax is {formatPkr(170_000)} +{" "}
        {formatPkr((example - 1_600_000) * 0.3)} ={" "}
        <strong>{formatPkr(asBusiness.total)}</strong>.
      </p>
      <p>
        A common worry is that crossing into a higher band makes you worse off
        overall. For the slabs themselves it does not — only the income above the
        floor is taxed at the higher rate. There is, however, one real exception.
      </p>

      <h2>The cliff at {formatPkr(SURCHARGE.threshold)}</h2>
      <p>
        Non-salaried individuals pay a <strong>{SURCHARGE.rate * 100}% surcharge</strong>{" "}
        once taxable income exceeds {formatPkr(SURCHARGE.threshold)}. The
        surcharge applies to your <em>entire</em> tax bill, not just the portion
        above the threshold — which makes it a genuine cliff rather than a slab.
      </p>
      <p>
        Concretely: at exactly {formatPkr(SURCHARGE.threshold)} the tax is{" "}
        {formatPkr(cliffBelow.total)}. At {formatPkr(SURCHARGE.threshold + 1000)}{" "}
        — one thousand rupees more — it is {formatPkr(cliffAbove.total)}. Earning
        that extra {formatPkr(1000)} costs you{" "}
        <strong>{formatPkr(cliffCost)}</strong> in additional tax.
      </p>
      <p>
        If your income lands near that line, it is worth a conversation with an
        accountant about timing an invoice or a legitimate deductible expense. It
        is one of the few places in the system where a small change in income
        produces a large change in tax.
      </p>

      <h2>Why most freelancers pay far less than this</h2>
      <p>
        Everything above applies to freelance income from{" "}
        <strong>Pakistani clients</strong>. If you export IT or IT-enabled
        services to foreign clients — which describes most Pakistani freelancers
        on Upwork, Fiverr or direct contracts — you fall under a completely
        different regime.
      </p>
      <p>
        Section 154A treats export of IT services as a{" "}
        <strong>final tax on gross receipts</strong>:
      </p>
      <ul>
        <li>
          <strong>{IT_EXPORT.pseb * 100}%</strong> if you are registered with
          PSEB
        </li>
        <li>
          <strong>{IT_EXPORT.nonPseb * 100}%</strong> if you are not
        </li>
      </ul>
      <p>
        Final tax means no further tax is due on that income once you file your
        return. Compare {IT_EXPORT.pseb * 100}% against slab rates reaching 45%
        and the scale becomes obvious — on {formatPkr(example)}, the export
        regime costs {formatPkr(example * IT_EXPORT.pseb)} where the slabs would
        cost {formatPkr(asBusiness.total)}.
      </p>
      <p>
        There are conditions: at least{" "}
        {IT_EXPORT.bankingChannelRequirement * 100}% of your export proceeds must
        come into Pakistan through banking channels, and you must file your
        return. Bringing money in through informal channels does not just risk
        penalties, it forfeits the rate.{" "}
        <Link href="/guides/pseb-registration-for-freelancers">
          The PSEB guide covers registration
        </Link>
        .
      </p>

      <h2>What this table does not include</h2>
      <p>
        The slabs are only the income tax calculation. They do not cover:
      </p>
      <ul>
        <li>
          <strong>Deductible business expenses.</strong> Genuine costs of earning
          the income — equipment, software, internet, a share of rent for a home
          office — reduce taxable income before the slabs are applied. The
          calculator on this site takes gross income, so your real bill may be
          lower.
        </li>
        <li>
          <strong>Provincial sales tax on services.</strong> Punjab, Sindh, KPK
          and Balochistan levy their own sales tax on services, administered
          separately from FBR. Whether it applies to you depends on your province
          and service.
        </li>
        <li>
          <strong>Withholding already deducted.</strong> Tax withheld by clients
          or banks during the year is credited against your final bill.
        </li>
        <li>
          <strong>Tax credits.</strong> Certain investments and donations carry
          credits that reduce the amount payable.
        </li>
      </ul>

      <h2>Keeping this current</h2>
      <p>
        Rates are set by the Finance Act each June and take effect on 1 July, so
        this page needs re-checking every year. If you are reading it well after
        the date at the top, verify against FBR before relying on it — and be
        wary of any calculator that does not tell you which tax year it is using.
      </p>
    </GuideShell>
  );
}
