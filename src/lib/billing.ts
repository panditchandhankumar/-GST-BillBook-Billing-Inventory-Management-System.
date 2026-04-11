import { InvoiceLineItem } from "@/contexts/AppDataContext";

type LineLike = Pick<InvoiceLineItem, "qty" | "price" | "discount" | "discountType" | "tax">;

export interface CalculatedLineTotals {
  baseTotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
}

export interface DocumentTotals {
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
}

export function calculateLineTotals(line: LineLike): CalculatedLineTotals {
  const baseTotal = Math.max(0, line.qty) * Math.max(0, line.price);
  const rawDiscount = line.discountType === "%"
    ? (baseTotal * Math.max(0, line.discount)) / 100
    : Math.max(0, line.discount);
  const discountAmount = Math.min(baseTotal, rawDiscount);
  const taxableAmount = Math.max(0, baseTotal - discountAmount);
  const taxAmount = (taxableAmount * Math.max(0, line.tax)) / 100;

  return {
    baseTotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    total: taxableAmount + taxAmount,
  };
}

export function calculateDocumentTotals(lines: LineLike[]): DocumentTotals {
  return lines.reduce<DocumentTotals>((totals, line) => {
    const lineTotals = calculateLineTotals(line);
    totals.subtotal += lineTotals.baseTotal;
    totals.totalDiscount += lineTotals.discountAmount;
    totals.totalTax += lineTotals.taxAmount;
    totals.grandTotal += lineTotals.total;
    return totals;
  }, {
    subtotal: 0,
    totalDiscount: 0,
    totalTax: 0,
    grandTotal: 0,
  });
}

export function addDays(baseDate: string, days: number): string {
  const date = new Date(baseDate || new Date().toISOString().slice(0, 10));
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function advanceDateByFrequency(
  baseDate: string,
  frequency: "Weekly" | "Monthly" | "Quarterly",
): string {
  const date = new Date(baseDate || new Date().toISOString().slice(0, 10));

  if (frequency === "Weekly") {
    date.setDate(date.getDate() + 7);
  } else if (frequency === "Monthly") {
    date.setMonth(date.getMonth() + 1);
  } else {
    date.setMonth(date.getMonth() + 3);
  }

  return date.toISOString().slice(0, 10);
}

export function formatCurrency(amount: number): string {
  return `₹ ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}