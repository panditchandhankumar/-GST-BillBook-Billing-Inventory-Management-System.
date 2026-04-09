import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Trash2, Edit2, Receipt, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppData, Expense } from "@/contexts/AppDataContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const categories = ["Office Supplies", "Rent", "Utilities", "Travel", "Marketing", "Salaries", "Equipment", "Other"];

const Expenses = () => {
  const { expenses, addExpense, updateExpense, deleteExpense, totalExpenses } = useAppData();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), category: "Office Supplies", description: "", amount: 0, paymentMode: "Cash" });

  const filtered = expenses
    .filter(e => {
      const matchSearch = e.description.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === "All" || e.category === categoryFilter;
      return matchSearch && matchCat;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const resetForm = () => {
    setForm({ date: new Date().toISOString().slice(0, 10), category: "Office Supplies", description: "", amount: 0, paymentMode: "Cash" });
    setEditId(null);
  };

  const handleSave = () => {
    if (!form.description.trim()) { toast.error("Description is required"); return; }
    if (form.amount <= 0) { toast.error("Amount must be greater than 0"); return; }
    if (editId) {
      updateExpense(editId, form);
      toast.success("Expense updated");
    } else {
      addExpense(form);
      toast.success("Expense added — dashboard updated");
    }
    resetForm();
    setDialogOpen(false);
  };

  const handleEdit = (e: Expense) => {
    setForm({ date: e.date, category: e.category, description: e.description, amount: e.amount, paymentMode: e.paymentMode });
    setEditId(e.id);
    setDialogOpen(true);
  };

  const fmt = (n: number) => `₹ ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Expenses</h1>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" /> Create Expense</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit" : "Create"} Expense</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><label className="text-xs text-muted-foreground">Date</label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div>
                <label className="text-xs text-muted-foreground">Category</label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Input placeholder="Description *" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div><label className="text-xs text-muted-foreground">Amount (₹)</label><Input type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} /></div>
              <div>
                <label className="text-xs text-muted-foreground">Payment Mode</label>
                <Select value={form.paymentMode} onValueChange={(v) => setForm({ ...form, paymentMode: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Bank">Bank</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground">{editId ? "Update" : "Add"} Expense</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <Receipt className="w-8 h-8 text-primary" />
          <div><p className="text-xs text-muted-foreground">Total Expenses</p><p className="text-xl font-bold text-foreground">{fmt(totalExpenses)}</p></div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <TrendingDown className="w-8 h-8 text-destructive" />
          <div><p className="text-xs text-muted-foreground">This Month</p><p className="text-xl font-bold text-destructive">{fmt(expenses.filter(e => e.date.startsWith(new Date().toISOString().slice(0, 7))).reduce((s, e) => s + e.amount, 0))}</p></div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground">
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Description</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Mode</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No expenses found</td></tr>
            ) : (
              filtered.map((exp) => (
                <motion.tr key={exp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-foreground">{new Date(exp.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">{exp.category}</span></td>
                  <td className="px-4 py-3 text-foreground">{exp.description}</td>
                  <td className="px-4 py-3 text-right font-medium text-destructive">{fmt(exp.amount)}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{exp.paymentMode}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleEdit(exp)} className="p-1 hover:bg-muted rounded"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
                      <button onClick={() => { deleteExpense(exp.id); toast.success("Expense deleted"); }} className="p-1 hover:bg-destructive/10 rounded"><Trash2 className="w-4 h-4 text-destructive" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;
