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

/** Tolerates anything typed into a money or quantity field. */
export function num(v: string) {
  const n = Number(v.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function lineTotal(item: LineItem) {
  return num(item.quantity) * num(item.rate);
}

export function invoiceTotal(items: LineItem[]) {
  return items.reduce((sum, it) => sum + lineTotal(it), 0);
}

export function newItem(): LineItem {
  return {
    // crypto.randomUUID needs a secure context; the fallback keeps this usable
    // over plain http on a LAN address while testing on a phone.
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    description: "",
    quantity: "1",
    rate: "",
  };
}

/** Local date parts, not toISOString — Pakistan is UTC+5 and would show yesterday. */
export function today() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function prettyDate(iso: string) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
