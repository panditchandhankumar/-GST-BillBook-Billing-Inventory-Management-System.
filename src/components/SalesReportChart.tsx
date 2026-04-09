import { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useAppData } from "@/contexts/AppDataContext";

export function SalesReportChart() {
  const { invoices } = useAppData();
  const [period, setPeriod] = useState("Daily");

  // Generate chart data from real invoices (last 7 days)
  const { chartData, totalSales, invoicesMade } = useMemo(() => {
    const now = new Date();
    const days: { name: string; sales: number; date: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const daySales = invoices
        .filter(inv => inv.date === dateStr)
        .reduce((s, inv) => s + inv.grandTotal, 0);
      days.push({
        name: d.toLocaleDateString("en-IN", { weekday: "short" }),
        sales: Math.round(daySales),
        date: dateStr,
      });
    }
    const total = days.reduce((s, d) => s + d.sales, 0);
    const count = invoices.filter(inv => {
      const invDate = new Date(inv.date);
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return invDate >= weekAgo;
    }).length;
    return { chartData: days, totalSales: total, invoicesMade: count };
  }, [invoices]);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);

  return (
    <div>
      <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-base font-semibold text-card-foreground">
          <span className="text-primary">Sales Report</span>
          <span className="text-muted-foreground font-normal">
            {" "}- {startDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} to{" "}
            {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
        </h2>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" strokeOpacity={0.5} />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="hsl(220 9% 46%)" />
              <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="hsl(220 9% 46%)" tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(0 0% 100%)", border: "1px solid hsl(220 13% 91%)", borderRadius: "0.5rem", boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)" }}
                formatter={(value: number) => [`₹ ${value.toLocaleString("en-IN")}`, "Sales"]}
              />
              <Area type="monotone" dataKey="sales" stroke="hsl(142 71% 45%)" fill="url(#salesGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center gap-4 text-right">
          <div>
            <p className="text-xs text-muted-foreground">Last 7 days sales</p>
            <p className="text-2xl font-bold text-card-foreground">₹ {totalSales.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Invoices Made</p>
            <p className="text-2xl font-bold text-card-foreground">{invoicesMade}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
