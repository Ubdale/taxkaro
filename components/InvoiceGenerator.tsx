"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Download, FileWarning, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  type InvoiceData,
  type LineItem,
  invoiceTotal,
  lineTotal,
  newItem,
  prettyDate,
  today,
} from "@/lib/invoice";
import { formatPkr } from "@/lib/tax-rates";
import { EditableArea, EditableDate, EditableText } from "./invoice/Editable";

/**
 * The invoice edits itself.
 *
 * This page used to be a form on the left and a preview on the right, which
 * meant every value appeared twice and you edited the copy that was not the
 * deliverable. Now the sheet is the form: fields read as finished document
 * text and reveal themselves on hover and focus.
 */
export default function InvoiceGenerator() {
  const reduced = useReducedMotion();
  const [data, setData] = useState<InvoiceData>({
    invoiceNumber: "INV-001",
    issueDate: today(),
    dueDate: "",
    fromName: "",
    fromDetails: "",
    fromNtn: "",
    toName: "",
    toDetails: "",
    notes: "",
    items: [newItem()],
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const updateItem = (id: string, patch: Partial<LineItem>) =>
    setData((d) => ({
      ...d,
      items: d.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));

  const total = useMemo(() => invoiceTotal(data.items), [data.items]);

  async function downloadPdf() {
    setBusy(true);
    setError(null);
    try {
      // Loaded on demand: the PDF renderer is large and most visitors never
      // press the button.
      const [{ pdf }, { InvoicePdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./InvoicePdf"),
      ]);
      const blob = await pdf(<InvoicePdf data={data} total={total} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.invoiceNumber || "invoice"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      setError(
        e instanceof Error
          ? `Could not generate the PDF: ${e.message}`
          : "Could not generate the PDF.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg bg-white px-6 py-10 shadow-[0_1px_2px_rgba(7,42,29,0.06),0_24px_60px_-24px_rgba(7,42,29,0.35)] sm:px-12 sm:py-14">
          {/* Masthead */}
          <div className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-brand-900 pb-6">
            <div className="min-w-0">
              <h2 className="text-3xl font-semibold tracking-tight text-brand-900">
                Invoice
              </h2>
              <div className="mt-1 flex items-baseline gap-1 font-mono text-sm text-brand-700">
                <span className="text-brand-400">#</span>
                <EditableText
                  value={data.invoiceNumber}
                  onChange={(v) => set("invoiceNumber", v)}
                  label="Invoice number"
                  placeholder="INV-001"
                  className="tnum max-w-[10rem] font-mono"
                />
              </div>
            </div>

            <dl className="shrink-0 text-sm">
              <div className="flex items-center justify-end gap-3">
                <dt className="text-brand-700">Issued</dt>
                <dd className="w-36">
                  <EditableDate
                    value={data.issueDate}
                    onChange={(v) => set("issueDate", v)}
                    label="Issue date"
                  />
                </dd>
              </div>
              <div className="mt-1 flex items-center justify-end gap-3">
                <dt className="text-brand-700">Due</dt>
                <dd className="w-36">
                  <EditableDate
                    value={data.dueDate}
                    onChange={(v) => set("dueDate", v)}
                    label="Due date"
                  />
                </dd>
              </div>
            </dl>
          </div>

          {/* Parties */}
          <div className="grid gap-8 py-8 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-brand-500">
                From
              </h3>
              <EditableText
                value={data.fromName}
                onChange={(v) => set("fromName", v)}
                label="Your name or business"
                placeholder="Your name"
                className="text-lg font-semibold"
              />
              <div className="mt-1 flex items-baseline gap-1 text-sm text-brand-700">
                <span className="shrink-0 font-mono text-[11px] uppercase tracking-wide text-brand-500">
                  NTN
                </span>
                <EditableText
                  value={data.fromNtn}
                  onChange={(v) => set("fromNtn", v)}
                  label="Your NTN"
                  placeholder="optional"
                  className="tnum font-mono text-sm"
                />
              </div>
              <EditableArea
                value={data.fromDetails}
                onChange={(v) => set("fromDetails", v)}
                label="Your address and contact details"
                placeholder={"Street, City\nemail@example.com\n+92 300 0000000"}
                className="mt-1 text-sm leading-relaxed text-brand-700"
              />
            </div>

            <div>
              <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-brand-500">
                Bill to
              </h3>
              <EditableText
                value={data.toName}
                onChange={(v) => set("toName", v)}
                label="Client name"
                placeholder="Client name"
                className="text-lg font-semibold"
              />
              <EditableArea
                value={data.toDetails}
                onChange={(v) => set("toDetails", v)}
                label="Client address and contact details"
                placeholder={"Company\nStreet, City, Country"}
                className="mt-1 text-sm leading-relaxed text-brand-700"
                rows={4}
              />
            </div>
          </div>

          {/* Line items */}
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[30rem] border-collapse">
              <thead>
                <tr className="border-y border-brand-200 text-left font-mono text-[11px] uppercase tracking-[0.18em] text-brand-500">
                  <th scope="col" className="py-2 font-normal">
                    Description
                  </th>
                  <th scope="col" className="w-16 py-2 text-right font-normal">
                    Qty
                  </th>
                  <th scope="col" className="w-28 py-2 text-right font-normal">
                    Rate
                  </th>
                  <th scope="col" className="w-32 py-2 text-right font-normal">
                    Amount
                  </th>
                  <th scope="col" className="w-8 py-2">
                    <span className="sr-only">Remove</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {data.items.map((item, i) => (
                    <motion.tr
                      key={item.id}
                      layout={!reduced}
                      initial={reduced ? false : { opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      className="group border-b border-brand-100"
                    >
                      <td className="py-1.5 pr-2">
                        <EditableText
                          value={item.description}
                          onChange={(v) => updateItem(item.id, { description: v })}
                          label={`Description for line ${i + 1}`}
                          placeholder="What you did"
                        />
                      </td>
                      <td className="py-1.5">
                        <EditableText
                          value={item.quantity}
                          onChange={(v) => updateItem(item.id, { quantity: v })}
                          label={`Quantity for line ${i + 1}`}
                          align="right"
                          className="tnum"
                        />
                      </td>
                      <td className="py-1.5">
                        <EditableText
                          value={item.rate}
                          onChange={(v) => updateItem(item.id, { rate: v })}
                          label={`Rate for line ${i + 1}`}
                          placeholder="0"
                          align="right"
                          className="tnum"
                        />
                      </td>
                      <td className="tnum py-1.5 pr-1 text-right text-sm font-medium">
                        {lineTotal(item).toLocaleString("en-PK")}
                      </td>
                      <td className="py-1.5 text-right">
                        <button
                          type="button"
                          aria-label={`Remove line ${i + 1}`}
                          disabled={data.items.length === 1}
                          onClick={() =>
                            setData((d) => ({
                              ...d,
                              items: d.items.filter((x) => x.id !== item.id),
                            }))
                          }
                          className="rounded p-1 text-brand-300 opacity-0 transition-all hover:bg-gold-300/30 hover:text-gold-600 focus-visible:opacity-100 group-hover:opacity-100 disabled:pointer-events-none"
                        >
                          <Trash2 className="size-3.5" aria-hidden />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={() => setData((d) => ({ ...d, items: [...d.items, newItem()] }))}
            className="mt-3 inline-flex h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50"
          >
            <Plus className="size-4" aria-hidden />
            Add a line
          </button>

          {/* Total */}
          <div className="mt-8 flex justify-end">
            <div className="w-full max-w-xs">
              <div className="flex items-baseline justify-between border-t-2 border-brand-900 pt-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-600">
                  Total due
                </span>
                <motion.span
                  key={total}
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  className="tnum text-2xl font-semibold tracking-tight text-brand-900"
                >
                  {formatPkr(total)}
                </motion.span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-10 border-t border-brand-100 pt-5">
            <h3 className="mb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-brand-500">
              Notes
            </h3>
            <EditableArea
              value={data.notes}
              onChange={(v) => set("notes", v)}
              label="Notes, payment terms or bank details"
              placeholder="Payment via bank transfer within 14 days. IBAN PK00 0000 0000 0000"
              rows={2}
              className="text-sm leading-relaxed text-brand-700"
            />
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-brand-700/70 text-pretty">
          {data.issueDate ? `Issued ${prettyDate(data.issueDate)}. ` : ""}
          Built and downloaded entirely in your browser — nothing you type here is
          uploaded anywhere.
        </p>
      </div>

      {/* Action bar — sticky, so Download stays reachable without scrolling
          back up a long invoice. */}
      <div className="sticky bottom-4 z-20 mt-8 flex justify-center px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-white/95 p-2 pl-5 shadow-[0_12px_36px_-12px_rgba(7,42,29,0.3)] backdrop-blur">
          <span className="hidden text-sm text-brand-700 sm:inline">
            {data.items.length} line{data.items.length === 1 ? "" : "s"} ·{" "}
            <strong className="tnum text-brand-900">{formatPkr(total)}</strong>
          </span>
          <motion.button
            type="button"
            onClick={downloadPdf}
            disabled={busy}
            whileHover={reduced ? undefined : { scale: 1.03 }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-60"
          >
            <Download className="size-4" aria-hidden />
            {busy ? "Generating…" : "Download PDF"}
          </motion.button>
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="mx-auto mt-4 flex max-w-md items-start gap-2 rounded-xl border-2 border-gold-500 bg-gold-300/20 px-4 py-3 text-sm text-brand-900"
        >
          <FileWarning className="mt-0.5 size-4 shrink-0 text-gold-600" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
}
