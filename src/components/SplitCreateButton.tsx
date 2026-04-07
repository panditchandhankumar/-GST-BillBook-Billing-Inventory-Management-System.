import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Users, Package, FileText, RotateCcw, CreditCard, Truck, FileCheck, ShoppingCart, ArrowDownLeft, ArrowUpRight, ScrollText, ClipboardList, Receipt } from "lucide-react";

const dropdownItems = [
  { label: "Create Party", path: "/parties", icon: Users },
  { label: "Create Item", path: "/items", icon: Package },
  { label: "Quotation", path: "/sales/quotation", icon: FileText },
  { label: "Payment In", path: "/sales/payment-in", icon: ArrowDownLeft },
  { label: "Sales Return", path: "/sales/return", icon: RotateCcw },
  { label: "Credit Note", path: "/sales/credit-note", icon: CreditCard },
  { label: "Delivery Challan", path: "/sales/delivery-challan", icon: Truck },
  { label: "Proforma Invoice", path: "/sales/proforma", icon: FileCheck },
  { label: "Purchase", path: "/purchases", icon: ShoppingCart },
  { label: "Payment Out", path: "/purchases/payment-out", icon: ArrowUpRight },
  { label: "Purchase Return", path: "/purchases/return", icon: RotateCcw },
  { label: "Debit Note", path: "/purchases/debit-note", icon: ScrollText },
  { label: "Purchase Orders", path: "/purchases/orders", icon: ClipboardList },
  { label: "Create Expense", path: "/expenses", icon: Receipt },
];

export function SplitCreateButton() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <div className="flex w-full">
        <button
          onClick={() => navigate("/sales/create")}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-l-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          + Create Sales Invoice
        </button>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center px-2 py-2.5 rounded-r-lg bg-primary text-primary-foreground hover:bg-primary/90 border-l border-primary-foreground/20 transition-colors"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-xl border border-border bg-popover shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200 max-h-80 overflow-y-auto">
          {dropdownItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
