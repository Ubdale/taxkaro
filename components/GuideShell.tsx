import Link from "next/link";
import type { ReactNode } from "react";
import { articleSchema, jsonLd } from "@/lib/schema";
import { RATES_VERIFIED_ON } from "@/lib/tax-rates";

type Props = {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  readingTime: string;
  children: ReactNode;
};

export default function GuideShell({
  title,
  description,
  path,
  datePublished,
  readingTime,
  children,
}: Props) {
  const verified = new Date(RATES_VERIFIED_ON).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          articleSchema({ headline: title, description, path, datePublished }),
        )}
      />

      <article className="max-w-2xl">
        <Link
          href="/guides"
          className="text-xs font-semibold uppercase tracking-wide text-muted hover:text-brand"
        >
          &larr; Guides
        </Link>

        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight">
          {title}
        </h1>
        <p className="mt-3 leading-relaxed text-muted">{description}</p>
        <p className="mt-4 border-y border-line py-2 text-xs text-muted">
          <time dateTime={datePublished}>
            {new Date(datePublished).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <span className="mx-2">·</span>
          {readingTime}
          <span className="mx-2">·</span>
          Rates verified {verified}
        </p>

        <div className="prose-doc mt-8">{children}</div>

        {/* AdSense unit goes here */}
        <div
          data-ad-placement={`guide:${path}`}
          className="mt-12 flex min-h-[90px] items-center justify-center rounded border border-dashed border-line text-xs uppercase tracking-widest text-muted"
        >
          Advertisement
        </div>

        <aside className="mt-8 rounded border border-line bg-panel p-4">
          <p className="text-sm leading-relaxed">
            Want the number for your own income?{" "}
            <Link href="/" className="font-medium text-brand underline underline-offset-2">
              The calculator
            </Link>{" "}
            works it out on the current slabs, including the PSEB export rate.
          </p>
        </aside>

        <p className="mt-6 text-xs leading-relaxed text-muted">
          This guide is general information, not tax advice. Rules change every
          July with the Finance Act. Confirm anything that matters with a tax
          practitioner or FBR directly before acting on it.
        </p>
      </article>
    </>
  );
}
