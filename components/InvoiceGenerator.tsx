"use client";

import { useMemo, useState } from "react";
import { formatPkr } from "@/lib/tax-rates";

export type LineItem = {
  id: string;
  description: string;
  quantity: string;
  rate: string;
};

export type InvoiceData = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  fromName: string;
  fromDetails: string;
  fromNtn: string;
  toName: string;
  toDetails: string;
  notes: string;
  items: LineItem[];
};

function num(v: string) {
  const n = Number(v.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function newItem(): LineItem {
  return {
    // crypto.randomUUID needs a secure context; the fallback keeps the form
    // usable over plain http on a LAN address during testing.
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    description: "",
    quantity: "1",
    rate: "",
  };
}

function today() {
  // Built from local date parts, not toISOString(). Pakistan is UTC+5, so a
  // UTC-derived date shows yesterday for anyone opening this before 5am local.
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border-2 border-brand-100 bg-paper px-3 text-sm outline-none transition-colors focus:border-brand-400"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-700">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border-2 border-brand-100 bg-paper px-3 text-sm outline-none transition-colors focus:border-brand-400"
      />
    </label>
  );
}

export default function InvoiceGenerator() {
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

  const total = useMemo(
    () => data.items.reduce((sum, it) => sum + num(it.quantity) * num(it.rate), 0),
    [data.items],
  );

  async function downloadPdf() {
    setBusy(true);
    setError(null);
    try {
      // Loaded on demand — the PDF renderer is large, and most visitors to this
      // page never click download.
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
      // Revoke on the next tick so the download has certainly started.
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
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <section className="space-y-4 rounded-2xl border border-brand-100 bg-white p-6">
          <h2 className="text-sm font-semibold">Invoice details</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              label="Invoice no."
              value={data.invoiceNumber}
              onChange={(v) => set("invoiceNumber", v)}
            />
            <Input
              label="Issue date"
              type="date"
              value={data.issueDate}
              onChange={(v) => set("issueDate", v)}
            />
            <Input
              label="Due date"
              type="date"
              value={data.dueDate}
              onChange={(v) => set("dueDate", v)}
            />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-brand-100 bg-white p-6">
          <h2 className="text-sm font-semibold">From (you)</h2>
          <Input
            label="Your name or business"
            value={data.fromName}
            onChange={(v) => set("fromName", v)}
            placeholder="Ahmed Khan"
          />
          <Input
            label="NTN (optional)"
            value={data.fromNtn}
            onChange={(v) => set("fromNtn", v)}
            placeholder="1234567-8"
          />
          <Textarea
            label="Address / contact"
            value={data.fromDetails}
            onChange={(v) => set("fromDetails", v)}
            placeholder={"Street, City\nemail@example.com\n+92 300 0000000"}
          />
        </section>

        <section className="space-y-4 rounded-2xl border border-brand-100 bg-white p-6">
          <h2 className="text-sm font-semibold">Bill to (client)</h2>
          <Input
            label="Client name"
            value={data.toName}
            onChange={(v) => set("toName", v)}
            placeholder="Acme Inc."
          />
          <Textarea
            label="Client address / contact"
            value={data.toDetails}
            onChange={(v) => set("toDetails", v)}
          />
        </section>

        <section className="space-y-4 rounded-2xl border border-brand-100 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Line items</h2>
            <button
              type="button"
              onClick={() => setData((d) => ({ ...d, items: [...d.items, newItem()] }))}
              className="inline-flex h-11 items-center rounded-xl border-2 border-brand-200 px-4 text-sm font-semibold text-brand-600 transition-colors hover:border-brand-400 hover:bg-brand-50"
            >
              + Add item
            </button>
          </div>

          {data.items.map((item, i) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_4rem_6rem_auto] items-end gap-2"
            >
              <Input
                label={i === 0 ? "Description" : ""}
                value={item.description}
                onChange={(v) => updateItem(item.id, { description: v })}
                placeholder="Website development"
              />
              <Input
                label={i === 0 ? "Qty" : ""}
                value={item.quantity}
                onChange={(v) => updateItem(item.id, { quantity: v })}
              />
              <Input
                label={i === 0 ? "Rate (PKR)" : ""}
                value={item.rate}
                onChange={(v) => updateItem(item.id, { rate: v })}
                placeholder="50000"
              />
              <button
                type="button"
                aria-label={`Remove line item ${i + 1}`}
                disabled={data.items.length === 1}
                onClick={() =>
                  setData((d) => ({
                    ...d,
                    items: d.items.filter((it) => it.id !== item.id),
                  }))
                }
                className="mb-0.5 h-11 w-11 shrink-0 rounded-xl border-2 border-brand-100 text-brand-700 transition-colors hover:border-gold-500 hover:text-gold-600 disabled:cursor-not-allowed disabled:opacity-30"
              >
                &times;
              </button>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-brand-100 bg-white p-6">
          <Textarea
            label="Notes (payment terms, bank details)"
            value={data.notes}
            onChange={(v) => set("notes", v)}
            placeholder="Payment via bank transfer within 14 days."
          />
        </section>
      </div>

      {/* Live preview */}
      <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-brand-100 bg-white p-6 text-sm shadow-[0_12px_32px_-12px_rgba(7,42,29,0.12)]">
          <div className="flex items-start justify-between gap-4 border-b border-brand-100 pb-4">
            <div>
              <div className="text-2xl font-semibold tracking-tight text-brand-800">INVOICE</div>
              <div className="tnum mt-0.5 text-xs text-brand-700">
                {data.invoiceNumber || "—"}
              </div>
            </div>
            <div className="tnum text-right text-xs text-brand-700">
              <div>Issued: {data.issueDate || "—"}</div>
              {data.dueDate ? <div>Due: {data.dueDate}</div> : null}
            </div>
          </div>

          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                From
              </div>
              <div className="mt-1 font-semibold">{data.fromName || "Your name"}</div>
              {data.fromNtn ? (
                <div className="tnum text-xs text-brand-700">NTN: {data.fromNtn}</div>
              ) : null}
              <div className="whitespace-pre-line text-xs text-brand-700">
                {data.fromDetails}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                Bill to
              </div>
              <div className="mt-1 font-semibold">{data.toName || "Client name"}</div>
              <div className="whitespace-pre-line text-xs text-brand-700">
                {data.toDetails}
              </div>
            </div>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-y border-brand-100 text-left text-xs uppercase tracking-wide text-brand-700">
                <th className="py-2 font-medium">Description</th>
                <th className="py-2 text-right font-medium">Qty</th>
                <th className="py-2 text-right font-medium">Rate</th>
                <th className="py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="tnum">
              {data.items.map((it) => (
                <tr key={it.id} className="border-b border-brand-100">
                  <td className="py-2 pr-2">{it.description || "—"}</td>
                  <td className="py-2 text-right">{it.quantity || "0"}</td>
                  <td className="py-2 text-right">{num(it.rate).toLocaleString("en-PK")}</td>
                  <td className="py-2 text-right">
                    {(num(it.quantity) * num(it.rate)).toLocaleString("en-PK")}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="py-3 text-right font-semibold">
                  Total
                </td>
                <td className="tnum py-3 text-right text-xl font-semibold text-brand-600">
                  {formatPkr(total)}
                </td>
              </tr>
            </tfoot>
          </table>

          {data.notes ? (
            <p className="whitespace-pre-line border-t border-brand-100 pt-3 text-xs text-brand-700">
              {data.notes}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={downloadPdf}
          disabled={busy}
          className="h-14 w-full rounded-xl bg-brand-900 text-base font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-60"
        >
          {busy ? "Generating…" : "Download PDF"}
        </button>

        {error ? (
          <p className="rounded-xl border-2 border-gold-500 bg-gold-300/20 px-4 py-3 text-xs text-brand-900">
            {error}
          </p>
        ) : null}

        <p className="text-xs leading-relaxed text-brand-700">
          The PDF is built in your browser and downloaded directly. Nothing you
          type here — your name, your client, your rates — is uploaded anywhere.
        </p>
      </div>
    </div>
  );
}
