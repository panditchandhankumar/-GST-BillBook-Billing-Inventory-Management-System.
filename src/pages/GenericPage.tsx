import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const pageConfig: Record<string, { title: string; columns: string[]; createLabel: string }> = {
  "/sales/quotation": { title: "Quotation / Estimate", columns: ["Date", "Quotation Number", "Party Name", "Due In", "Amount", "Status"], createLabel: "Create Quotation" },
  "/sales/payment-in": { title: "Payment In", columns: ["Date", "Payment Number", "Party Name", "Amount", "Mode"], createLabel: "Record Payment In" },
  "/sales/return": { title: "Sales Return", columns: ["Date", "Sales Return Number", "Party Name", "Invoice No", "Amount", "Status"], createLabel: "Create Sales Return" },
  "/sales/credit-note": { title: "Credit Note", columns: ["Date", "Credit Note Number", "Party Name", "Amount", "Status"], createLabel: "Create Credit Note" },
  "/sales/delivery-challan": { title: "Delivery Challan", columns: ["Date", "Challan Number", "Party Name", "Amount", "Status"], createLabel: "Create Delivery Challan" },
  "/sales/proforma": { title: "Proforma Invoice", columns: ["Date", "Proforma Number", "Party Name", "Amount", "Status"], createLabel: "Create Proforma" },
  "/purchases/payment-out": { title: "Payment Out", columns: ["Date", "Payment Number", "Party Name", "Amount", "Mode"], createLabel: "Record Payment Out" },
  "/purchases/return": { title: "Purchase Return", columns: ["Date", "Return Number", "Party Name", "Invoice No", "Amount", "Status"], createLabel: "Create Purchase Return" },
  "/purchases/debit-note": { title: "Debit Note", columns: ["Date", "Debit Note Number", "Party Name", "Amount", "Status"], createLabel: "Create Debit Note" },
  "/purchases/orders": { title: "Purchase Orders", columns: ["Date", "Order Number", "Party Name", "Amount", "Status"], createLabel: "Create Purchase Order" },
};

const featurePages: Record<string, boolean> = {
  "/e-invoicing": true,
  "/automated-bills": true,
  "/pos-billing": true,
  "/staff-payroll": true,
  "/manage-users": true,
  "/online-orders": true,
  "/items/godown": true,
};

const GenericPage = () => {
  const { pathname } = useLocation();
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("Last 365 Days");

  const config = pageConfig[pathname];

  if (!config) {
    const title = pathname.slice(1).replace(/[-/]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">This feature is coming soon.</p>
        <Button variant="outline">Go Back</Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">{config.title}</h1>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon"><svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></Button>
        </div>
      </div>

      {/* Search & Filters */}
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
        <Button className="bg-primary text-primary-foreground">{config.createLabel}</Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              {config.columns.map((col) => (
                <th key={col} className={`font-semibold text-muted-foreground px-4 py-3 uppercase text-xs ${col === "Amount" ? "text-right" : "text-left"}`}>
                  {col} {(col === "Date" || col === "Amount") ? "⇅" : ""}
                </th>
              ))}
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={config.columns.length + 1} className="px-4 py-16 text-center text-muted-foreground">
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

export default GenericPage;
