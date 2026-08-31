import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react";
import Calculator from "@/components/Calculator";
import Reveal from "@/components/ui/Reveal";
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
    href: "/guides/fbr-tax-slabs-freelancers",
    title: `FBR tax slabs for freelancers, ${TAX_YEAR}`,
    blurb:
      "The non-salaried table freelancers are actually taxed on, and why it differs from the salaried one everybody quotes.",
  },
  {
    href: "/guides/pseb-registration-for-freelancers",
    title: "PSEB registration for freelancers",
    blurb:
      "What it costs, what it requires, and the income level at which the 0.25% rate starts paying for itself.",
  },
  {
    href: "/guides/how-to-become-a-filer-in-pakistan",
    title: "How to become a filer in Pakistan",
    blurb:
      "NTN registration on IRIS, filing your first return, and how long it takes to reach the Active Taxpayers List.",
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

      {/* ------------------------------ Hero ------------------------------ */}
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-12 sm:pt-16">
        <Reveal className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            <Sparkles className="size-3.5 text-gold-600" aria-hidden />
            Updated for tax year {TAX_YEAR}
          </span>

          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl">
            Know exactly what you owe FBR.
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-brand-800 text-pretty">
            Most Pakistani calculators show the <em>salaried</em> slabs. You are
            not salaried — and if you bill foreign clients you may be paying{" "}
            <strong className="text-brand-950">
              {IT_EXPORT.pseb * 100}% instead of 45%
            </strong>{" "}
            without knowing it. Fill in the sentence below.
          </p>
        </Reveal>
      </section>

      <div className="note-rule mx-auto max-w-6xl" />

      {/* --------------------------- Calculator --------------------------- */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <Calculator />
      </section>

      {/* ----------------------------- Guides ----------------------------- */}
      <section
        className="mx-auto max-w-6xl px-6 py-20 sm:py-28"
        aria-labelledby="guides-heading"
      >
        <Reveal>
          <h2
            id="guides-heading"
            className="text-3xl font-semibold tracking-tight text-balance"
          >
            The bits nobody explains properly
          </h2>
          <p className="mt-3 max-w-2xl text-brand-800 text-pretty">
            Plain-language writing on what the rules actually are, what they cost
            you, and what to do about them.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {GUIDES.map((g, i) => (
            <Reveal key={g.href} delay={i * 0.08}>
              <Link
                href={g.href}
                className="group flex h-full flex-col rounded-2xl border border-brand-100 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_12px_32px_-12px_rgba(7,42,29,0.18)]"
              >
                <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-900 group-hover:text-gold-400">
                  <BookOpen className="size-5" aria-hidden />
                </span>
                <h3 className="text-lg font-semibold leading-snug tracking-tight text-balance group-hover:text-brand-600">
                  {g.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-800 text-pretty">
                  {g.blurb}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600">
                  Read
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------ FAQ ------------------------------ */}
      <section
        className="mx-auto max-w-6xl px-6 pb-20 sm:pb-28"
        aria-labelledby="faq-heading"
      >
        <Reveal>
          <h2
            id="faq-heading"
            className="text-3xl font-semibold tracking-tight text-balance"
          >
            Questions freelancers actually ask
          </h2>
        </Reveal>

        <dl className="mt-10 max-w-3xl">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={Math.min(i, 5) * 0.08}>
              <div className="border-t border-brand-100 py-6">
                <dt className="text-lg font-semibold tracking-tight text-balance">
                  {f.q}
                </dt>
                <dd className="mt-2 leading-relaxed text-brand-800 text-pretty">
                  {f.a}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>

        {/* AdSense unit goes here */}
        <div
          data-ad-placement="home-below-faq"
          className="mt-12 flex min-h-[90px] items-center justify-center rounded-2xl border border-dashed border-brand-200 text-xs uppercase tracking-widest text-brand-700/70"
        >
          Advertisement
        </div>
      </section>
    </>
  );
}
