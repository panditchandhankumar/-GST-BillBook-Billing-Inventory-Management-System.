import { motion } from "framer-motion";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Landmark,
  RefreshCw,
} from "lucide-react";
import { LatestTransactions } from "@/components/LatestTransactions";
import { SalesReportChart } from "@/components/SalesReportChart";
import { TodaysChecklist } from "@/components/TodaysChecklist";

const Dashboard = () => {
  const now = new Date();
  const lastUpdate = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }) + " | " + now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold text-foreground"
      >
        Dashboard
      </motion.h1>

      {/* Business Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-foreground">Business Overview</h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Last Update: {lastUpdate}</span>
            <button className="p-1 rounded-full hover:bg-muted transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* To Collect */}
          <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownCircle className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">To Collect</span>
            </div>
            <p className="text-2xl font-bold text-card-foreground">₹ 0</p>
            <button className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors">
              <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </button>
          </div>

          {/* To Pay */}
          <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">To Pay</span>
            </div>
            <p className="text-2xl font-bold text-card-foreground">₹ 0</p>
            <button className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors">
              <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </button>
          </div>

          {/* Total Cash + Bank Balance */}
          <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Landmark className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Total Cash + Bank Balance</span>
            </div>
            <p className="text-2xl font-bold text-card-foreground">₹ 220</p>
            <button className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors">
              <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Latest Transactions + Today's Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card"
        >
          <div className="p-4 border-b border-border">
            <h2 className="text-base font-semibold text-card-foreground">Latest Transactions</h2>
          </div>
          <LatestTransactions />
          <div className="p-3 text-center border-t border-border">
            <button className="text-sm text-primary font-medium hover:underline">
              See All Transactions
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-border bg-card"
        >
          <div className="p-4 border-b border-border">
            <h2 className="text-base font-semibold text-card-foreground">Today's Checklist</h2>
          </div>
          <TodaysChecklist />
        </motion.div>
      </div>

      {/* Sales Report */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-border bg-card"
      >
        <SalesReportChart />
      </motion.div>
    </div>
  );
};

export default Dashboard;
