import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, FileText, Receipt, Package } from "lucide-react";
import { useAppData } from "@/contexts/AppDataContext";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["hsl(217 91% 60%)", "hsl(142 71% 45%)", "hsl(38 92% 50%)", "hsl(0 84% 60%)", "hsl(262 83% 58%)"];

const Reports = () => {
  const { invoices, expenses, totalRevenue, totalExpenses, profit, customers, items } = useAppData();

  // Monthly sales data
  const monthlySales = useMemo(() => {
    const months: Record<string, number> = {};
    invoices.forEach(inv => {
      const m = inv.date.slice(0, 7); // YYYY-MM
      months[m] = (months[m] || 0) + inv.grandTotal;
    });
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, sales]) => ({
        name: new Date(month + "-01").toLocaleDateString("en-IN", { month: "short" }),
        sales: Math.round(sales),
      }));
  }, [invoices]);

  // Expense by category
  const expenseByCategory = useMemo(() => {
    const cats: Record<string, number> = {};
    expenses.forEach(e => { cats[e.category] = (cats[e.category] || 0) + e.amount; });
    return Object.entries(cats).map(([name, value]) => ({ name, value: Math.round(value) }));
  }, [expenses]);

  // Top customers
  const topCustomers = useMemo(() => {
    const map: Record<string, { name: string; total: number }> = {};
    invoices.forEach(inv => {
      if (!map[inv.partyId]) map[inv.partyId] = { name: inv.partyName, total: 0 };
      map[inv.partyId].total += inv.grandTotal;
    });
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [invoices]);

  const fmt = (n: number) => `₹ ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-foreground">Reports</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-success" />
            <span className="text-xs text-muted-foreground">Revenue</span>
          </div>
          <p className="text-xl font-bold text-success">{fmt(totalRevenue)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-destructive" />
            <span className="text-xs text-muted-foreground">Expenses</span>
          </div>
          <p className="text-xl font-bold text-destructive">{fmt(totalExpenses)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5" style={{ color: profit >= 0 ? "hsl(142 71% 45%)" : "hsl(0 84% 60%)" }} />
            <span className="text-xs text-muted-foreground">{profit >= 0 ? "Profit" : "Loss"}</span>
          </div>
          <p className="text-xl font-bold" style={{ color: profit >= 0 ? "hsl(142 71% 45%)" : "hsl(0 84% 60%)" }}>{fmt(Math.abs(profit))}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-xs text-muted-foreground">Total Invoices</span>
          </div>
          <p className="text-xl font-bold text-foreground">{invoices.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Sales Trend */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Sales Trend</h3>
          {monthlySales.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlySales}>
                <defs>
                  <linearGradient id="reportSalesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" strokeOpacity={0.5} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} />
                <Tooltip formatter={(v: number) => [`₹ ${v.toLocaleString("en-IN")}`, "Sales"]} />
                <Area type="monotone" dataKey="sales" stroke="hsl(217 91% 60%)" fill="url(#reportSalesGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="text-center py-10 text-muted-foreground text-sm">No sales data</p>}
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Expense Breakdown</h3>
          {expenseByCategory.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={220}>
                <PieChart>
                  <Pie data={expenseByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {expenseByCategory.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`₹ ${v.toLocaleString("en-IN")}`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {expenseByCategory.map((cat, idx) => (
                  <div key={cat.name} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                    <span className="text-muted-foreground">{cat.name}</span>
                    <span className="font-medium text-foreground ml-auto">{fmt(cat.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-center py-10 text-muted-foreground text-sm">No expense data</p>}
        </motion.div>
      </div>

      {/* Top Customers */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Top Customers by Revenue</h3>
        {topCustomers.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topCustomers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" strokeOpacity={0.5} />
              <XAxis type="number" fontSize={12} tickLine={false} tickFormatter={v => `₹${v}`} />
              <YAxis type="category" dataKey="name" fontSize={12} tickLine={false} axisLine={false} width={120} />
              <Tooltip formatter={(v: number) => [`₹ ${v.toLocaleString("en-IN")}`, "Revenue"]} />
              <Bar dataKey="total" fill="hsl(217 91% 60%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center py-10 text-muted-foreground text-sm">No data</p>}
      </motion.div>
    </div>
  );
};

export default Reports;
