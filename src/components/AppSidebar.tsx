import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  ShoppingCart,
  BarChart3,
  Wallet,
  Receipt,
  Settings,
  ChevronDown,
  ChevronRight,
  Zap,
  Shield,
  Award,
  CreditCard,
  FileCheck,
  Repeat,
  UserCheck,
  ShoppingBag,
  ChevronUp,
  ArrowDown,
} from "lucide-react";
import { SplitCreateButton } from "./SplitCreateButton";

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  children?: { path: string; label: string }[];
}

const generalItems: NavItem[] = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/parties", label: "Parties", icon: Users },
  {
    path: "/items", label: "Items", icon: Package,
    children: [
      { path: "/items", label: "Inventory" },
      { path: "/items/godown", label: "Godown (Warehouse)" },
    ],
  },
  {
    path: "/sales", label: "Sales", icon: FileText,
    children: [
      { path: "/sales", label: "Sales Invoices" },
      { path: "/sales/quotation", label: "Quotation / Estimate" },
      { path: "/sales/payment-in", label: "Payment In" },
      { path: "/sales/return", label: "Sales Return" },
      { path: "/sales/credit-note", label: "Credit Note" },
      { path: "/sales/delivery-challan", label: "Delivery Challan" },
      { path: "/sales/proforma", label: "Proforma Invoice" },
    ],
  },
  {
    path: "/purchases", label: "Purchases", icon: ShoppingCart,
    children: [
      { path: "/purchases", label: "Purchase Invoices" },
      { path: "/purchases/payment-out", label: "Payment Out" },
      { path: "/purchases/return", label: "Purchase Return" },
      { path: "/purchases/debit-note", label: "Debit Note" },
      { path: "/purchases/orders", label: "Purchase Orders" },
    ],
  },
  { path: "/reports", label: "Reports", icon: BarChart3 },
];

const accountingItems: NavItem[] = [
  { path: "/cash-bank", label: "Cash & Bank", icon: Wallet },
  { path: "/e-invoicing", label: "E-Invoicing", icon: FileCheck },
  { path: "/automated-bills", label: "Automated Bills", icon: Repeat },
  { path: "/expenses", label: "Expenses", icon: Receipt },
  { path: "/pos-billing", label: "POS Billing", icon: CreditCard },
];

const businessToolItems: NavItem[] = [
  { path: "/staff-payroll", label: "Staff Attendance & Payroll", icon: UserCheck },
  { path: "/manage-users", label: "Manage Users", icon: Users },
  { path: "/online-orders", label: "Online Orders", icon: ShoppingBag },
];

export function AppSidebar() {
  const location = useLocation();
  const [expanded, setExpanded] = useState<string | null>(() => {
    const path = location.pathname;
    if (path.startsWith("/sales")) return "/sales";
    if (path.startsWith("/purchases")) return "/purchases";
    if (path.startsWith("/items")) return "/items";
    return null;
  });
  const [showMore, setShowMore] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (item: NavItem) =>
    item.children?.some((c) => location.pathname === c.path) || location.pathname === item.path;

  const toggleExpand = (path: string) => {
    setExpanded(expanded === path ? null : path);
  };

  const renderItem = (item: NavItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = hasChildren ? isParentActive(item) : isActive(item.path);
    const isExpanded = expanded === item.path;

    return (
      <div key={item.path}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpand(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              active
                ? "bg-primary text-primary-foreground font-medium"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
            }`}
          >
            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
            <span className="flex-1 text-left">{item.label}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        ) : (
          <NavLink to={item.path}>
            <div
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span>{item.label}</span>
            </div>
          </NavLink>
        )}

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-4 pl-4 border-l border-sidebar-border/50 mt-1 space-y-0.5">
                {item.children!.map((child) => (
                  <NavLink key={child.path} to={child.path}>
                    <div
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        isActive(child.path)
                          ? "bg-primary/20 text-primary font-medium"
                          : "text-sidebar-foreground/60 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground"
                      }`}
                    >
                      {child.label}
                    </div>
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderSection = (title: string, items: NavItem[]) => (
    <div className="space-y-1">
      <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40 mb-2">
        {title}
      </p>
      {items.map(renderItem)}
    </div>
  );

  return (
    <aside className="w-[240px] h-screen bg-sidebar flex flex-col border-r border-sidebar-border sticky top-0 z-40">
      {/* Business Name */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-sidebar">B</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">Business Name</p>
            <p className="text-xs text-sidebar-foreground/50">9030194547</p>
          </div>
        </div>
        <SplitCreateButton />
      </div>

      {/* Premium Banner */}
      <div className="mx-3 mb-2 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30">
        <div className="flex items-center gap-2">
          <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">SALE</span>
          <span className="text-xs text-amber-300 font-medium">Buy Premium Plan</span>
          <span className="ml-auto bg-destructive/80 text-destructive-foreground text-[10px] px-1.5 py-0.5 rounded">12 Days Left</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto scrollbar-thin">
        {renderSection("GENERAL", generalItems)}
        {renderSection("ACCOUNTING SOLUTIONS", accountingItems)}
        
        <AnimatePresence>
          {showMore && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {renderSection("BUSINESS TOOLS", businessToolItems)}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowMore(!showMore)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-sidebar-accent/30 text-xs text-sidebar-foreground/60 hover:bg-sidebar-accent/50 transition-colors"
        >
          {showMore ? "Show less" : "Scroll for more options"}
          {showMore ? <ChevronUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
        </button>
      </nav>

      {/* Settings */}
      <div className="px-3 py-2 border-t border-sidebar-border">
        <NavLink to="/settings">
          <div
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              location.pathname.startsWith("/settings")
                ? "bg-primary text-primary-foreground font-medium"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
            }`}
          >
            <Settings className="w-[18px] h-[18px]" />
            <span>Settings</span>
          </div>
        </NavLink>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 flex items-center gap-3 text-[10px] text-sidebar-foreground/40">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" /> 100% Secure
        </div>
        <div className="flex items-center gap-1">
          <Award className="w-3 h-3" /> ISO Certified
        </div>
      </div>
    </aside>
  );
}
