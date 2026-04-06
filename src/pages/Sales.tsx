import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Eye, Download, Share2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Invoice {
  id: number;
  invoiceNo: string;
  party: string;
  date: string;
  amount: number;
  gst: number;
  total: number;
  status: "paid" | "pending" | "overdue";
}

const sampleInvoices: Invoice[] = [
  { id: 1, invoiceNo: "INV-001", party: "Sharma Electronics", date: "2025-04-05", amount: 10593, gst: 1907, total: 12500, status: "paid" },
  { id: 2, invoiceNo: "INV-002", party: "Patel & Sons", date: "2025-04-04", amount: 21017, gst: 3783, total: 24800, status: "paid" },
  { id: 3, invoiceNo: "INV-003", party: "Singh Enterprises", date: "2025-04-03", amount: 16017, gst: 2883, total: 18900, status: "pending" },
  { id: 4, invoiceNo: "INV-004", party: "Mehta Associates", date: "2025-04-02", amount: 30508, gst: 5492, total: 36000, status: "overdue" },
  { id: 5, invoiceNo: "INV-005", party: "Reddy Corp", date: "2025-04-01", amount: 7627, gst: 1373, total: 9000, status: "paid" },
];

const Sales = () => {
  const [search, setSearch] = useState("");
  const filtered = sampleInvoices.filter((inv) =>
    inv.party.toLowerCase().includes(search.toLowerCase()) || inv.invoiceNo.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s: string) => {
    if (s === "paid") return "bg-success/10 text-success";
    if (s === "pending") return "bg-warning/10 text-warning";
    return "bg-destructive/10 text-destructive";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sales & Invoices</h1>
          <p className="text-sm text-muted-foreground">Create and manage GST invoices</p>
        </div>
        <Button className="gradient-primary text-primary-foreground border-0">
          <Plus className="w-4 h-4 mr-2" />Create Invoice
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Sales", value: "₹1,01,200", gradient: "gradient-primary" },
          { label: "Paid", value: "₹46,300", gradient: "gradient-success" },
          { label: "Pending", value: "₹54,900", gradient: "gradient-warning" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold text-card-foreground mt-1">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Invoice</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Party</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">GST</th>
                <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv, i) => (
                <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-card-foreground">{inv.invoiceNo}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-card-foreground">{inv.party}</td>
                  <td className="p-4 text-sm text-muted-foreground">{new Date(inv.date).toLocaleDateString("en-IN")}</td>
                  <td className="p-4 text-right text-sm text-card-foreground">₹{inv.amount.toLocaleString("en-IN")}</td>
                  <td className="p-4 text-right text-sm text-muted-foreground">₹{inv.gst.toLocaleString("en-IN")}</td>
                  <td className="p-4 text-right text-sm font-semibold text-card-foreground">₹{inv.total.toLocaleString("en-IN")}</td>
                  <td className="p-4 text-center">
                    <Badge className={`${statusColor(inv.status)} border-0 capitalize text-xs`}>{inv.status}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Share2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sales;
