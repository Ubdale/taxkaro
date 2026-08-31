import type { Metadata } from "next";
import Link from "next/link";
import GuideShell from "@/components/GuideShell";
import { NON_FILER_MULTIPLIER, formatPkr } from "@/lib/tax-rates";

const PATH = "/guides/how-to-become-a-filer-in-pakistan";
const TITLE = "How to become a tax filer in Pakistan";
const DESCRIPTION =
  "Getting an NTN on IRIS, filing your first return, and appearing on the Active Taxpayers List — plus what filer status actually changes, and what it does not.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", url: PATH },
};

export default function Page() {
  return (
    <GuideShell
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      datePublished="2026-09-01"
      readingTime="7 min read"
    >
      <p>
        Becoming a filer in Pakistan means two things happening in order: you
        register with FBR and get a National Tax Number, then you file an income
        tax return. Once the return is in, your name appears on the{" "}
        <strong>Active Taxpayers List</strong>, and that list is what banks, car
        dealers and property registrars actually check.
      </p>
      <p>
        Registration is free. Filing is free. The whole process is done online.
      </p>

      <h2>What filer status changes — and what it does not</h2>
      <p>
        This is worth getting straight before anything else, because it is the
        most commonly misunderstood part of the system.
      </p>
      <p>
        <strong>Being a filer does not lower your income tax rate.</strong> The
        slab tables are identical for filers and non-filers. Anyone telling you
        that filing reduces your income tax is describing something else.
      </p>
      <p>
        What it changes is <strong>withholding tax</strong> — the amounts
        deducted from you at the point of a transaction. Under the Tenth Schedule
        of the Income Tax Ordinance, most withholding rates are increased by 100%
        for people not on the Active Taxpayers List. In plain terms, non-filers
        pay roughly {NON_FILER_MULTIPLIER}× on:
      </p>
      <ul>
        <li>Cash withdrawals and various banking transactions</li>
        <li>Payments received from clients who are withholding agents</li>
        <li>Property purchases and sales</li>
        <li>Vehicle registration and token tax — tripled rather than doubled</li>
        <li>Dividends and profit on debt</li>
      </ul>
      <p>
        For a freelancer there is a second, larger consequence: the concessionary
        IT-export final tax under section 154A is conditional on filing a return.
        Stay off the list and you cannot claim it —{" "}
        <Link href="/guides/pseb-registration-for-freelancers">
          the PSEB guide
        </Link>{" "}
        covers what that regime is worth.
      </p>
      <p>
        There is also a straightforward point that gets lost in the rate
        arithmetic: filing is a legal obligation if your income is above the
        threshold. The withholding differential is an incentive layered on top of
        a requirement, not a menu option.
      </p>

      <h2>Step 1 — Register for an NTN on IRIS</h2>
      <p>
        FBR&apos;s online portal is called <strong>IRIS</strong>. For an
        individual, your <strong>CNIC number is your NTN</strong> — you are not
        issued a separate number, you are registering the one you have.
      </p>
      <ol>
        <li>
          Go to FBR&apos;s IRIS portal and choose registration for an
          unregistered person.
        </li>
        <li>
          Enter your CNIC, name, a mobile number registered in your own name, and
          an email address you control. Both receive verification codes, so they
          must be genuinely yours — a number registered to a family member causes
          problems later.
        </li>
        <li>Enter the codes sent to your phone and email.</li>
        <li>
          You receive a password and PIN. Keep them somewhere durable; recovering
          IRIS credentials is tedious.
        </li>
        <li>
          Log in and complete your profile: address, and your source of income.
          For freelancing, register a <strong>business</strong> against your
          profile with an appropriate business activity and name.
        </li>
      </ol>
      <p>
        Registration is usually same-day. At this point you have an NTN — but you
        are <em>not yet a filer</em>. That takes a return.
      </p>

      <h2>Step 2 — File your income tax return</h2>
      <p>
        Pakistan&apos;s tax year runs 1 July to 30 June. The return for a tax
        year is normally due by 30 September following the year end, though FBR
        frequently extends the date.
      </p>
      <p>Before you start, gather:</p>
      <ul>
        <li>
          <strong>Total income for the year</strong> — for a freelancer, your
          gross receipts. Bank statements and platform earnings reports are the
          usual source.
        </li>
        <li>
          <strong>Bank certificates</strong> showing any tax already withheld,
          and Proceeds Realisation Certificates for foreign remittances.
        </li>
        <li>
          <strong>Expense records</strong>, if you intend to claim deductible
          business expenses.
        </li>
        <li>
          <strong>Details of your assets</strong> — the wealth statement is
          mandatory for individuals and asks what you own and owe.
        </li>
      </ul>
      <p>
        In IRIS, open the return for the relevant tax year, complete the income
        section appropriate to your situation, complete the wealth statement, and
        reconcile it. IRIS will not let you submit until the wealth statement
        reconciles — that is, until the change in your net assets is explained by
        your declared income and expenses. This is the step that takes people by
        surprise and the reason many first-timers use an accountant.
      </p>
      <p>
        Pay any balance due through the portal&apos;s payment slip, then submit.
      </p>

      <h2>Step 3 — Appear on the Active Taxpayers List</h2>
      <p>
        FBR publishes the ATL and updates it regularly. After filing, your name
        appears on the next update — it is not instant on submission.
      </p>
      <p>
        You can check your status by sending your CNIC number (without dashes) by
        SMS to FBR&apos;s ATL service, or by searching the list on FBR&apos;s
        website. Do check rather than assume: a return that was started but never
        successfully submitted leaves you off the list while feeling done.
      </p>

      <h2>Filing late, and previous years</h2>
      <p>
        If you missed the deadline you can still file. A late filer may be placed
        on the ATL on payment of a surcharge, and there are penalties for
        non-filing that accumulate. The cost of filing late is materially lower
        than the cost of not filing, and far lower than the withholding
        differential over a full year.
      </p>
      <p>
        If you have several unfiled years, file them. There is no version of this
        where waiting improves the position.
      </p>

      <h2>Do you have to file if you earned nothing?</h2>
      <p>
        If your income is below the taxable threshold of {formatPkr(600_000)},
        you may have no tax to pay — but filing a <em>nil</em> return is still
        what puts you on the Active Taxpayers List. For a freelancer with an
        irregular year, filing nil is usually the right move: it costs nothing
        and keeps you out of doubled withholding on your banking.
      </p>

      <h2>Should you use an accountant?</h2>
      <p>
        For a straightforward first return with one income source and few assets,
        the portal is manageable on your own, and doing it once teaches you what
        the system wants.
      </p>
      <p>
        Worth paying someone if: you have several income sources, significant
        assets, foreign remittances you need treated correctly under section
        154A, multiple unfiled years to catch up, or a wealth statement that will
        not reconcile. Fees for an individual return are modest relative to
        getting the export treatment wrong.
      </p>
      <p>
        Whichever route you take,{" "}
        <Link href="/">estimate what you owe first</Link> so you can sanity-check
        the number you are being asked to pay.
      </p>
    </GuideShell>
  );
}
