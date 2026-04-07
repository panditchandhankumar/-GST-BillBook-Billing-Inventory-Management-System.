import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, FileText, MoreVertical, ArrowDownCircle, ArrowUpCircle, XCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Invoice {
  id: number;
  date: string;
  invoiceNo: string;
  party: string;
  dueIn: string;
  amount: number;
  status: "Paid" | "Unpaid" | "Cancelled";
}

const sampleInvoices: Invoice[] = [
  { id: 1, date: "02 Apr 2026", invoiceNo: "1", party: "Cash Sale", dueIn: "-", amount: 220, status: "Paid" },
];

const Sales = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("Last 365 Days");

  const filtered = sampleInvoices.filter((inv) =>
    inv.party.toLowerCase().includes(search.toLowerCase()) || inv.invoiceNo.includes(search)
  );

  const totalSales = sampleInvoices.reduce((s, i) => s + i.amount, 0);
  const paidAmount = sampleInvoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const unpaidAmount = sampleInvoices.filter(i => i.status === "Unpaid").reduce((s, i) => s + i.amount, 0);

  const statusColor = (s: string) => {
    if (s === "Paid") return "text-success";
    if (s === "Unpaid") return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Sales Invoices</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="text-primary border-primary">Reports ▾</Button>
          <Button variant="ghost" size="icon"><svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Total Sales</span>
          </div>
          <p className="text-2xl font-bold text-foreground">₹ {totalSales.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowDownCircle className="w-4 h-4 text-success" />
            <span className="text-sm text-success font-medium">Paid</span>
          </div>
          <p className="text-2xl font-bold text-foreground">₹ {paidAmount.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowUpCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive font-medium">Unpaid</span>
          </div>
          <p className="text-2xl font-bold text-foreground">₹ {unpaidAmount.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-medium">Cancelled</span>
          </div>
          <p className="text-2xl font-bold text-foreground">₹ –</p>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9 w-48" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 border border-input rounded-md px-3 h-10 bg-background text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <select className="bg-transparent border-0 text-sm outline-none" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option>Last 30 Days</option>
              <option>This Quarter</option>
              <option>Previous Quarter</option>
              <option>Current Fiscal Year</option>
              <option>Previous Fiscal Year</option>
              <option>Last 365 Days</option>
              <option>Custom</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">Bulk Actions ▾</Button>
          <Button className="bg-primary text-primary-foreground" onClick={() => navigate("/sales/create")}>
            Create Sales Invoice
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="w-10 px-4 py-3"><input type="checkbox" className="rounded" /></th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Date ⇅</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Invoice Number</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Party Name</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Due In</th>
              <th className="text-right font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Amount ⇅</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Status</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-10 h-10 text-muted-foreground/30" />
                    <p>No Transactions Matching the current filter</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((inv, i) => (
                <motion.tr
                  key={inv.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-border/50 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3"><input type="checkbox" className="rounded" /></td>
                  <td className="px-4 py-3 text-foreground">{inv.date}</td>
                  <td className="px-4 py-3 text-foreground">{inv.invoiceNo}</td>
                  <td className="px-4 py-3 text-foreground">{inv.party}</td>
                  <td className="px-4 py-3 text-muted-foreground">{inv.dueIn}</td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">₹ {inv.amount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${statusColor(inv.status)}`}>{inv.status}</span>
                  </td>
                  <td className="px-4 py-3"><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button></td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
