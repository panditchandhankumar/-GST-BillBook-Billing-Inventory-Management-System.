import { motion } from "framer-motion";
import { Plus, Receipt, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

const expenses = [
  { id: 1, desc: "Office Rent", category: "Rent", amount: 15000, date: "2025-04-01" },
  { id: 2, desc: "Electricity Bill", category: "Utilities", amount: 3200, date: "2025-04-03" },
  { id: 3, desc: "Internet Bill", category: "Utilities", amount: 1200, date: "2025-04-03" },
  { id: 4, desc: "Staff Salary - Ramesh", category: "Salary", amount: 18000, date: "2025-04-01" },
  { id: 5, desc: "Stationery", category: "Office", amount: 850, date: "2025-04-04" },
  { id: 6, desc: "Travel - Client Visit", category: "Travel", amount: 2500, date: "2025-04-05" },
];

const Expenses = () => {
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Expenses</h1>
          <p className="text-sm text-muted-foreground">Track and categorize business expenses</p>
        </div>
        <Button className="gradient-primary text-primary-foreground border-0"><Plus className="w-4 h-4 mr-2" />Add Expense</Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl gradient-danger flex items-center justify-center"><Receipt className="w-6 h-6 text-primary-foreground" /></div>
        <div>
          <p className="text-sm text-muted-foreground">Total Expenses (This Month)</p>
          <p className="text-2xl font-bold text-card-foreground">₹{total.toLocaleString("en-IN")}</p>
        </div>
      </motion.div>

      <div className="glass-card divide-y divide-border/50">
        {expenses.map((ex, i) => (
          <motion.div key={ex.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <Receipt className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-card-foreground">{ex.desc}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Tag className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{ex.category}</span>
                  <span className="text-xs text-muted-foreground">· {new Date(ex.date).toLocaleDateString("en-IN")}</span>
                </div>
              </div>
            </div>
            <p className="text-sm font-semibold text-destructive">-₹{ex.amount.toLocaleString("en-IN")}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Expenses;
