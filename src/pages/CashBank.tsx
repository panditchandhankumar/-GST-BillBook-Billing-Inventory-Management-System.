import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownRight, Plus, Trash2, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CashEntry, useAppData } from "@/contexts/AppDataContext";
import { formatCurrency } from "@/lib/billing";
import { toast } from "sonner";

const today = () => new Date().toISOString().slice(0, 10);

const selectClassName = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";

const CashBank = () => {
  const { invoices, expenses, cashEntries, addCashEntry, deleteCashEntry } = useAppData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Pick<CashEntry, "date" | "type" | "account" | "description" | "amount">>({
    date: today(),
    type: "income",
    account: "Cash",
    description: "",
    amount: 0,
  });

  const transactions = useMemo(() => {
    const invoiceEntries = invoices
      .filter(invoice => invoice.amountPaid > 0)
      .map(invoice => ({
        id: `invoice-${invoice.id}`,
        sourceId: invoice.id,
        description: `Sale - ${invoice.partyName}`,
        type: "income" as const,
        amount: invoice.amountPaid,
        account: invoice.paymentMode === "Cash" ? "Cash" as const : "Bank" as const,
        date: invoice.date,
        origin: "invoice" as const,
      }));

    const expenseEntries = expenses.map(expense => ({
      id: `expense-${expense.id}`,
      sourceId: expense.id,
      description: expense.description || expense.category,
      type: "expense" as const,
      amount: expense.amount,
      account: expense.paymentMode === "Cash" ? "Cash" as const : "Bank" as const,
      date: expense.date,
      origin: "expense" as const,
    }));

    const manualEntries = cashEntries.map(entry => ({
      id: `manual-${entry.id}`,
      sourceId: entry.id,
      description: entry.description,
      type: entry.type,
      amount: entry.amount,
      account: entry.account,
      date: entry.date,
      origin: "manual" as const,
    }));

    return [...manualEntries, ...invoiceEntries, ...expenseEntries]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [cashEntries, expenses, invoices]);

  const cashBalance = useMemo(() => transactions.reduce((sum, entry) => {
    if (entry.account !== "Cash") return sum;
    return sum + (entry.type === "income" ? entry.amount : -entry.amount);
  }, 0), [transactions]);

  const bankBalance = useMemo(() => transactions.reduce((sum, entry) => {
    if (entry.account !== "Bank") return sum;
    return sum + (entry.type === "income" ? entry.amount : -entry.amount);
  }, 0), [transactions]);

  const handleSave = () => {
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (form.amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    addCashEntry(form);
    toast.success("Cash & bank entry added");
    setForm({ date: today(), type: "income", account: "Cash", description: "", amount: 0 });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cash &amp; Bank</h1>
          <p className="text-sm text-muted-foreground">Live balances from invoices, expenses, and manual entries</p>
        </div>
        <Button className="gradient-primary text-primary-foreground border-0" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />Add Entry
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center"><Wallet className="w-5 h-5 text-primary-foreground" /></div>
            <span className="text-sm font-medium text-muted-foreground">Cash Balance</span>
          </div>
          <p className="text-3xl font-bold text-card-foreground">{formatCurrency(cashBalance)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-success flex items-center justify-center"><Landmark className="w-5 h-5 text-primary-foreground" /></div>
            <span className="text-sm font-medium text-muted-foreground">Bank Balance</span>
          </div>
          <p className="text-3xl font-bold text-card-foreground">{formatCurrency(bankBalance)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center"><Wallet className="w-5 h-5 text-accent-foreground" /></div>
            <span className="text-sm font-medium text-muted-foreground">Net Position</span>
          </div>
          <p className="text-3xl font-bold text-card-foreground">{formatCurrency(cashBalance + bankBalance)}</p>
        </motion.div>
      </div>

      <div className="glass-card divide-y divide-border/50 overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">No cash or bank entries yet</div>
        ) : transactions.map((tx, index) => (
          <motion.div key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="p-4 flex items-center justify-between gap-3 hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === "income" ? "bg-success/10" : "bg-destructive/10"}`}>
                {tx.type === "income" ? <ArrowDownRight className="w-4 h-4 text-success" /> : <ArrowUpRight className="w-4 h-4 text-destructive" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-card-foreground truncate">{tx.description}</p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground uppercase">{tx.origin}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {tx.account} · {new Date(tx.date).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className={`text-sm font-semibold ${tx.type === "income" ? "text-success" : "text-destructive"}`}>
                {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
              </p>
              {tx.origin === "manual" && (
                <button
                  onClick={() => {
                    deleteCashEntry(tx.sourceId);
                    toast.success("Manual entry deleted");
                  }}
                  className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Cash / Bank Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Date</label>
                <Input type="date" value={form.date} onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Amount</label>
                <Input type="number" min="0" value={form.amount} onChange={(event) => setForm((prev) => ({ ...prev, amount: Number(event.target.value) }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Type</label>
                <select className={selectClassName} value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as CashEntry["type"] }))}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Account</label>
                <select className={selectClassName} value={form.account} onChange={(event) => setForm((prev) => ({ ...prev, account: event.target.value as CashEntry["account"] }))}>
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Description</label>
              <Input value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} placeholder="Ex: Owner deposit / ATM withdrawal" />
            </div>
            <Button className="w-full bg-primary text-primary-foreground" onClick={handleSave}>Save Entry</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CashBank;
