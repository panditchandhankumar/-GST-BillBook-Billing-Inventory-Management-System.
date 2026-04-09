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

interface AppData {
  customers: Customer[];
  items: Item[];
  invoices: Invoice[];
  expenses: Expense[];
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

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(() => loadFromStorage("app_customers", seedCustomers));
  const [items, setItems] = useState<Item[]>(() => loadFromStorage("app_items", seedItems));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadFromStorage("app_invoices", seedInvoices));
  const [expenses, setExpenses] = useState<Expense[]>(() => loadFromStorage("app_expenses", seedExpenses));

  // Persist
  useEffect(() => { localStorage.setItem("app_customers", JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem("app_items", JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem("app_invoices", JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem("app_expenses", JSON.stringify(expenses)); }, [expenses]);

  const genId = () => crypto.randomUUID();

  const addCustomer = useCallback((c: Omit<Customer, "id" | "createdAt" | "balance">) => {
    const newC: Customer = { ...c, id: genId(), balance: 0, createdAt: new Date().toISOString().slice(0, 10) };
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
    const newInv: Invoice = { ...inv, id: genId(), createdAt: new Date().toISOString().slice(0, 10) };
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
    const newE: Expense = { ...e, id: genId(), createdAt: new Date().toISOString().slice(0, 10) };
    setExpenses(prev => [...prev, newE]);
    return newE;
  }, []);

  const updateExpense = useCallback((id: string, e: Partial<Expense>) => {
    setExpenses(prev => prev.map(p => p.id === id ? { ...p, ...e } : p));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(p => p.id !== id));
  }, []);

  const totalRevenue = invoices.reduce((s, inv) => s + inv.grandTotal, 0);
  const totalExpensesAmount = expenses.reduce((s, e) => s + e.amount, 0);
  const profit = totalRevenue - totalExpensesAmount;
  const toCollect = invoices.filter(i => i.status !== "Paid").reduce((s, i) => s + (i.grandTotal - i.amountPaid), 0);
  const toPay = customers.filter(c => c.balance < 0).reduce((s, c) => s + Math.abs(c.balance), 0);

  return (
    <AppDataContext.Provider value={{
      customers, items, invoices, expenses,
      addCustomer, updateCustomer, deleteCustomer,
      addItem, updateItem, deleteItem,
      addInvoice, updateInvoice, deleteInvoice,
      addExpense, updateExpense, deleteExpense,
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
