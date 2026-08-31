import type { Metadata } from "next";
import InvoiceGenerator from "@/components/InvoiceGenerator";
import { jsonLd, webApplicationSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Free Freelance Invoice Generator (Pakistan, PKR)",
  description:
    "Edit a freelance invoice directly on the page and download it as a PDF in PKR. Free, no signup, and nothing you type is uploaded — the PDF is built in your browser.",
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

      <section className="mx-auto max-w-6xl px-6 pb-8 pt-12 sm:pt-16">
        <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl">
          Freelance invoice generator
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-brand-800 text-pretty">
          Type straight onto the invoice — every field on the page is editable,
          so there is no form to fill and no preview to keep in sync. Download it
          as a PDF in rupees. No account, no watermark, and nothing you type
          leaves your browser.
        </p>
        </div>
      </section>

      <div className="note-rule mx-auto max-w-6xl" />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <InvoiceGenerator />
      </section>
    </>
  );
}
