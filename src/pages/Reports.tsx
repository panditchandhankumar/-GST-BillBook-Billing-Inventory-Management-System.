import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ChevronDown, ChevronUp, Search, Package, Users, FileText, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportSection {
  icon: React.ElementType;
  title: string;
  reports: string[];
}

const reportSections: ReportSection[] = [
  {
    icon: FileText,
    title: "Transaction",
    reports: [
      "Sales Summary",
      "GST Sales (With HSN)",
      "HSN Wise Sales Summary",
      "TDS Payable",
      "TDS Receivable",
      "TCS Payable",
      "TCS Receivable",
    ],
  },
  {
    icon: Receipt,
    title: "Expense",
    reports: [
      "Expense Category Report",
      "Expense Transaction Report",
      "Purchase Summary",
    ],
  },
  {
    icon: Package,
    title: "Item",
    reports: [
      "Item Report By Party",
      "Item Sales and Purchase Summary",
      "Low Stock Summary",
      "Rate List",
      "Stock Detail Report",
      "Stock Summary",
    ],
  },
  {
    icon: Users,
    title: "Party",
    reports: [
      "Receivable Ageing Report",
      "Party Report By Item",
      "Party Statement (Ledger)",
      "Party Wise Outstanding",
      "Sales Summary - Category Wise",
    ],
  },
];

const Reports = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Transaction: true,
    Expense: true,
    Item: true,
    Party: true,
  });

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Reports</h1>
        <Button className="bg-primary text-primary-foreground">CA Reports Sharing</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportSections.map((section) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card"
          >
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center gap-2 p-4 border-b border-border hover:bg-muted/20 transition-colors"
            >
              <section.icon className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground text-sm">{section.title}</span>
              <span className="ml-auto">
                {expandedSections[section.title] ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </span>
            </button>
            {expandedSections[section.title] && (
              <div className="p-2">
                {section.reports.map((report, i) => (
                  <button
                    key={report}
                    className="w-full text-left px-3 py-2.5 text-sm text-foreground hover:bg-muted/30 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>{report}</span>
                    {report === "Sales Summary" && (
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    )}
                  </button>
                ))}
                <button className="w-full text-left px-3 py-2 text-sm text-primary font-medium hover:underline">
                  {expandedSections[section.title] ? "See less ∧" : "See more ∨"}
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end">
        <p className="text-xs text-muted-foreground">Find Report <span className="ml-2 text-muted-foreground/50">Ctrl + F</span></p>
      </div>
    </div>
  );
};

export default Reports;
