import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const transactions = [
  { id: 1, desc: "Sale - Sharma Electronics", type: "income", amount: 12500, mode: "Bank", date: "2025-04-05" },
  { id: 2, desc: "Purchase - Gupta Traders", type: "expense", amount: 8200, mode: "Cash", date: "2025-04-05" },
  { id: 3, desc: "Office Rent", type: "expense", amount: 15000, mode: "Bank", date: "2025-04-01" },
  { id: 4, desc: "Sale - Patel & Sons", type: "income", amount: 24800, mode: "Bank", date: "2025-04-04" },
  { id: 5, desc: "Electricity Bill", type: "expense", amount: 3200, mode: "Bank", date: "2025-04-03" },
];

const CashBank = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cash & Bank</h1>
          <p className="text-sm text-muted-foreground">Track all money in and out</p>
        </div>
        <Button className="gradient-primary text-primary-foreground border-0"><Plus className="w-4 h-4 mr-2" />Add Entry</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center"><Wallet className="w-5 h-5 text-primary-foreground" /></div>
            <span className="text-sm font-medium text-muted-foreground">Cash Balance</span>
          </div>
          <p className="text-3xl font-bold text-card-foreground">₹2,45,680</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-success flex items-center justify-center"><Wallet className="w-5 h-5 text-primary-foreground" /></div>
            <span className="text-sm font-medium text-muted-foreground">Bank Balance</span>
          </div>
          <p className="text-3xl font-bold text-card-foreground">₹8,72,340</p>
        </motion.div>
      </div>

      <div className="glass-card divide-y divide-border/50">
        {transactions.map((tx, i) => (
          <motion.div key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === "income" ? "bg-success/10" : "bg-destructive/10"}`}>
                {tx.type === "income" ? <ArrowDownRight className="w-4 h-4 text-success" /> : <ArrowUpRight className="w-4 h-4 text-destructive" />}
              </div>
              <div>
                <p className="text-sm font-medium text-card-foreground">{tx.desc}</p>
                <p className="text-xs text-muted-foreground">{tx.mode} · {new Date(tx.date).toLocaleDateString("en-IN")}</p>
              </div>
            </div>
            <p className={`text-sm font-semibold ${tx.type === "income" ? "text-success" : "text-destructive"}`}>
              {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CashBank;
