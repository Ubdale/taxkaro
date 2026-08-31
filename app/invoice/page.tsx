import type { Metadata } from "next";
import InvoiceGenerator from "@/components/InvoiceGenerator";
import { jsonLd, webApplicationSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Free Freelance Invoice Generator (Pakistan, PKR)",
  description:
    "Create a professional freelance invoice in PKR and download it as a PDF. Free, no signup, and nothing you type is uploaded — the PDF is built in your browser.",
  alternates: { canonical: "/invoice" },
};

export default function InvoicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          ...webApplicationSchema,
          name: "TaxKaro Invoice Generator",
          url: `${webApplicationSchema.url}/invoice`,
          description:
            "Free freelance invoice generator for Pakistan. Build an invoice in PKR and export it as a PDF entirely in your browser.",
        })}
      />

      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Freelance invoice generator
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Fill in the details, watch the preview update, and download a clean PDF
          in rupees. No account, no watermark, and nothing you type leaves your
          browser.
        </p>
      </div>

      <InvoiceGenerator />
    </>
  );
}
