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

      <article className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="max-w-2xl">
          <Link
            href="/guides"
            className="inline-flex h-11 items-center text-sm font-medium text-brand-600 hover:text-brand-500"
          >
            <span aria-hidden className="mr-1.5">
              &larr;
            </span>
            All guides
          </Link>

          <h1 className="mt-2 text-4xl font-semibold leading-[1.1] tracking-tight text-balance">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-brand-800 text-pretty">
            {description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-700">
            <time dateTime={datePublished}>
              {new Date(datePublished).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span aria-hidden>·</span>
            <span>{readingTime}</span>
            <span aria-hidden>·</span>
            <span className="rounded-full bg-brand-50 px-2.5 py-1 font-medium text-brand-700">
              Rates verified {verified}
            </span>
          </div>

          <div className="note-rule mt-8" />

          <div className="prose-doc mt-8">{children}</div>

          {/* AdSense unit goes here */}
          <div
            data-ad-placement={`guide:${path}`}
            className="mt-16 flex min-h-[90px] items-center justify-center rounded-2xl border border-dashed border-brand-200 text-xs uppercase tracking-widest text-brand-700/70"
          >
            Advertisement
          </div>

          <aside className="mt-8 rounded-2xl bg-brand-900 p-6 text-white">
            <h2 className="text-lg font-semibold tracking-tight text-balance">
              What does this mean for your income?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-200 text-pretty">
              The calculator works it out on the current slabs, including the
              PSEB export rate.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex h-11 items-center rounded-xl bg-gold-500 px-5 text-sm font-semibold text-brand-950 transition-colors hover:bg-gold-400"
            >
              Run your number
            </Link>
          </aside>

          <p className="mt-8 text-xs leading-relaxed text-brand-700/80 text-pretty">
            This guide is general information, not tax advice. Rules change every
            July with the Finance Act. Confirm anything that matters with a tax
            practitioner or FBR directly before acting on it.
          </p>
        </div>
      </article>
    </>
  );
}
