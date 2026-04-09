import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Trash2, Edit2, Users, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppData, Customer } from "@/contexts/AppDataContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Parties = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useAppData();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", gstin: "", address: "", category: "Customer" as "Customer" | "Supplier" });

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const toCollect = customers.filter(c => c.balance > 0).reduce((s, c) => s + c.balance, 0);
  const toPay = customers.filter(c => c.balance < 0).reduce((s, c) => s + Math.abs(c.balance), 0);

  const resetForm = () => {
    setForm({ name: "", phone: "", email: "", gstin: "", address: "", category: "Customer" });
    setEditId(null);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    if (editId) {
      updateCustomer(editId, form);
      toast.success("Party updated");
    } else {
      addCustomer(form);
      toast.success("Party added");
    }
    resetForm();
    setDialogOpen(false);
  };

  const handleEdit = (c: Customer) => {
    setForm({ name: c.name, phone: c.phone, email: c.email, gstin: c.gstin, address: c.address, category: c.category });
    setEditId(c.id);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteCustomer(id);
    toast.success("Party deleted");
  };

  const fmt = (n: number) => `₹ ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Parties</h1>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" /> Create Party</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit" : "Create"} Party</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Party Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="GSTIN" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} />
              <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as "Customer" | "Supplier" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground">{editId ? "Update" : "Add"} Party</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          <div><p className="text-xs text-muted-foreground">Total Parties</p><p className="text-xl font-bold text-foreground">{customers.length}</p></div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-success" />
          <div><p className="text-xs text-muted-foreground">To Collect</p><p className="text-xl font-bold text-success">{fmt(toCollect)}</p></div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <TrendingDown className="w-8 h-8 text-destructive" />
          <div><p className="text-xs text-muted-foreground">To Pay</p><p className="text-xl font-bold text-destructive">{fmt(toPay)}</p></div>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search parties..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Phone</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">GSTIN</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Balance</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No parties found</td></tr>
            ) : (
              filtered.map((c) => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.phone}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.category === "Customer" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}`}>{c.category}</span></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{c.gstin || "-"}</td>
                  <td className={`px-4 py-3 text-right font-medium ${c.balance > 0 ? "text-success" : c.balance < 0 ? "text-destructive" : "text-foreground"}`}>{fmt(Math.abs(c.balance))}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleEdit(c)} className="p-1 hover:bg-muted rounded"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
                      <button onClick={() => handleDelete(c.id)} className="p-1 hover:bg-destructive/10 rounded"><Trash2 className="w-4 h-4 text-destructive" /></button>
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

export default Parties;
