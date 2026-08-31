# TaxKaro

A free tax and invoice calculator for freelancers in Pakistan. Works out income
tax on FBR rates, shows what the PSEB IT-export regime is worth, compares filer
against non-filer, and generates a PKR invoice as a PDF.

Everything runs client-side. There is no backend, no database and no accounts —
no income figure a visitor types is ever transmitted or stored.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- `@react-pdf/renderer` for invoice PDFs, loaded on demand so it stays out of
  the initial bundle

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
npm test           # verifies the tax maths — see below
```

## ⚠️ The rates need updating every year

[`lib/tax-rates.ts`](lib/tax-rates.ts) is the single source of truth for every
number in the app. Pakistan's rates are reset by the Finance Act each June and
take effect on 1 July, so **this file goes stale annually**.

It currently holds **Tax Year 2027** (income year 1 July 2026 – 30 June 2027),
verified on 1 September 2026. To update:

1. Change `TAX_YEAR` and `RATES_VERIFIED_ON`.
2. Re-check every table against a primary source.
3. Run `npm test` — the boundary cases will need updating with the rates, which
   is deliberate: it forces you to confirm each one.

The "rates last verified" line in the footer and on every guide reads from
`RATES_VERIFIED_ON`, so it updates itself.

### Where the current numbers came from

- **Slab tables** — PwC Worldwide Tax Summaries, Pakistan (reviewed 24 August
  2026). Note freelancers use the **non-salaried** table (15%–45%), not the
  salaried one (1%–35%) that most online calculators show.
- **Section 154A IT export** — 0.25% PSEB-registered / 1% otherwise, both final
  tax, regime legislated to 30 June 2029. Corroborated across three independent
  sources.
- **Non-filer withholding** — Tenth Schedule: generally +100% for those not on
  the Active Taxpayers List.

### Known uncertainty

Published rate cards **disagree** on section 153 withholding for general
services — some say 11%, others 7%, with a reduced rate for IT services. The UI
deliberately shows this as an indicative *range* rather than a precise figure,
and says so on screen. Do not tighten that into a single number without a
primary source.

## Testing the tax maths

`npm test` checks the calculation at every slab boundary against hand-computed
values, asserts the function is monotonic across 0–15m, and verifies the export
rates. Given that wrong numbers here cost users real money, treat a failure as a
release blocker.

The test also reports the surcharge cliff at PKR 10,000,000 as a `WARN`. That is
expected and correct — it is a real feature of the law, not a bug. Crossing the
threshold applies a 10% surcharge to the *entire* tax bill, so earning Rs 1,000
more costs roughly Rs 359,000.

## Deploying to Vercel

```bash
npm i -g vercel
vercel          # links the project and deploys a preview
vercel --prod
```

Or push to GitHub and import the repo at vercel.com/new — Next.js is detected
automatically and needs no build configuration.

### After the first deploy

1. **Add the custom domain** (Settings → Domains) and point DNS as instructed.
2. **Set `NEXT_PUBLIC_SITE_URL`** to that domain (Settings → Environment
   Variables) and redeploy. Canonicals, `sitemap.xml`, `robots.txt` and all
   JSON-LD read from it; until it is set they point at the placeholder in
   [`lib/site.ts`](lib/site.ts).
3. **Submit the sitemap** in Google Search Console.

## AdSense

Placeholder slots are marked with an `AdSense unit goes here` comment and render
a dashed box at a reserved height, so dropping in the real unit causes no layout
shift. They sit beside the calculator results, below the homepage FAQ, and on
each guide page.

To go live, replace each placeholder with the real `<ins class="adsbygoogle">`
snippet and add the AdSense script to [`app/layout.tsx`](app/layout.tsx).

Note this is a finance/tax niche, which carries higher CPC but also stricter
review — the "not tax advice" disclaimers in the footer and on each guide are
there for users, and also help with YMYL quality assessment.

## SEO

Implemented: per-page titles and descriptions targeting the intended keywords,
Open Graph and Twitter cards, `app/sitemap.ts` and `app/robots.ts`, JSON-LD
(`WebApplication` on the tools, `Article` on guides, `FAQPage` on the homepage),
one `<h1>` per page, canonical URLs, and `lang="en-PK"`.

Not done, worth doing before launch:

- **No OG image.** `summary_large_image` is declared with nothing to serve. Add
  `app/opengraph-image.tsx` or a static 1200×630 `public/og.png`.
- **No favicon.** Add `app/icon.png`.
- **Urdu keyword variants** are not present. The plan called for Urdu/English
  variants in headings; the current copy is English-only.

## A note on accuracy

This is a calculator, not tax advice, and the app says so in the footer and on
every guide. It takes gross income and does not model deductible expenses, tax
credits, provincial sales tax on services, or withholding already deducted — all
of which can move a real bill substantially. That framing is deliberate and
should survive any redesign.
