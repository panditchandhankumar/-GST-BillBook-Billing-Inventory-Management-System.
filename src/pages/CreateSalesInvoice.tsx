import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Settings, Plus, QrCode, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LineItem {
  id: number;
  name: string;
  hsn: string;
  qty: number;
  price: number;
  discount: number;
  tax: number;
}

const CreateSalesInvoice = () => {
  const navigate = useNavigate();
  const [invoiceNo, setInvoiceNo] = useState("2");
  const [invoiceDate, setInvoiceDate] = useState("2026-04-04");
  const [paymentTerms, setPaymentTerms] = useState("30");
  const [party, setParty] = useState("");
  const [items, setItems] = useState<LineItem[]>([]);
  const [notes, setNotes] = useState("");
  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [applyTcs, setApplyTcs] = useState(false);
  const [autoRoundOff, setAutoRoundOff] = useState(false);
  const [amountReceived, setAmountReceived] = useState(0);
  const [paymentMode, setPaymentMode] = useState("Cash");

  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const totalTax = items.reduce((sum, i) => sum + (i.qty * i.price * i.tax) / 100, 0);
  const totalAmount = subtotal + totalTax + additionalCharges - discountAmount;
  const balance = totalAmount - amountReceived;

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", hsn: "", qty: 1, price: 0, discount: 0, tax: 0 }]);
  };

  const updateItem = (id: number, field: keyof LineItem, value: string | number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const removeItem = (id: number) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const dueDate = (() => {
    const d = new Date(invoiceDate);
    d.setDate(d.getDate() + Number(paymentTerms));
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  })();

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <button onClick={() => navigate("/sales")} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-lg font-semibold">Create Sales Invoice</span>
        </button>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm"><Settings className="w-4 h-4 mr-1" />Settings</Button>
          <Button variant="outline" size="sm">Save & New</Button>
          <Button size="sm" className="bg-primary text-primary-foreground">Save</Button>
        </div>
      </div>

      {/* Info banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between bg-accent/50 border border-border rounded-lg p-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-primary">📲</span>
          <div>
            <p className="font-medium text-foreground">Invoice Auto-SMS to Party is turned on</p>
            <p className="text-xs">An SMS with the invoice details and link is sent to the party after the invoice has been created</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="text-primary border-primary">Change Settings</Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bill To */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-2">Bill To</p>
          {!party ? (
            <button
              onClick={() => setParty("Select")}
              className="w-64 h-28 border-2 border-dashed border-primary/40 rounded-lg flex items-center justify-center text-primary hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Party
            </button>
          ) : (
            <div className="border border-border rounded-lg p-4 w-64">
              <Input placeholder="Search or add party" value="" onChange={() => {}} className="mb-2" />
              <Button variant="link" size="sm" className="text-primary p-0" onClick={() => navigate("/parties")}>+ Create New Party</Button>
            </div>
          )}
        </div>

        {/* Invoice details */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Sales Invoice No:</label>
              <Input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="w-24 mt-1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Sales Invoice Date:</label>
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
              <p className="text-sm font-medium text-foreground mt-1">{dueDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items table */}
      <div className="glass-card overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase w-10">NO</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">ITEMS/SERVICES</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">HSN/SAC</th>
                <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase w-20">QTY</th>
                <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">PRICE/ITEM (₹)</th>
                <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">DISCOUNT</th>
                <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">TAX</th>
                <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">AMOUNT (₹)</th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className="border-b border-border/50">
                  <td className="p-3 text-sm text-muted-foreground">{idx + 1}</td>
                  <td className="p-3"><Input placeholder="Item name" value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} className="h-8" /></td>
                  <td className="p-3"><Input placeholder="HSN" value={item.hsn} onChange={(e) => updateItem(item.id, "hsn", e.target.value)} className="h-8 w-24" /></td>
                  <td className="p-3"><Input type="number" value={item.qty} onChange={(e) => updateItem(item.id, "qty", Number(e.target.value))} className="h-8 w-16 text-center" /></td>
                  <td className="p-3"><Input type="number" value={item.price} onChange={(e) => updateItem(item.id, "price", Number(e.target.value))} className="h-8 w-24 text-right" /></td>
                  <td className="p-3"><Input type="number" value={item.discount} onChange={(e) => updateItem(item.id, "discount", Number(e.target.value))} className="h-8 w-20 text-right" /></td>
                  <td className="p-3"><Input type="number" value={item.tax} onChange={(e) => updateItem(item.id, "tax", Number(e.target.value))} className="h-8 w-20 text-right" /></td>
                  <td className="p-3 text-right text-sm font-medium text-foreground">₹{(item.qty * item.price * (1 + item.tax / 100) - item.discount).toLocaleString("en-IN")}</td>
                  <td className="p-3"><button onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-3 border-t border-border">
          <button onClick={addItem} className="text-primary text-sm font-medium hover:underline">+ Add Item</button>
          <div className="flex items-center gap-2 border border-border rounded-lg px-4 py-2 text-muted-foreground">
            <QrCode className="w-5 h-5" />
            <span className="text-sm">Scan Barcode</span>
          </div>
        </div>

        <div className="flex justify-end border-t border-border p-3 gap-8">
          <span className="text-sm text-muted-foreground">SUBTOTAL</span>
          <span className="text-sm font-medium w-20 text-right">₹{subtotal.toLocaleString("en-IN")}</span>
          <span className="text-sm font-medium w-20 text-right">₹{totalTax.toLocaleString("en-IN")}</span>
          <span className="text-sm font-medium w-20 text-right">₹{(subtotal + totalTax).toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left */}
        <div className="space-y-4">
          <button className="text-primary text-sm font-medium hover:underline">+ Add Notes</button>
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Terms and Conditions</p>
              <Settings className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground space-y-1">
              <p>1. Goods once sold will not be taken back or exchanged</p>
              <p>2. All disputes are subject to [ENTER_YOUR_CITY_NAME] jurisdiction only</p>
            </div>
          </div>
          <button className="text-primary text-sm font-medium hover:underline block">+ Add New Account</button>
          <button className="text-primary text-sm font-medium hover:underline block">+ Add Payment QR</button>
        </div>

        {/* Right */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <button className="text-primary font-medium hover:underline">+ Add Additional Charges</button>
            <span>₹{additionalCharges}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxable Amount</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <button className="text-primary font-medium hover:underline">+ Add Discount</button>
            <span>- ₹{discountAmount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={applyTcs} onCheckedChange={(v) => setApplyTcs(!!v)} />
            <span className="text-sm text-foreground">Apply TCS</span>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={autoRoundOff} onCheckedChange={(v) => setAutoRoundOff(!!v)} />
            <span className="text-sm text-foreground">Auto Round Off</span>
          </div>
          <div className="flex justify-between items-center border-t border-border pt-3">
            <span className="text-base font-bold text-foreground">Total Amount</span>
            <Input placeholder="Enter Payment amount" className="w-48 text-right" value={totalAmount || ""} readOnly />
          </div>
          <div className="flex justify-end">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Mark as fully paid <Checkbox onCheckedChange={() => setAmountReceived(totalAmount)} />
            </label>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground">Amount Received</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">₹</span>
              <Input type="number" value={amountReceived} onChange={(e) => setAmountReceived(Number(e.target.value))} className="w-24 text-right" />
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
          <div className="flex justify-between text-sm">
            <span className="text-primary font-medium">Balance Amount</span>
            <span className="text-primary font-bold">₹{balance.toLocaleString("en-IN")}</span>
          </div>
          <p className="text-right text-xs text-muted-foreground mt-4">Authorized signatory for <strong className="text-foreground">Business Name</strong></p>
        </div>
      </div>
    </div>
  );
};

export default CreateSalesInvoice;
