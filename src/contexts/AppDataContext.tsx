import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// Types
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  gstin: string;
  address: string;
  category: "Customer" | "Supplier";
  balance: number;
  createdAt: string;
}

export interface Item {
  id: string;
  name: string;
  code: string;
  hsn: string;
  price: number;
  purchasePrice: number;
  stock: number;
  unit: string;
  taxRate: number;
}

export interface InvoiceLineItem {
  id: string;
  itemId?: string;
  name: string;
  hsn: string;
  qty: number;
  price: number;
  discount: number;
  discountType: "%" | "₹";
  tax: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  date: string;
  dueDate: string;
  partyId: string;
  partyName: string;
  items: InvoiceLineItem[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  amountPaid: number;
  paymentMode: string;
  status: "Paid" | "Unpaid" | "Partial";
  notes: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMode: string;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  orderNo: string;
  date: string;
  dueDate: string;
  supplierId: string;
  supplierName: string;
  items: InvoiceLineItem[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  status: "Draft" | "Ordered" | "Received";
  notes: string;
  createdAt: string;
}

export interface RecurringBill {
  id: string;
  title: string;
  partyId: string;
  partyName: string;
  itemId: string;
  itemName: string;
  hsn: string;
  qty: number;
  price: number;
  tax: number;
  frequency: "Weekly" | "Monthly" | "Quarterly";
  paymentMode: string;
  nextRun: string;
  lastRun: string;
  status: "Active" | "Paused";
  createdAt: string;
}

export interface CashEntry {
  id: string;
  date: string;
  type: "income" | "expense";
  account: "Cash" | "Bank";
  description: string;
  amount: number;
  createdAt: string;
}

export interface EInvoiceRecord {
  id: string;
  invoiceId: string;
  invoiceNo: string;
  partyName: string;
  irn: string;
  ackNo: string;
  generatedAt: string;
  status: "Generated" | "Cancelled";
}

export interface GenericDocument {
  id: string;
  type: string;
  docNo: string;
  date: string;
  partyId: string;
  partyName: string;
  amount: number;
  status: string;
  notes: string;
  createdAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  salary: number;
  joinDate: string;
  attendance: Record<string, "Present" | "Absent" | "Half Day">;
  createdAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Staff" | "Viewer";
  status: "Active" | "Inactive";
  lastLogin: string;
  createdAt: string;
}

export interface OnlineOrder {
  id: string;
  orderNo: string;
  platform: string;
  customerName: string;
  date: string;
  items: string;
  amount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
}

export interface GodownItem {
  id: string;
  itemId: string;
  itemName: string;
  godownName: string;
  stock: number;
  minStock: number;
  createdAt: string;
}

interface AppData {
  customers: Customer[];
  items: Item[];
  invoices: Invoice[];
  expenses: Expense[];
  purchaseOrders: PurchaseOrder[];
  recurringBills: RecurringBill[];
  cashEntries: CashEntry[];
  eInvoices: EInvoiceRecord[];
  addCustomer: (c: Omit<Customer, "id" | "createdAt" | "balance">) => Customer;
  updateCustomer: (id: string, c: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addItem: (i: Omit<Item, "id">) => Item;
  updateItem: (id: string, i: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  addInvoice: (inv: Omit<Invoice, "id" | "createdAt">) => Invoice;
  updateInvoice: (id: string, inv: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  addExpense: (e: Omit<Expense, "id" | "createdAt">) => Expense;
  updateExpense: (id: string, e: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addPurchaseOrder: (po: Omit<PurchaseOrder, "id" | "createdAt">) => PurchaseOrder;
  updatePurchaseOrder: (id: string, po: Partial<PurchaseOrder>) => void;
  deletePurchaseOrder: (id: string) => void;
  getNextPurchaseOrderNo: () => string;
  addRecurringBill: (bill: Omit<RecurringBill, "id" | "createdAt">) => RecurringBill;
  updateRecurringBill: (id: string, bill: Partial<RecurringBill>) => void;
  deleteRecurringBill: (id: string) => void;
  addCashEntry: (entry: Omit<CashEntry, "id" | "createdAt">) => CashEntry;
  deleteCashEntry: (id: string) => void;
  generateEInvoice: (invoiceId: string) => EInvoiceRecord | null;
  cancelEInvoice: (invoiceId: string) => void;
  getNextInvoiceNo: () => string;
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  toCollect: number;
  toPay: number;
}

const AppDataContext = createContext<AppData | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

// Sample seed data
const seedCustomers: Customer[] = [
  { id: "c1", name: "Cash Sale", phone: "9876543210", email: "", gstin: "", address: "Walk-in Customer", category: "Customer", balance: 0, createdAt: "2026-04-01" },
  { id: "c2", name: "Gupta Traders", phone: "9988776655", email: "gupta@mail.com", gstin: "27AABCU9603R1ZN", address: "Mumbai, MH", category: "Supplier", balance: -8200, createdAt: "2026-03-15" },
  { id: "c3", name: "Patel & Sons", phone: "8877665544", email: "patel@mail.com", gstin: "24AAACH7409R1ZQ", address: "Ahmedabad, GJ", category: "Customer", balance: 24800, createdAt: "2026-03-10" },
];

const seedItems: Item[] = [
  { id: "i1", name: "Notebook A4", code: "NB-001", hsn: "4820", price: 120, purchasePrice: 80, stock: 250, unit: "PCS", taxRate: 12 },
  { id: "i2", name: "Pen Box (Pack of 10)", code: "PEN-010", hsn: "9608", price: 220, purchasePrice: 150, stock: 100, unit: "BOX", taxRate: 18 },
  { id: "i3", name: "Printer Paper 500 sheets", code: "PP-500", hsn: "4802", price: 350, purchasePrice: 280, stock: 45, unit: "PKT", taxRate: 12 },
];

const seedInvoices: Invoice[] = [
  {
    id: "inv1", invoiceNo: "INV-001", date: "2026-04-02", dueDate: "2026-05-02",
    partyId: "c1", partyName: "Cash Sale",
    items: [{ id: "li1", itemId: "i2", name: "Pen Box (Pack of 10)", hsn: "9608", qty: 1, price: 220, discount: 0, discountType: "%", tax: 18 }],
    subtotal: 220, totalDiscount: 0, totalTax: 39.6, grandTotal: 259.6, amountPaid: 259.6, paymentMode: "Cash",
    status: "Paid", notes: "", createdAt: "2026-04-02"
  },
  {
    id: "inv2", invoiceNo: "INV-002", date: "2026-03-31", dueDate: "2026-04-30",
    partyId: "c3", partyName: "Patel & Sons",
    items: [
      { id: "li2", itemId: "i1", name: "Notebook A4", hsn: "4820", qty: 100, price: 120, discount: 5, discountType: "%", tax: 12 },
      { id: "li3", itemId: "i3", name: "Printer Paper 500 sheets", hsn: "4802", qty: 20, price: 350, discount: 0, discountType: "%", tax: 12 },
    ],
    subtotal: 19000, totalDiscount: 600, totalTax: 2208, grandTotal: 20608, amountPaid: 0, paymentMode: "Bank",
    status: "Unpaid", notes: "", createdAt: "2026-03-31"
  },
];

const seedExpenses: Expense[] = [
  { id: "e1", date: "2026-04-01", category: "Office Supplies", description: "Stationery for office", amount: 1500, paymentMode: "Cash", createdAt: "2026-04-01" },
  { id: "e2", date: "2026-03-28", category: "Rent", description: "Shop rent for March", amount: 15000, paymentMode: "Bank", createdAt: "2026-03-28" },
  { id: "e3", date: "2026-03-25", category: "Utilities", description: "Electricity bill", amount: 3200, paymentMode: "UPI", createdAt: "2026-03-25" },
];

const seedPurchaseOrders: PurchaseOrder[] = [];

const seedRecurringBills: RecurringBill[] = [];

const seedCashEntries: CashEntry[] = [];

const seedEInvoices: EInvoiceRecord[] = [
  {
    id: "ei1",
    invoiceId: "inv1",
    invoiceNo: "INV-001",
    partyName: "Cash Sale",
    irn: "IRN260402A1",
    ackNo: "ACK-204511",
    generatedAt: "2026-04-02",
    status: "Generated",
  },
];

const todayString = () => new Date().toISOString().slice(0, 10);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(() => loadFromStorage("app_customers", seedCustomers));
  const [items, setItems] = useState<Item[]>(() => loadFromStorage("app_items", seedItems));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadFromStorage("app_invoices", seedInvoices));
  const [expenses, setExpenses] = useState<Expense[]>(() => loadFromStorage("app_expenses", seedExpenses));
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => loadFromStorage("app_purchase_orders", seedPurchaseOrders));
  const [recurringBills, setRecurringBills] = useState<RecurringBill[]>(() => loadFromStorage("app_recurring_bills", seedRecurringBills));
  const [cashEntries, setCashEntries] = useState<CashEntry[]>(() => loadFromStorage("app_cash_entries", seedCashEntries));
  const [eInvoices, setEInvoices] = useState<EInvoiceRecord[]>(() => loadFromStorage("app_e_invoices", seedEInvoices));

  // Persist
  useEffect(() => { localStorage.setItem("app_customers", JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem("app_items", JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem("app_invoices", JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem("app_expenses", JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem("app_purchase_orders", JSON.stringify(purchaseOrders)); }, [purchaseOrders]);
  useEffect(() => { localStorage.setItem("app_recurring_bills", JSON.stringify(recurringBills)); }, [recurringBills]);
  useEffect(() => { localStorage.setItem("app_cash_entries", JSON.stringify(cashEntries)); }, [cashEntries]);
  useEffect(() => { localStorage.setItem("app_e_invoices", JSON.stringify(eInvoices)); }, [eInvoices]);

  const genId = () => crypto.randomUUID();

  const addCustomer = useCallback((c: Omit<Customer, "id" | "createdAt" | "balance">) => {
    const newC: Customer = { ...c, id: genId(), balance: 0, createdAt: todayString() };
    setCustomers(prev => [...prev, newC]);
    return newC;
  }, []);

  const updateCustomer = useCallback((id: string, c: Partial<Customer>) => {
    setCustomers(prev => prev.map(p => p.id === id ? { ...p, ...c } : p));
  }, []);

  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.filter(p => p.id !== id));
  }, []);

  const addItem = useCallback((i: Omit<Item, "id">) => {
    const newI: Item = { ...i, id: genId() };
    setItems(prev => [...prev, newI]);
    return newI;
  }, []);

  const updateItem = useCallback((id: string, i: Partial<Item>) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, ...i } : p));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems(prev => prev.filter(p => p.id !== id));
  }, []);

  const getNextInvoiceNo = useCallback(() => {
    const nums = invoices.map(inv => {
      const match = inv.invoiceNo.match(/INV-(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    const next = Math.max(0, ...nums) + 1;
    return `INV-${String(next).padStart(3, "0")}`;
  }, [invoices]);

  const addInvoice = useCallback((inv: Omit<Invoice, "id" | "createdAt">) => {
    const newInv: Invoice = { ...inv, id: genId(), createdAt: todayString() };
    setInvoices(prev => [...prev, newInv]);
    // Update customer balance
    const balanceChange = newInv.grandTotal - newInv.amountPaid;
    if (balanceChange > 0 && newInv.partyId) {
      setCustomers(prev => prev.map(c => c.id === newInv.partyId ? { ...c, balance: c.balance + balanceChange } : c));
    }
    return newInv;
  }, []);

  const updateInvoice = useCallback((id: string, inv: Partial<Invoice>) => {
    setInvoices(prev => prev.map(p => p.id === id ? { ...p, ...inv } : p));
  }, []);

  const deleteInvoice = useCallback((id: string) => {
    setInvoices(prev => prev.filter(p => p.id !== id));
  }, []);

  const addExpense = useCallback((e: Omit<Expense, "id" | "createdAt">) => {
    const newE: Expense = { ...e, id: genId(), createdAt: todayString() };
    setExpenses(prev => [...prev, newE]);
    return newE;
  }, []);

  const updateExpense = useCallback((id: string, e: Partial<Expense>) => {
    setExpenses(prev => prev.map(p => p.id === id ? { ...p, ...e } : p));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(p => p.id !== id));
  }, []);

  const getNextPurchaseOrderNo = useCallback(() => {
    const nums = purchaseOrders.map(order => {
      const match = order.orderNo.match(/PO-(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    const next = Math.max(0, ...nums) + 1;
    return `PO-${String(next).padStart(3, "0")}`;
  }, [purchaseOrders]);

  const addPurchaseOrder = useCallback((po: Omit<PurchaseOrder, "id" | "createdAt">) => {
    const newPo: PurchaseOrder = { ...po, id: genId(), createdAt: todayString() };
    setPurchaseOrders(prev => [newPo, ...prev]);
    return newPo;
  }, []);

  const updatePurchaseOrder = useCallback((id: string, po: Partial<PurchaseOrder>) => {
    setPurchaseOrders(prev => prev.map(order => order.id === id ? { ...order, ...po } : order));
  }, []);

  const deletePurchaseOrder = useCallback((id: string) => {
    setPurchaseOrders(prev => prev.filter(order => order.id !== id));
  }, []);

  const addRecurringBill = useCallback((bill: Omit<RecurringBill, "id" | "createdAt">) => {
    const newBill: RecurringBill = { ...bill, id: genId(), createdAt: todayString() };
    setRecurringBills(prev => [newBill, ...prev]);
    return newBill;
  }, []);

  const updateRecurringBill = useCallback((id: string, bill: Partial<RecurringBill>) => {
    setRecurringBills(prev => prev.map(record => record.id === id ? { ...record, ...bill } : record));
  }, []);

  const deleteRecurringBill = useCallback((id: string) => {
    setRecurringBills(prev => prev.filter(record => record.id !== id));
  }, []);

  const addCashEntry = useCallback((entry: Omit<CashEntry, "id" | "createdAt">) => {
    const newEntry: CashEntry = { ...entry, id: genId(), createdAt: todayString() };
    setCashEntries(prev => [newEntry, ...prev]);
    return newEntry;
  }, []);

  const deleteCashEntry = useCallback((id: string) => {
    setCashEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);

  const generateEInvoice = useCallback((invoiceId: string) => {
    const invoice = invoices.find(record => record.id === invoiceId);
    if (!invoice) return null;

    const existing = eInvoices.find(record => record.invoiceId === invoiceId);
    const nextRecord: EInvoiceRecord = {
      id: existing?.id ?? genId(),
      invoiceId,
      invoiceNo: invoice.invoiceNo,
      partyName: invoice.partyName,
      irn: `IRN-${Date.now().toString(36).toUpperCase()}`,
      ackNo: `ACK-${Math.floor(100000 + Math.random() * 900000)}`,
      generatedAt: todayString(),
      status: "Generated",
    };

    setEInvoices(prev => existing
      ? prev.map(record => record.invoiceId === invoiceId ? nextRecord : record)
      : [nextRecord, ...prev]);

    return nextRecord;
  }, [eInvoices, invoices]);

  const cancelEInvoice = useCallback((invoiceId: string) => {
    setEInvoices(prev => prev.map(record => record.invoiceId === invoiceId
      ? { ...record, status: "Cancelled" }
      : record));
  }, []);

  const totalRevenue = invoices.reduce((s, inv) => s + inv.grandTotal, 0);
  const totalExpensesAmount = expenses.reduce((s, e) => s + e.amount, 0);
  const profit = totalRevenue - totalExpensesAmount;
  const toCollect = invoices.filter(i => i.status !== "Paid").reduce((s, i) => s + (i.grandTotal - i.amountPaid), 0);
  const toPay = customers.filter(c => c.balance < 0).reduce((s, c) => s + Math.abs(c.balance), 0);

  return (
    <AppDataContext.Provider value={{
      customers, items, invoices, expenses, purchaseOrders, recurringBills, cashEntries, eInvoices,
      addCustomer, updateCustomer, deleteCustomer,
      addItem, updateItem, deleteItem,
      addInvoice, updateInvoice, deleteInvoice,
      addExpense, updateExpense, deleteExpense,
      addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder,
      getNextPurchaseOrderNo,
      addRecurringBill, updateRecurringBill, deleteRecurringBill,
      addCashEntry, deleteCashEntry,
      generateEInvoice, cancelEInvoice,
      getNextInvoiceNo,
      totalRevenue, totalExpenses: totalExpensesAmount, profit, toCollect, toPay,
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
