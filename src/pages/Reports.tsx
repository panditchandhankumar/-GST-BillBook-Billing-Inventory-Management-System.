import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const monthlyData = [
  { month: "Jan", sales: 85000, purchases: 42000 },
  { month: "Feb", sales: 92000, purchases: 48000 },
  { month: "Mar", sales: 78000, purchases: 35000 },
  { month: "Apr", sales: 101200, purchases: 51200 },
];

const Reports = () => {
  const totalSales = monthlyData.reduce((s, d) => s + d.sales, 0);
  const totalPurchases = monthlyData.reduce((s, d) => s + d.purchases, 0);
  const profit = totalSales - totalPurchases;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">Analyze your business performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Sales", value: `₹${(totalSales / 1000).toFixed(0)}k`, icon: TrendingUp, gradient: "gradient-primary" },
          { label: "Total Purchases", value: `₹${(totalPurchases / 1000).toFixed(0)}k`, icon: TrendingDown, gradient: "gradient-warning" },
          { label: "Net Profit", value: `₹${(profit / 1000).toFixed(0)}k`, icon: BarChart3, gradient: "gradient-success" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold text-card-foreground mt-1">{s.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${s.gradient} flex items-center justify-center`}><s.icon className="w-5 h-5 text-primary-foreground" /></div>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="purchases">Purchase Report</TabsTrigger>
          <TabsTrigger value="pnl">Profit & Loss</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="mt-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
            <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" />Monthly Sales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" strokeOpacity={0.5} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, undefined]} />
                <Bar dataKey="sales" fill="hsl(217 91% 60%)" radius={[6, 6, 0, 0]} name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </TabsContent>
        <TabsContent value="purchases" className="mt-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
            <h3 className="font-semibold text-card-foreground mb-4">Monthly Purchases</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" strokeOpacity={0.5} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, undefined]} />
                <Bar dataKey="purchases" fill="hsl(262 83% 58%)" radius={[6, 6, 0, 0]} name="Purchases" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </TabsContent>
        <TabsContent value="pnl" className="mt-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
            <h3 className="font-semibold text-card-foreground mb-4">Profit & Loss Statement</h3>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Total Revenue</span>
                <span className="text-sm font-semibold text-success">₹{totalSales.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Total Purchases</span>
                <span className="text-sm font-semibold text-destructive">₹{totalPurchases.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Expenses</span>
                <span className="text-sm font-semibold text-destructive">₹40,750</span>
              </div>
              <div className="flex justify-between py-3 bg-muted/30 rounded-lg px-3">
                <span className="text-sm font-semibold text-card-foreground">Net Profit</span>
                <span className="text-lg font-bold text-success">₹{(profit - 40750).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
