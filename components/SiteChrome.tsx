import Link from "next/link";
import { RATES_VERIFIED_ON, TAX_YEAR } from "@/lib/tax-rates";
import { SITE_NAME } from "@/lib/site";

const NAV = [
  { href: "/", label: "Calculator" },
  { href: "/invoice", label: "Invoice" },
  { href: "/guides", label: "Guides" },
];

function Mark() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-900 text-sm font-semibold text-gold-400">
      ₨
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-brand-100 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Mark />
          <span className="text-lg font-semibold tracking-tight">{SITE_NAME}</span>
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex h-11 items-center rounded-lg px-2 text-sm font-medium text-brand-800 transition-colors hover:bg-brand-50 hover:text-brand-600 sm:px-3"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const verified = new Date(RATES_VERIFIED_ON).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <footer className="mt-20 bg-brand-950 text-brand-200">
      <div className="note-rule opacity-30" />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Mark />
              <span className="text-lg font-semibold tracking-tight text-white">
                {SITE_NAME}
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-pretty">
              Free tax and invoice tools for freelancers in Pakistan. Everything
              runs in your browser — no income figure you type is sent to a
              server or stored anywhere.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-brand-400">
              Tools
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 space-y-3 border-t border-brand-800 pt-8 text-xs leading-relaxed">
          <p className="max-w-3xl text-pretty">
            <strong className="text-white">Not tax advice.</strong> {SITE_NAME} is
            a calculator, not an accountant. Figures are estimates based on
            published FBR rates for {TAX_YEAR} and do not account for your
            deductions, credits, exemptions, provincial sales tax on services, or
            anything specific to your situation. Confirm with a tax practitioner
            or FBR before you file.
          </p>
          <p className="text-brand-400">
            Rates last verified {verified}. Rates change every July.
          </p>
        </div>
      </div>
    </footer>
  );
}
