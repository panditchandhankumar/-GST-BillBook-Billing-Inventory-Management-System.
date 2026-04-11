import { useMemo, useState } from "react";
import { Download, FileCheck2, Search, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppData } from "@/contexts/AppDataContext";
import { formatCurrency } from "@/lib/billing";
import { toast } from "sonner";

const EInvoicing = () => {
  const { invoices, eInvoices, generateEInvoice, cancelEInvoice } = useAppData();
  const [search, setSearch] = useState("");

  const rows = useMemo(() => invoices
    .map((invoice) => ({
      invoice,
      eInvoice: eInvoices.find((entry) => entry.invoiceId === invoice.id),
    }))
    .filter(({ invoice }) => {
      const query = search.toLowerCase();
      return invoice.invoiceNo.toLowerCase().includes(query) || invoice.partyName.toLowerCase().includes(query);
    })
    .sort((a, b) => new Date(b.invoice.date).getTime() - new Date(a.invoice.date).getTime()), [eInvoices, invoices, search]);

  const handleDownload = (invoiceNo: string, ackNo: string, irn: string) => {
    const blob = new Blob([
      `E-Invoice Acknowledgement\nInvoice: ${invoiceNo}\nIRN: ${irn}\nACK: ${ackNo}\nGenerated from the billing app.`,
    ], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${invoiceNo}-einvoice.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">E-Invoicing</h1>
        <p className="text-sm text-muted-foreground">Generate and manage e-invoice references for saved invoices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Eligible Invoices</p>
          <p className="text-xl font-bold text-foreground">{invoices.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Generated</p>
          <p className="text-xl font-bold text-success">{eInvoices.filter((entry) => entry.status === "Generated").length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Cancelled</p>
          <p className="text-xl font-bold text-destructive">{eInvoices.filter((entry) => entry.status === "Cancelled").length}</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search invoices..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Invoice</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Party</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">IRN / ACK</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">No invoices available for e-invoicing</td></tr>
            ) : rows.map(({ invoice, eInvoice }) => (
              <tr key={invoice.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium text-primary">{invoice.invoiceNo}</td>
                <td className="px-4 py-3 text-foreground">{invoice.partyName}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(invoice.date).toLocaleDateString("en-IN")}</td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">{formatCurrency(invoice.grandTotal)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{eInvoice ? `${eInvoice.irn} / ${eInvoice.ackNo}` : "Not generated"}</td>
                <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-full text-xs font-medium ${eInvoice?.status === "Cancelled" ? "bg-destructive/10 text-destructive" : eInvoice ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{eInvoice?.status || "Pending"}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => { const record = generateEInvoice(invoice.id); if (record) toast.success(`E-invoice generated for ${record.invoiceNo}`); }}><FileCheck2 className="w-4 h-4 mr-1" />{eInvoice ? "Regenerate" : "Generate"}</Button>
                    {eInvoice && eInvoice.status !== "Cancelled" && <Button size="sm" variant="outline" onClick={() => { cancelEInvoice(invoice.id); toast.success("E-invoice cancelled"); }}><XCircle className="w-4 h-4 mr-1" />Cancel</Button>}
                    {eInvoice && <Button size="sm" variant="outline" onClick={() => handleDownload(invoice.invoiceNo, eInvoice.ackNo, eInvoice.irn)}><Download className="w-4 h-4 mr-1" />Ack</Button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EInvoicing;