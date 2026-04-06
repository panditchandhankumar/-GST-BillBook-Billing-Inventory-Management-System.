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
  { name: "Mon", sales: 4200, purchases: 2400 },
  { name: "Tue", sales: 3800, purchases: 1398 },
  { name: "Wed", sales: 5200, purchases: 3800 },
  { name: "Thu", sales: 4780, purchases: 3908 },
  { name: "Fri", sales: 6890, purchases: 4800 },
  { name: "Sat", sales: 7390, purchases: 3800 },
  { name: "Sun", sales: 3490, purchases: 2300 },
];

export function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="purchaseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(262 83% 58%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(262 83% 58%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" strokeOpacity={0.5} />
        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="hsl(220 9% 46%)" />
        <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="hsl(220 9% 46%)" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(0 0% 100%)",
            border: "1px solid hsl(220 13% 91%)",
            borderRadius: "0.75rem",
            boxShadow: "0 10px 25px -3px rgb(0 0 0 / 0.08)",
          }}
          formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, undefined]}
        />
        <Area type="monotone" dataKey="sales" stroke="hsl(217 91% 60%)" fill="url(#salesGrad)" strokeWidth={2} name="Sales" />
        <Area type="monotone" dataKey="purchases" stroke="hsl(262 83% 58%)" fill="url(#purchaseGrad)" strokeWidth={2} name="Purchases" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
