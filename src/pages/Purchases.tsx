import { motion } from "framer-motion";
import { ShoppingCart, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const samplePurchases = [
  { id: 1, billNo: "PUR-001", supplier: "Gupta Traders", date: "2025-04-05", amount: 8200, status: "paid" },
  { id: 2, billNo: "PUR-002", supplier: "Kumar Supplies", date: "2025-04-04", amount: 5600, status: "pending" },
  { id: 3, billNo: "PUR-003", supplier: "National Distributors", date: "2025-04-03", amount: 15400, status: "paid" },
  { id: 4, billNo: "PUR-004", supplier: "Metro Wholesale", date: "2025-04-02", amount: 22000, status: "pending" },
];

const Purchases = () => {
  const [search, setSearch] = useState("");
  const filtered = samplePurchases.filter((p) => p.supplier.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Purchases</h1>
          <p className="text-sm text-muted-foreground">Record and track supplier purchases</p>
        </div>
        <Button className="gradient-primary text-primary-foreground border-0"><Plus className="w-4 h-4 mr-2" />Add Purchase</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search purchases..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bill No</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Supplier</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="p-4 flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-accent" /><span className="text-sm font-medium text-card-foreground">{p.billNo}</span></td>
                  <td className="p-4 text-sm text-card-foreground">{p.supplier}</td>
                  <td className="p-4 text-sm text-muted-foreground">{new Date(p.date).toLocaleDateString("en-IN")}</td>
                  <td className="p-4 text-right text-sm font-semibold text-card-foreground">₹{p.amount.toLocaleString("en-IN")}</td>
                  <td className="p-4 text-center">
                    <Badge className={`${p.status === "paid" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"} border-0 capitalize text-xs`}>{p.status}</Badge>
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

export default Purchases;
