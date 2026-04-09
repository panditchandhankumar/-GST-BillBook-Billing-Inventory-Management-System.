import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppData, InvoiceLineItem } from "@/contexts/AppDataContext";
import { toast } from "sonner";

const CreateSalesInvoice = () => {
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const { customers, items: storeItems, addInvoice, updateInvoice, invoices, getNextInvoiceNo } = useAppData();

  const existingInvoice = editId ? invoices.find(inv => inv.id === editId) : null;

  const [invoiceNo, setInvoiceNo] = useState(existingInvoice?.invoiceNo || getNextInvoiceNo());
  const [invoiceDate, setInvoiceDate] = useState(existingInvoice?.date || new Date().toISOString().slice(0, 10));
  const [paymentTerms, setPaymentTerms] = useState("30");
  const [partyId, setPartyId] = useState(existingInvoice?.partyId || "");
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>(
    existingInvoice?.items || []
  );
  const [notes, setNotes] = useState(existingInvoice?.notes || "");
  const [amountReceived, setAmountReceived] = useState(existingInvoice?.amountPaid || 0);
  const [paymentMode, setPaymentMode] = useState(existingInvoice?.paymentMode || "Cash");
  const [showNotes, setShowNotes] = useState(!!existingInvoice?.notes);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedParty = customers.find(c => c.id === partyId);

  // Calculations
  const calculations = useMemo(() => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    lineItems.forEach(item => {
      const lineTotal = item.qty * item.price;
      const discount = item.discountType === "%" ? (lineTotal * item.discount) / 100 : item.discount;
      const afterDiscount = lineTotal - discount;
      const tax = (afterDiscount * item.tax) / 100;
      subtotal += lineTotal;
      totalDiscount += discount;
      totalTax += tax;
    });
    const grandTotal = subtotal - totalDiscount + totalTax;
    return { subtotal, totalDiscount, totalTax, grandTotal };
  }, [lineItems]);

  const balance = calculations.grandTotal - amountReceived;

  const dueDate = (() => {
    const d = new Date(invoiceDate);
    d.setDate(d.getDate() + Number(paymentTerms));
    return d.toISOString().slice(0, 10);
  })();

  const addLineItem = () => {
    setLineItems([...lineItems, {
      id: crypto.randomUUID(), name: "", hsn: "", qty: 1, price: 0, discount: 0, discountType: "%", tax: 0,
    }]);
  };

  const updateLineItem = (id: string, field: keyof InvoiceLineItem, value: string | number) => {
    setLineItems(lineItems.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(i => i.id !== id));
  };

  const selectStoreItem = (lineId: string, itemId: string) => {
    const si = storeItems.find(i => i.id === itemId);
    if (si) {
      setLineItems(lineItems.map(i => i.id === lineId ? {
        ...i, itemId: si.id, name: si.name, hsn: si.hsn, price: si.price, tax: si.taxRate,
      } : i));
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!partyId) errs.party = "Please select a party";
    if (lineItems.length === 0) errs.items = "Add at least one item";
    lineItems.forEach((item, idx) => {
      if (!item.name.trim()) errs[`item_${idx}_name`] = "Item name required";
      if (item.qty <= 0) errs[`item_${idx}_qty`] = "Quantity must be > 0";
      if (item.price <= 0) errs[`item_${idx}_price`] = "Price must be > 0";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      toast.error("Please fix all errors before saving");
      return;
    }
    const status = amountReceived >= calculations.grandTotal ? "Paid" : amountReceived > 0 ? "Partial" : "Unpaid";
    const data = {
      invoiceNo, date: invoiceDate, dueDate, partyId,
      partyName: selectedParty?.name || "",
      items: lineItems,
      subtotal: calculations.subtotal,
      totalDiscount: calculations.totalDiscount,
      totalTax: calculations.totalTax,
      grandTotal: calculations.grandTotal,
      amountPaid: amountReceived,
      paymentMode, status: status as "Paid" | "Unpaid" | "Partial",
      notes,
    };
    if (existingInvoice) {
      updateInvoice(existingInvoice.id, data);
      toast.success("Invoice updated successfully");
    } else {
      addInvoice(data);
      toast.success("Invoice created successfully");
    }
    navigate("/sales");
  };

  const handleDownloadPDF = () => {
    // Simple text-based invoice download
    const content = [
      `INVOICE: ${invoiceNo}`,
      `Date: ${invoiceDate}`,
      `Due Date: ${dueDate}`,
      `Bill To: ${selectedParty?.name || "N/A"}`,
      ``,
      `Items:`,
      ...lineItems.map((item, idx) => {
        const lineTotal = item.qty * item.price;
        const discount = item.discountType === "%" ? (lineTotal * item.discount) / 100 : item.discount;
        const afterDiscount = lineTotal - discount;
        const tax = (afterDiscount * item.tax) / 100;
        return `  ${idx + 1}. ${item.name} | HSN: ${item.hsn} | Qty: ${item.qty} | Price: ₹${item.price} | Discount: ${item.discount}${item.discountType} | Tax: ${item.tax}% | Amount: ₹${(afterDiscount + tax).toFixed(2)}`;
      }),
      ``,
      `Subtotal: ₹${calculations.subtotal.toFixed(2)}`,
      `Discount: ₹${calculations.totalDiscount.toFixed(2)}`,
      `Tax: ₹${calculations.totalTax.toFixed(2)}`,
      `Grand Total: ₹${calculations.grandTotal.toFixed(2)}`,
      `Amount Paid: ₹${amountReceived.toFixed(2)}`,
      `Balance: ₹${balance.toFixed(2)}`,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoiceNo}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Invoice downloaded");
  };

  const fmt = (n: number) => `₹ ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <button onClick={() => navigate("/sales")} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-lg font-semibold">{existingInvoice ? "Edit" : "Create"} Sales Invoice</span>
        </button>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="w-4 h-4 mr-1" /> Download
          </Button>
          <Button variant="outline" size="sm" onClick={() => { handleSave(); if (Object.keys(errors).length === 0) navigate("/sales/create"); }}>
            Save & New
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bill To */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-2">Bill To</p>
          {errors.party && <p className="text-xs text-destructive mb-1">{errors.party}</p>}
          <Select value={partyId} onValueChange={setPartyId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select Party" />
            </SelectTrigger>
            <SelectContent>
              {customers.filter(c => c.category === "Customer").map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedParty && (
            <div className="mt-2 text-xs text-muted-foreground">
              <p>{selectedParty.phone}</p>
              {selectedParty.gstin && <p>GSTIN: {selectedParty.gstin}</p>}
              <p>{selectedParty.address}</p>
            </div>
          )}
          <Button variant="link" size="sm" className="text-primary p-0 mt-1" onClick={() => navigate("/parties")}>
            + Create New Party
          </Button>
        </div>

        {/* Invoice details */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Invoice No:</label>
              <Input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="w-32 mt-1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Invoice Date:</label>
              <div className="flex items-center gap-1 mt-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="w-40" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Payment Terms:</label>
              <div className="flex items-center gap-1 mt-1">
                <Input value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} className="w-16" />
                <span className="text-xs text-muted-foreground">days</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Due Date:</label>
              <p className="text-sm font-medium text-foreground mt-1">
                {new Date(dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Items table */}
      {errors.items && <p className="text-xs text-destructive mb-2">{errors.items}</p>}
      <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase w-10">NO</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">ITEM</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">HSN</th>
                <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase w-20">QTY</th>
                <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">PRICE (₹)</th>
                <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">DISCOUNT</th>
                <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">TAX %</th>
                <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">AMOUNT (₹)</th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, idx) => {
                const lineTotal = item.qty * item.price;
                const discount = item.discountType === "%" ? (lineTotal * item.discount) / 100 : item.discount;
                const afterDiscount = lineTotal - discount;
                const tax = (afterDiscount * item.tax) / 100;
                const amount = afterDiscount + tax;
                return (
                  <tr key={item.id} className="border-b border-border/50">
                    <td className="p-3 text-sm text-muted-foreground">{idx + 1}</td>
                    <td className="p-3">
                      <select
                        value={item.itemId || ""}
                        onChange={(e) => {
                          if (e.target.value) selectStoreItem(item.id, e.target.value);
                        }}
                        className="w-full border border-border rounded px-2 py-1 text-sm bg-background text-foreground mb-1"
                      >
                        <option value="">Select or type...</option>
                        {storeItems.map(si => (
                          <option key={si.id} value={si.id}>{si.name}</option>
                        ))}
                      </select>
                      <Input
                        placeholder="Item name"
                        value={item.name}
                        onChange={(e) => updateLineItem(item.id, "name", e.target.value)}
                        className={`h-7 text-xs ${errors[`item_${idx}_name`] ? "border-destructive" : ""}`}
                      />
                    </td>
                    <td className="p-3"><Input value={item.hsn} onChange={(e) => updateLineItem(item.id, "hsn", e.target.value)} className="h-8 w-20" /></td>
                    <td className="p-3">
                      <Input
                        type="number" min="1" value={item.qty}
                        onChange={(e) => updateLineItem(item.id, "qty", Math.max(1, Number(e.target.value)))}
                        className={`h-8 w-16 text-center ${errors[`item_${idx}_qty`] ? "border-destructive" : ""}`}
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="number" min="0" value={item.price}
                        onChange={(e) => updateLineItem(item.id, "price", Math.max(0, Number(e.target.value)))}
                        className={`h-8 w-24 text-right ${errors[`item_${idx}_price`] ? "border-destructive" : ""}`}
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Input type="number" min="0" value={item.discount}
                          onChange={(e) => updateLineItem(item.id, "discount", Math.max(0, Number(e.target.value)))}
                          className="h-8 w-16 text-right"
                        />
                        <select
                          value={item.discountType}
                          onChange={(e) => updateLineItem(item.id, "discountType", e.target.value)}
                          className="h-8 border border-border rounded px-1 text-xs bg-background text-foreground"
                        >
                          <option value="%">%</option>
                          <option value="₹">₹</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-3">
                      <Input type="number" min="0" value={item.tax}
                        onChange={(e) => updateLineItem(item.id, "tax", Math.max(0, Number(e.target.value)))}
                        className="h-8 w-16 text-right"
                      />
                    </td>
                    <td className="p-3 text-right text-sm font-medium text-foreground whitespace-nowrap">
                      {fmt(amount)}
                    </td>
                    <td className="p-3">
                      <button onClick={() => removeLineItem(item.id)} className="text-destructive hover:text-destructive/80">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-3 border-t border-border">
          <button onClick={addLineItem} className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {showNotes ? (
            <div>
              <label className="text-sm font-semibold text-foreground">Notes</label>
              <textarea
                value={notes} onChange={(e) => setNotes(e.target.value)}
                className="w-full mt-1 border border-border rounded-lg p-3 text-sm bg-background text-foreground resize-none h-20"
                placeholder="Add notes..."
              />
            </div>
          ) : (
            <button onClick={() => setShowNotes(true)} className="text-primary text-sm font-medium hover:underline">+ Add Notes</button>
          )}
          <div>
            <p className="text-sm font-semibold text-foreground">Terms and Conditions</p>
            <div className="mt-2 text-xs text-muted-foreground space-y-1">
              <p>1. Goods once sold will not be taken back or exchanged</p>
              <p>2. All disputes are subject to local jurisdiction only</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">{fmt(calculations.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <span className="font-medium text-destructive">- {fmt(calculations.totalDiscount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (GST)</span>
            <span className="font-medium text-foreground">{fmt(calculations.totalTax)}</span>
          </div>
          <div className="flex justify-between items-center border-t border-border pt-3">
            <span className="text-base font-bold text-foreground">Grand Total</span>
            <span className="text-xl font-bold text-primary">{fmt(calculations.grandTotal)}</span>
          </div>
          <div className="flex justify-end">
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              Mark as fully paid
              <Checkbox
                checked={amountReceived >= calculations.grandTotal && calculations.grandTotal > 0}
                onCheckedChange={(v) => setAmountReceived(v ? calculations.grandTotal : 0)}
              />
            </label>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground">Amount Received</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">₹</span>
              <Input type="number" min="0" value={amountReceived} onChange={(e) => setAmountReceived(Math.max(0, Number(e.target.value)))} className="w-24 text-right" />
              <Select value={paymentMode} onValueChange={setPaymentMode}>
                <SelectTrigger className="w-24 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Bank">Bank</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between text-sm border-t border-border pt-3">
            <span className="text-primary font-medium">Balance Amount</span>
            <span className="text-primary font-bold">{fmt(Math.max(0, balance))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSalesInvoice;
