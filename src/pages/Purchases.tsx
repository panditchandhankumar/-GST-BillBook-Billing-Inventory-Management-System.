import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, FileText, MoreVertical, ArrowDownCircle, ArrowUpCircle, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Purchases = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("Last 365 Days");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Purchase Invoices</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="text-primary border-primary">Reports ▾</Button>
          <Button variant="ghost" size="icon"><svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></Button>
        </div>
      </div>

      {/* Banner */}
      <div className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600 text-primary-foreground rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="text-lg">📱</span>
          </div>
          <div>
            <p className="font-semibold text-sm">Skip typing - Add purchases from your phone</p>
            <p className="text-xs opacity-80">Upload photo/pdf, purchase made in seconds.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">Try on Mobile</Button>
          <button className="text-white/60 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Total Purchases</span>
          </div>
          <p className="text-2xl font-bold text-foreground">₹ 0</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowDownCircle className="w-4 h-4 text-success" />
            <span className="text-sm text-success font-medium">Paid</span>
          </div>
          <p className="text-2xl font-bold text-foreground">₹ 0</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowUpCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive font-medium">Unpaid</span>
          </div>
          <p className="text-2xl font-bold text-foreground">₹ 0</p>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9 w-48" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 border border-input rounded-md px-3 h-10 bg-background text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <select className="bg-transparent border-0 text-sm outline-none" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option>Last 365 Days</option>
              <option>Last 30 Days</option>
              <option>This Quarter</option>
              <option>Custom</option>
            </select>
          </div>
        </div>
        <Button className="bg-primary text-primary-foreground">Create Purchase Invoice</Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Date ⇅</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Purchase Invoice Number</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Party Name</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Due In</th>
              <th className="text-right font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Amount</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Status</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="w-10 h-10 text-muted-foreground/30" />
                  <p>No Transactions Matching the current filter</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Purchases;
