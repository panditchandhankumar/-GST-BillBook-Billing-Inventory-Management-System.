import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Pause, Play, Plus, Repeat, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RecurringBill, useAppData } from "@/contexts/AppDataContext";
import { advanceDateByFrequency, calculateDocumentTotals, formatCurrency } from "@/lib/billing";
import { toast } from "sonner";

const today = () => new Date().toISOString().slice(0, 10);
const selectClassName = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";

type BillForm = Omit<RecurringBill, "id" | "createdAt" | "lastRun"> & { lastRun?: string };

const createForm = (): BillForm => ({
  title: "",
  partyId: "",
  partyName: "",
  itemId: "",
  itemName: "",
  hsn: "",
  qty: 1,
  price: 0,
  tax: 18,
  frequency: "Monthly",
  paymentMode: "Bank",
  nextRun: today(),
  status: "Active",
  lastRun: "",
});

const AutomatedBills = () => {
  const {
    customers,
    items,
    recurringBills,
    addRecurringBill,
    updateRecurringBill,
    deleteRecurringBill,
    addExpense,
  } = useAppData();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<BillForm>(createForm);

  const totals = useMemo(() => calculateDocumentTotals([{
    qty: form.qty,
    price: form.price,
    discount: 0,
    discountType: "%",
    tax: form.tax,
  }]), [form.price, form.qty, form.tax]);

  const dueToday = recurringBills.filter((bill) => bill.status === "Active" && bill.nextRun <= today()).length;

  const resetForm = () => {
    setForm(createForm());
    setEditId(null);
  };

  const handleItemSelect = (itemId: string) => {
    const selectedItem = items.find((item) => item.id === itemId);
    if (!selectedItem) return;

    setForm((prev) => ({
      ...prev,
      itemId,
      itemName: selectedItem.name,
      hsn: selectedItem.hsn,
      price: selectedItem.purchasePrice || selectedItem.price,
      tax: selectedItem.taxRate,
    }));
  };

  const handlePartySelect = (partyId: string) => {
    const selectedParty = customers.find((party) => party.id === partyId);
    setForm((prev) => ({
      ...prev,
      partyId,
      partyName: selectedParty?.name || "",
    }));
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error("Bill title is required");
      return;
    }

    if (!form.partyId || !form.itemId || form.qty <= 0 || form.price <= 0) {
      toast.error("Complete all recurring bill fields");
      return;
    }

    const payload = {
      title: form.title,
      partyId: form.partyId,
      partyName: form.partyName,
      itemId: form.itemId,
      itemName: form.itemName,
      hsn: form.hsn,
      qty: form.qty,
      price: form.price,
      tax: form.tax,
      frequency: form.frequency,
      paymentMode: form.paymentMode,
      nextRun: form.nextRun,
      status: form.status,
      lastRun: form.lastRun || "",
    };

    if (editId) {
      updateRecurringBill(editId, payload);
      toast.success("Automated bill updated");
    } else {
      addRecurringBill(payload);
      toast.success("Automated bill created");
    }

    resetForm();
    setDialogOpen(false);
  };

  const handleRunNow = (bill: RecurringBill) => {
    const billTotals = calculateDocumentTotals([{
      qty: bill.qty,
      price: bill.price,
      discount: 0,
      discountType: "%",
      tax: bill.tax,
    }]);

    addExpense({
      date: bill.nextRun,
      category: "Automated Bill",
      description: `${bill.title} · ${bill.partyName}`,
      amount: billTotals.grandTotal,
      paymentMode: bill.paymentMode,
    });

    updateRecurringBill(bill.id, {
      lastRun: bill.nextRun,
      nextRun: advanceDateByFrequency(bill.nextRun, bill.frequency),
    });

    toast.success("Automated bill posted to expenses");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Automated Bills</h1>
          <p className="text-sm text-muted-foreground">Schedule recurring supplier bills and post them to expenses</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" /> New Automated Bill</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Edit" : "Create"} Automated Bill</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Bill title" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
              <div>
                <label className="text-xs text-muted-foreground">Party</label>
                <select className={selectClassName} value={form.partyId} onChange={(event) => handlePartySelect(event.target.value)}>
                  <option value="">Select party</option>
                  {customers.map((party) => <option key={party.id} value={party.id}>{party.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Item / Service</label>
                <select className={selectClassName} value={form.itemId} onChange={(event) => handleItemSelect(event.target.value)}>
                  <option value="">Select item</option>
                  {items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs text-muted-foreground">Qty</label><Input type="number" min="1" value={form.qty} onChange={(event) => setForm((prev) => ({ ...prev, qty: Number(event.target.value) }))} /></div>
                <div><label className="text-xs text-muted-foreground">Price</label><Input type="number" min="0" value={form.price} onChange={(event) => setForm((prev) => ({ ...prev, price: Number(event.target.value) }))} /></div>
                <div><label className="text-xs text-muted-foreground">GST %</label><Input type="number" min="0" value={form.tax} onChange={(event) => setForm((prev) => ({ ...prev, tax: Number(event.target.value) }))} /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Frequency</label>
                  <select className={selectClassName} value={form.frequency} onChange={(event) => setForm((prev) => ({ ...prev, frequency: event.target.value as RecurringBill["frequency"] }))}>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Next Run</label>
                  <Input type="date" value={form.nextRun} onChange={(event) => setForm((prev) => ({ ...prev, nextRun: event.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Payment Mode</label>
                  <select className={selectClassName} value={form.paymentMode} onChange={(event) => setForm((prev) => ({ ...prev, paymentMode: event.target.value }))}>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank">Bank</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-3 text-sm flex items-center justify-between">
                <span className="text-muted-foreground">Recurring amount</span>
                <span className="font-semibold text-foreground">{formatCurrency(totals.grandTotal)}</span>
              </div>
              <Button className="w-full bg-primary text-primary-foreground" onClick={handleSave}>{editId ? "Update" : "Save"} Automated Bill</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Active Bills</p>
          <p className="text-xl font-bold text-foreground">{recurringBills.filter((bill) => bill.status === "Active").length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Due Today</p>
          <p className="text-xl font-bold text-warning">{dueToday}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">This Cycle Value</p>
          <p className="text-xl font-bold text-foreground">{formatCurrency(recurringBills.reduce((sum, bill) => sum + calculateDocumentTotals([{ qty: bill.qty, price: bill.price, discount: 0, discountType: "%", tax: bill.tax }]).grandTotal, 0))}</p>
        </div>
      </div>

      <div className="space-y-3">
        {recurringBills.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">No automated bills created yet</div>
        ) : recurringBills.map((bill) => {
          const amount = calculateDocumentTotals([{ qty: bill.qty, price: bill.price, discount: 0, discountType: "%", tax: bill.tax }]).grandTotal;
          return (
            <motion.div key={bill.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card p-4 flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-foreground">{bill.title}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bill.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{bill.status}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{bill.frequency}</span>
                </div>
                <p className="text-sm text-muted-foreground">{bill.partyName} · {bill.itemName}</p>
                <p className="text-xs text-muted-foreground">Next run {new Date(bill.nextRun).toLocaleDateString("en-IN")} · Last run {bill.lastRun ? new Date(bill.lastRun).toLocaleDateString("en-IN") : "Not generated yet"}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap lg:justify-end">
                <div className="text-sm font-semibold text-foreground mr-2">{formatCurrency(amount)}</div>
                <Button variant="outline" onClick={() => handleRunNow(bill)}><Repeat className="w-4 h-4 mr-1" />Run Now</Button>
                <Button variant="outline" onClick={() => updateRecurringBill(bill.id, { status: bill.status === "Active" ? "Paused" : "Active" })}>{bill.status === "Active" ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}{bill.status === "Active" ? "Pause" : "Resume"}</Button>
                <Button variant="outline" onClick={() => { setEditId(bill.id); setForm({ ...bill }); setDialogOpen(true); }}><Edit2 className="w-4 h-4 mr-1" />Edit</Button>
                <Button variant="outline" onClick={() => { deleteRecurringBill(bill.id); toast.success("Automated bill deleted"); }}><Trash2 className="w-4 h-4 mr-1" />Delete</Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AutomatedBills;