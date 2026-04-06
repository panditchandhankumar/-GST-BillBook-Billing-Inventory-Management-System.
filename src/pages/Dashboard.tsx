import { motion } from "framer-motion";
import {
  Wallet,
  Landmark,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  FileText,
  Users,
  Package,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { SalesChart } from "@/components/SalesChart";
import { RecentTransactions } from "@/components/RecentTransactions";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here's your business overview.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Cash Balance"
          value="₹2,45,680"
          change="+12.5% from last month"
          changeType="positive"
          icon={Wallet}
          gradient="gradient-primary"
          delay={0}
        />
        <StatCard
          title="Bank Balance"
          value="₹8,72,340"
          change="+8.2% from last month"
          changeType="positive"
          icon={Landmark}
          gradient="gradient-success"
          delay={0.1}
        />
        <StatCard
          title="To Collect"
          value="₹1,34,500"
          change="5 pending invoices"
          changeType="neutral"
          icon={ArrowDownCircle}
          gradient="gradient-warning"
          delay={0.2}
        />
        <StatCard
          title="To Pay"
          value="₹67,890"
          change="3 due payments"
          changeType="negative"
          icon={ArrowUpCircle}
          gradient="gradient-danger"
          delay={0.3}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Sales", value: "₹12,45,000", icon: TrendingUp, color: "text-primary" },
          { label: "Invoices", value: "156", icon: FileText, color: "text-accent" },
          { label: "Parties", value: "84", icon: Users, color: "text-success" },
          { label: "Items", value: "230", icon: Package, color: "text-warning" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            className="glass-card p-4 flex items-center gap-3"
          >
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <div>
              <p className="text-lg font-semibold text-card-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart + Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Sales Overview</h2>
          <SalesChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Recent Transactions</h2>
          <RecentTransactions />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
