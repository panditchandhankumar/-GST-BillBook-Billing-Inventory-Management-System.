import { useAppData } from "@/contexts/AppDataContext";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

export function TodaysChecklist() {
  const { invoices, customers } = useAppData();

  const overdueInvoices = invoices.filter(inv => {
    if (inv.status === "Paid") return false;
    return new Date(inv.dueDate) < new Date();
  });

  const unpaidCount = invoices.filter(i => i.status === "Unpaid").length;
  const customersWithoutGstin = customers.filter(c => !c.gstin).length;

  const items = [
    {
      done: overdueInvoices.length === 0,
      label: overdueInvoices.length > 0 ? `${overdueInvoices.length} overdue invoice(s) need follow-up` : "No overdue invoices",
      icon: overdueInvoices.length > 0 ? AlertCircle : CheckCircle2,
      color: overdueInvoices.length > 0 ? "text-destructive" : "text-success",
    },
    {
      done: unpaidCount === 0,
      label: unpaidCount > 0 ? `${unpaidCount} unpaid invoice(s) pending` : "All invoices paid",
      icon: unpaidCount > 0 ? Clock : CheckCircle2,
      color: unpaidCount > 0 ? "text-warning" : "text-success",
    },
    {
      done: customersWithoutGstin === 0,
      label: customersWithoutGstin > 0 ? `${customersWithoutGstin} customer(s) missing GSTIN` : "All GSTINs captured",
      icon: customersWithoutGstin > 0 ? AlertCircle : CheckCircle2,
      color: customersWithoutGstin > 0 ? "text-muted-foreground" : "text-success",
    },
  ];

  return (
    <div className="p-4 space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
          <item.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${item.color}`} />
          <span className="text-sm text-card-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
