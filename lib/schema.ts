import { SITE_NAME, SITE_URL } from "./site";

export function jsonLd(data: Record<string, unknown>) {
  return { __html: JSON.stringify(data) };
}

export const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any (web browser)",
  description:
    "Free tax calculator for freelancers in Pakistan. Works out income tax on FBR slabs, compares filer and non-filer costs, and shows the PSEB IT-export final tax rate. Runs entirely in your browser.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "PKR" },
  featureList: [
    "FBR income tax calculator for freelancers",
    "Filer vs non-filer comparison",
    "PSEB IT export final tax (section 154A)",
    "Freelance invoice generator with PDF export",
  ],
};

export function articleSchema(opts: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${opts.path}` },
    datePublished: opts.datePublished,
    dateModified: opts.datePublished,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
