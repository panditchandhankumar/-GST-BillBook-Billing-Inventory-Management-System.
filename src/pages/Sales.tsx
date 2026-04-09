import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, FileText, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppData } from "@/contexts/AppDataContext";
import { SplitCreateButton } from "@/components/SplitCreateButton";
import { toast } from "sonner";

const Sales = () => {
  const navigate = useNavigate();
  const { invoices, deleteInvoice } = useAppData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = invoices.filter((inv) => {
    const matchSearch = inv.partyName.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalSales = invoices.reduce((s, i) => s + i.grandTotal, 0);
  const paidAmount = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.grandTotal, 0);
  const unpaidAmount = invoices.filter(i => i.status !== "Paid").reduce((s, i) => s + (i.grandTotal - i.amountPaid), 0);

  const statusColor = (s: string) => {
    if (s === "Paid") return "text-success bg-success/10";
    if (s === "Unpaid") return "text-destructive bg-destructive/10";
    return "text-warning bg-warning/10";
  };

  const handleDelete = (id: string) => {
    deleteInvoice(id);
    toast.success("Invoice deleted successfully");
  };

  const fmt = (n: number) => `₹ ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Sales Invoices</h1>
        <SplitCreateButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Sales</p>
          <p className="text-xl font-bold text-foreground">{fmt(totalSales)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Paid</p>
          <p className="text-xl font-bold text-success">{fmt(paidAmount)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Unpaid</p>
          <p className="text-xl font-bold text-destructive">{fmt(unpaidAmount)}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground">
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Partial">Partial</option>
        </select>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Invoice No</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Party</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No invoices found</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate("/sales/create")}>Create Invoice</Button>
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-foreground">
                      {new Date(inv.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-primary font-medium">{inv.invoiceNo}</td>
                    <td className="px-4 py-3 text-foreground">{inv.partyName}</td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">{fmt(inv.grandTotal)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(inv.status)}`}>{inv.status}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => navigate(`/sales/edit/${inv.id}`)} className="p-1 hover:bg-muted rounded transition-colors" title="Edit">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button onClick={() => handleDelete(inv.id)} className="p-1 hover:bg-destructive/10 rounded transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sales;
