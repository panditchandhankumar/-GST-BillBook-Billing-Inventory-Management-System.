import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Fri", sales: 0 },
  { name: "Sat", sales: 0 },
  { name: "Sun", sales: 0 },
  { name: "Mon", sales: 0 },
  { name: "Tue", sales: 0 },
  { name: "Wed", sales: 0 },
  { name: "Thu", sales: 220 },
];

export function SalesReportChart() {
  const [period, setPeriod] = useState("Daily");
  const totalSales = 220;
  const invoicesMade = 1;

  const startDate = "27 Mar 2026";
  const endDate = "02 Apr 2026";

  return (
    <div>
      <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-base font-semibold text-card-foreground">
          <span className="text-primary">Sales Report</span>
          <span className="text-muted-foreground font-normal"> - {startDate} to {endDate}</span>
        </h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" strokeOpacity={0.5} />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="hsl(220 9% 46%)" />
              <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="hsl(220 9% 46%)" tickFormatter={(v) => `₹ ${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0 0% 100%)",
                  border: "1px solid hsl(220 13% 91%)",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
                }}
                formatter={(value: number) => [`₹ ${value.toLocaleString("en-IN")}`, "Sales"]}
              />
              <Area type="monotone" dataKey="sales" stroke="hsl(142 71% 45%)" fill="url(#salesGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col justify-center gap-4 text-right">
          <div>
            <p className="text-xs text-muted-foreground">Last 7 days sales</p>
            <p className="text-2xl font-bold text-card-foreground">₹ {totalSales}</p>
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
