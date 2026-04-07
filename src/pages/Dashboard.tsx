import { motion } from "framer-motion";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Landmark,
  RefreshCw,
  Monitor,
  Settings,
  FileText,
  ExternalLink,
} from "lucide-react";
import { LatestTransactions } from "@/components/LatestTransactions";
import { SalesReportChart } from "@/components/SalesReportChart";
import { TodaysChecklist } from "@/components/TodaysChecklist";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const now = new Date();
  const lastUpdate =
    now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    " | " +
    now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="space-y-5">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold text-foreground"
      >
        Dashboard
      </motion.h1>

      {/* Top Action Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="rounded-xl border border-border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 p-5 relative overflow-hidden">
          <div className="flex items-start gap-3">
            <Monitor className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground text-sm">Book Free Demo</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Get a personalised tour from our solution expert
              </p>
              <button className="text-xs text-primary font-medium mt-2 flex items-center gap-1 hover:underline">
                Book Demo Now <span>→</span>
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20 p-5 relative overflow-hidden">
          <div className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-success mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground text-sm">Save Upto 65%</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Get higher discounts on multi-year plans
              </p>
              <button className="text-xs text-success font-medium mt-2 flex items-center gap-1 hover:underline">
                Talk to Sales <span>→</span>
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 p-5 relative overflow-hidden">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground text-sm">Start Fiscal year 2026-27</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Close accounting books of 2025-26 & Start New Year afresh
              </p>
              <button className="text-xs text-amber-600 font-medium mt-2 flex items-center gap-1 hover:underline">
                Close Books Now <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

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
          <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownCircle className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">To Collect</span>
            </div>
            <p className="text-2xl font-bold text-card-foreground">₹ 0</p>
            <button className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors">
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">To Pay</span>
            </div>
            <p className="text-2xl font-bold text-card-foreground">₹ 0</p>
            <button className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors">
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Landmark className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Total Cash + Bank Balance
              </span>
            </div>
            <p className="text-2xl font-bold text-card-foreground">₹ 220</p>
            <button className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors">
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
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
