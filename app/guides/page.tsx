import type { Metadata } from "next";
import Link from "next/link";
import { TAX_YEAR } from "@/lib/tax-rates";

export const metadata: Metadata = {
  title: "Tax guides for Pakistani freelancers",
  description:
    "Plain-language guides on freelancer tax in Pakistan: becoming a filer, PSEB registration, and the FBR slab rates that actually apply to freelance income.",
  alternates: { canonical: "/guides" },
};

const GUIDES = [
  {
    href: "/guides/fbr-tax-slabs-freelancers",
    title: `FBR tax slabs for freelancers, ${TAX_YEAR}`,
    blurb:
      "The non-salaried slab table freelancers are actually taxed on, why it is harsher than the salaried one, and the cliff at Rs 10 million.",
  },
  {
    href: "/guides/pseb-registration-for-freelancers",
    title: "PSEB registration for freelancers",
    blurb:
      "What it costs, what it requires, and the income level at which the 0.25% export rate starts paying for itself.",
  },
  {
    href: "/guides/how-to-become-a-filer-in-pakistan",
    title: "How to become a filer in Pakistan",
    blurb:
      "NTN registration on IRIS, filing your first return, and what filer status does and does not change.",
  },
];

export default function GuidesIndex() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <div className="max-w-2xl">
      <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">Guides</h1>
      <p className="mt-4 text-lg leading-relaxed text-brand-800 text-pretty">
        Plain-language writing on freelancer tax in Pakistan — what the rules
        are, what they cost you, and what to actually do about them.
      </p>
      <ul className="mt-10">
        {GUIDES.map((g) => (
          <li key={g.href} className="border-t border-brand-100">
            <Link href={g.href} className="group block py-6">
              <h2 className="text-lg font-semibold leading-snug tracking-tight text-balance group-hover:text-brand-600">
                {g.title}
              </h2>
              <p className="mt-2 leading-relaxed text-brand-800 text-pretty">{g.blurb}</p>
            </Link>
          </li>
        ))}
        </ul>
      </div>
    </div>
  );
}
