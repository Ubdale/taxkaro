import Link from "next/link";
import { RATES_VERIFIED_ON, TAX_YEAR } from "@/lib/tax-rates";
import { SITE_NAME } from "@/lib/site";

const NAV = [
  { href: "/", label: "Calculator" },
  { href: "/invoice", label: "Invoice" },
  { href: "/guides", label: "Guides" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-panel">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-4 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight text-brand">
            {SITE_NAME}
          </span>
          <span className="hidden text-xs text-muted sm:inline">
            Pakistan freelancer tax
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-muted">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand">
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
    <footer className="mt-16 border-t border-line bg-panel">
      <div className="mx-auto max-w-5xl space-y-3 px-4 py-8 text-xs leading-relaxed text-muted">
        <p className="max-w-3xl">
          <strong className="text-ink">Not tax advice.</strong> {SITE_NAME} is a
          calculator, not an accountant. Figures are estimates based on published
          FBR rates for {TAX_YEAR} and do not account for your deductions,
          credits, exemptions, provincial sales tax on services, or anything
          specific to your situation. Confirm with a tax practitioner or FBR
          before you file.
        </p>
        <p>Rates last verified {verified}. Rates change every July.</p>
        <p className="font-medium text-ink">
          Everything runs in your browser. No income figure you type is sent to a
          server or stored anywhere.
        </p>
      </div>
    </footer>
  );
}
