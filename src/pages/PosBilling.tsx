import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvoiceLineItem, useAppData } from "@/contexts/AppDataContext";
import { calculateDocumentTotals, calculateLineTotals, formatCurrency } from "@/lib/billing";
import { toast } from "sonner";

const today = () => new Date().toISOString().slice(0, 10);
const selectClassName = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";

const PosBilling = () => {
  const { items, customers, addInvoice, getNextInvoiceNo } = useAppData();
  const [search, setSearch] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [amountPaidInput, setAmountPaidInput] = useState("");
  const [notes, setNotes] = useState("");
  const [cart, setCart] = useState<InvoiceLineItem[]>([]);

  const customerOptions = customers.filter((customer) => customer.category === "Customer");

  const filteredItems = useMemo(() => items.filter((item) => {
    const query = search.toLowerCase();
    return item.name.toLowerCase().includes(query) || item.code.toLowerCase().includes(query);
  }), [items, search]);

  const totals = useMemo(() => calculateDocumentTotals(cart), [cart]);
  const amountPaid = amountPaidInput === "" ? totals.grandTotal : Number(amountPaidInput);
  const status = amountPaid <= 0 ? "Unpaid" : amountPaid >= totals.grandTotal ? "Paid" : "Partial";

  const addToCart = (itemId: string) => {
    const selected = items.find((item) => item.id === itemId);
    if (!selected) return;

    setCart((prev) => {
      const existing = prev.find((line) => line.itemId === itemId);
      if (existing) {
        return prev.map((line) => line.itemId === itemId ? { ...line, qty: line.qty + 1 } : line);
      }

      return [...prev, {
        id: crypto.randomUUID(),
        itemId: selected.id,
        name: selected.name,
        hsn: selected.hsn,
        qty: 1,
        price: selected.price,
        discount: 0,
        discountType: "%",
        tax: selected.taxRate,
      }];
    });
  };

  const updateLine = (lineId: string, patch: Partial<InvoiceLineItem>) => {
    setCart((prev) => prev.map((line) => line.id === lineId ? { ...line, ...patch } : line));
  };

  const handleCheckout = () => {
    const customer = customerOptions.find((entry) => entry.id === customerId) || customers.find((entry) => entry.id === customerId);
    const validLines = cart.filter((line) => line.qty > 0 && line.price > 0);

    if (!customer) {
      toast.error("Please select a customer");
      return;
    }

    if (validLines.length === 0) {
      toast.error("Add at least one item to the POS cart");
      return;
    }

    addInvoice({
      invoiceNo: getNextInvoiceNo(),
      date: today(),
      dueDate: today(),
      partyId: customer.id,
      partyName: customer.name,
      items: validLines,
      subtotal: totals.subtotal,
      totalDiscount: totals.totalDiscount,
      totalTax: totals.totalTax,
      grandTotal: totals.grandTotal,
      amountPaid,
      paymentMode,
      status,
      notes,
    });

    toast.success("POS invoice created and dashboard updated");
    setCart([]);
    setAmountPaidInput("");
    setNotes("");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">POS Billing</h1>
          <p className="text-sm text-muted-foreground">Fast counter billing with instant invoice creation</p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
          Invoice preview: <span className="text-foreground font-semibold">{getNextInvoiceNo()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr,0.8fr] gap-5">
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search items for POS..." value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <motion.button key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => addToCart(item.id)} className="text-left rounded-2xl border border-border bg-card p-4 hover:border-primary/40 hover:bg-muted/20 transition-colors">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.code || item.hsn}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Stock {item.stock} {item.unit}</span>
                  <span className="font-semibold text-foreground">{formatCurrency(item.price)}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-4 h-fit sticky top-20">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Customer</label>
              <select className={selectClassName} value={customerId} onChange={(event) => setCustomerId(event.target.value)}>
                <option value="">Select customer</option>
                {[...customerOptions, ...customers.filter((customer) => customer.category !== "Customer")].map((customer) => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Payment Mode</label>
              <select className={selectClassName} value={paymentMode} onChange={(event) => setPaymentMode(event.target.value)}>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank">Bank</option>
                <option value="Card">Card</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-auto pr-1">
            {cart.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">Tap items to build the POS cart</div>
            ) : cart.map((line) => (
              <div key={line.id} className="rounded-xl border border-border p-3 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{line.name}</p>
                    <p className="text-xs text-muted-foreground">HSN {line.hsn || "-"}</p>
                  </div>
                  <button onClick={() => setCart((prev) => prev.filter((entry) => entry.id !== line.id))} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors" title="Remove item">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-1">
                    <label className="text-[11px] text-muted-foreground">Qty</label>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateLine(line.id, { qty: Math.max(1, line.qty - 1) })} className="h-10 w-10 rounded-md border border-border flex items-center justify-center hover:bg-muted"><Minus className="w-4 h-4" /></button>
                      <Input type="number" min="1" value={line.qty} onChange={(event) => updateLine(line.id, { qty: Number(event.target.value) })} />
                      <button onClick={() => updateLine(line.id, { qty: line.qty + 1 })} className="h-10 w-10 rounded-md border border-border flex items-center justify-center hover:bg-muted"><Plus className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground">Price</label>
                    <Input type="number" min="0" value={line.price} onChange={(event) => updateLine(line.id, { price: Number(event.target.value) })} />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground">Discount</label>
                    <Input type="number" min="0" value={line.discount} onChange={(event) => updateLine(line.id, { discount: Number(event.target.value) })} />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground">GST %</label>
                    <Input type="number" min="0" value={line.tax} onChange={(event) => updateLine(line.id, { tax: Number(event.target.value) })} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Line Total</span>
                  <span className="font-semibold text-foreground">{formatCurrency(calculateLineTotals(line).total)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium text-foreground">{formatCurrency(totals.subtotal)}</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Discount</span><span className="font-medium text-foreground">{formatCurrency(totals.totalDiscount)}</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">GST</span><span className="font-medium text-foreground">{formatCurrency(totals.totalTax)}</span></div>
            <div className="flex items-center justify-between text-base font-semibold"><span className="text-foreground">Grand Total</span><span className="text-foreground">{formatCurrency(totals.grandTotal)}</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Amount Paid</label>
              <Input type="number" min="0" placeholder={String(totals.grandTotal)} value={amountPaidInput} onChange={(event) => setAmountPaidInput(event.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Status</label>
              <div className={`h-10 rounded-md border border-border px-3 flex items-center text-sm font-medium ${status === "Paid" ? "text-success" : status === "Partial" ? "text-warning" : "text-destructive"}`}>{status}</div>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Notes</label>
            <Input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional POS notes" />
          </div>

          <Button className="w-full bg-primary text-primary-foreground" onClick={handleCheckout}>Complete POS Sale</Button>
        </div>
      </div>
    </div>
  );
};

export default PosBilling;