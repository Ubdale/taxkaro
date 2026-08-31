import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";
import { faqSchema, jsonLd, webApplicationSchema } from "@/lib/schema";
import { IT_EXPORT, TAX_YEAR } from "@/lib/tax-rates";

export const metadata: Metadata = {
  title: "Freelancer Tax Calculator Pakistan (FBR, PSEB & Filer Rates)",
  description:
    "Free freelancer tax calculator for Pakistan. See what you owe on FBR business slabs, the 0.25% PSEB IT-export rate, and what being a non-filer really costs. No signup.",
  alternates: { canonical: "/" },
};

const FAQS = [
  {
    q: "Do freelancers pay tax in Pakistan?",
    a: "Yes. Freelance earnings are taxable income. If your income comes from exporting IT or IT-enabled services to foreign clients, it usually falls under section 154A as a final tax on gross receipts — 0.25% if you are registered with PSEB, otherwise 1%. Income from Pakistani clients is taxed on the normal non-salaried business slabs, which start at 15% above Rs 600,000.",
  },
  {
    q: "What is withholding tax for non-filers in Pakistan?",
    a: "Under the Tenth Schedule of the Income Tax Ordinance, most withholding tax rates are increased by 100% — doubled — for people not on FBR's Active Taxpayers List. That applies to bank transactions, property, vehicles and payments from clients. Vehicles are tripled, and some categories carry their own fixed non-filer figures.",
  },
  {
    q: "How do I become a tax filer in Pakistan?",
    a: "Register for an NTN on FBR's IRIS portal using your CNIC, then file an income tax return for the relevant tax year. Once the return is filed and any tax paid, your name appears on the Active Taxpayers List, which FBR updates regularly. There is no fee to register or file.",
  },
  {
    q: "Is PSEB registration worth it for freelancers?",
    a: "For most freelancers earning from foreign clients, yes. PSEB registration reduces the section 154A final tax from 1% to 0.25% of gross receipts. Registration costs around Rs 1,000 and takes five to ten working days, so it typically pays for itself at fairly low income levels.",
  },
  {
    q: "Does being a filer reduce my income tax?",
    a: "Not directly — the slab rates are the same for filers and non-filers. What filing changes is the withholding tax deducted from you elsewhere, which is generally doubled for non-filers, and whether you can claim the reduced IT-export final tax at all, since filing a return is a condition of it.",
  },
];

const GUIDES = [
  {
    href: "/guides/how-to-become-a-filer-in-pakistan",
    title: "How to become a filer in Pakistan",
    blurb:
      "NTN registration on IRIS, filing your first return, and how long it takes to appear on the Active Taxpayers List.",
  },
  {
    href: "/guides/pseb-registration-for-freelancers",
    title: "PSEB registration for freelancers",
    blurb:
      "What it costs, what it requires, and the income level at which the 0.25% rate starts paying for itself.",
  },
  {
    href: "/guides/fbr-tax-slabs-freelancers",
    title: `FBR tax slabs for freelancers, ${TAX_YEAR}`,
    blurb:
      "The non-salaried slab table freelancers are actually taxed on, and why it differs from the salaried one everybody quotes.",
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(webApplicationSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(faqSchema(FAQS))}
      />

      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Freelancer tax calculator for Pakistan
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Work out what you actually owe FBR on your freelance income for{" "}
          {TAX_YEAR} — including the{" "}
          <strong className="text-brand">
            {IT_EXPORT.pseb * 100}% PSEB IT-export rate
          </strong>{" "}
          most calculators leave out. Free, no signup, and nothing you type
          leaves your browser.
        </p>
      </div>

      <Calculator />

      <section className="mt-14" aria-labelledby="guides-heading">
        <h2 id="guides-heading" className="mb-4 text-xl font-bold tracking-tight">
          Guides
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {GUIDES.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="group rounded border border-line bg-panel p-4 transition-colors hover:border-brand"
            >
              <h3 className="font-semibold leading-snug group-hover:text-brand">
                {g.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{g.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14 max-w-3xl" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="mb-4 text-xl font-bold tracking-tight">
          Frequently asked questions
        </h2>
        <dl className="border-t border-line">
          {FAQS.map((f) => (
            <div key={f.q} className="border-b border-line py-4">
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* AdSense unit goes here */}
      <div
        data-ad-placement="home-below-faq"
        className="mt-10 flex min-h-[90px] items-center justify-center rounded border border-dashed border-line text-xs uppercase tracking-widest text-muted"
      >
        Advertisement
      </div>
    </>
  );
}
