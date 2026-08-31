import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { InvoiceData } from "./InvoiceGenerator";

/**
 * Rendered only inside a dynamic import from InvoiceGenerator, so the PDF
 * library never lands in the initial bundle.
 *
 * Fonts are deliberately left as the built-in Helvetica: registering a webfont
 * would mean fetching it at download time, which can fail offline and would
 * make a local-only feature depend on the network.
 */

const BRAND = "#0f5132";
const LINE = "#dcdfd6";
const MUTED = "#5d6b63";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: "#14201a", fontFamily: "Helvetica" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    paddingBottom: 12,
  },
  title: { fontSize: 22, fontFamily: "Helvetica-Bold", color: BRAND },
  invoiceNo: { fontSize: 9, color: MUTED, marginTop: 2 },
  dates: { fontSize: 9, color: MUTED, textAlign: "right" },
  partiesRow: { flexDirection: "row", gap: 24, marginTop: 18 },
  party: { flex: 1 },
  partyLabel: {
    fontSize: 8,
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  partyName: { fontFamily: "Helvetica-Bold", fontSize: 11 },
  partyDetail: { color: MUTED, marginTop: 2, lineHeight: 1.4 },
  tableHead: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: LINE,
    paddingVertical: 5,
    marginTop: 22,
  },
  th: {
    fontSize: 8,
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    paddingVertical: 6,
  },
  colDesc: { flex: 1 },
  colQty: { width: 45, textAlign: "right" },
  colRate: { width: 75, textAlign: "right" },
  colAmount: { width: 85, textAlign: "right" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 12,
  },
  totalLabel: { fontFamily: "Helvetica-Bold", fontSize: 11, marginRight: 14 },
  totalValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 15,
    color: BRAND,
    width: 130,
    textAlign: "right",
  },
  notes: {
    marginTop: 26,
    borderTopWidth: 1,
    borderTopColor: LINE,
    paddingTop: 10,
    color: MUTED,
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    fontSize: 8,
    color: MUTED,
    textAlign: "center",
  },
});

function money(n: number) {
  return `PKR ${n.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
}

function toNumber(v: string) {
  const n = Number(v.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function InvoicePdf({
  data,
  total,
}: {
  data: InvoiceData;
  total: number;
}) {
  return (
    <Document
      title={`Invoice ${data.invoiceNumber}`}
      author={data.fromName || "Freelancer"}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.invoiceNo}>{data.invoiceNumber || "-"}</Text>
          </View>
          <View>
            <Text style={styles.dates}>Issued: {data.issueDate || "-"}</Text>
            {data.dueDate ? (
              <Text style={styles.dates}>Due: {data.dueDate}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.partiesRow}>
          <View style={styles.party}>
            <Text style={styles.partyLabel}>From</Text>
            <Text style={styles.partyName}>{data.fromName || "-"}</Text>
            {data.fromNtn ? (
              <Text style={styles.partyDetail}>NTN: {data.fromNtn}</Text>
            ) : null}
            {data.fromDetails ? (
              <Text style={styles.partyDetail}>{data.fromDetails}</Text>
            ) : null}
          </View>
          <View style={styles.party}>
            <Text style={styles.partyLabel}>Bill to</Text>
            <Text style={styles.partyName}>{data.toName || "-"}</Text>
            {data.toDetails ? (
              <Text style={styles.partyDetail}>{data.toDetails}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.tableHead}>
          <Text style={[styles.th, styles.colDesc]}>Description</Text>
          <Text style={[styles.th, styles.colQty]}>Qty</Text>
          <Text style={[styles.th, styles.colRate]}>Rate</Text>
          <Text style={[styles.th, styles.colAmount]}>Amount</Text>
        </View>

        {data.items.map((item) => {
          const qty = toNumber(item.quantity);
          const rate = toNumber(item.rate);
          return (
            <View key={item.id} style={styles.row} wrap={false}>
              <Text style={styles.colDesc}>{item.description || "-"}</Text>
              <Text style={styles.colQty}>{qty.toLocaleString("en-PK")}</Text>
              <Text style={styles.colRate}>{rate.toLocaleString("en-PK")}</Text>
              <Text style={styles.colAmount}>
                {(qty * rate).toLocaleString("en-PK")}
              </Text>
            </View>
          );
        })}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{money(total)}</Text>
        </View>

        {data.notes ? <Text style={styles.notes}>{data.notes}</Text> : null}

        <Text style={styles.footer} fixed>
          Generated with TaxKaro - free tax and invoice tools for freelancers in
          Pakistan
        </Text>
      </Page>
    </Document>
  );
}
