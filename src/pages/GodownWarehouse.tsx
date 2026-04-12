import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Plus, Search, Trash2, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppData } from "@/contexts/AppDataContext";
import { toast } from "sonner";

const selectClassName = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";

const GodownWarehouse = () => {
  const { items, godownItems, addGodownItem, updateGodownItem, deleteGodownItem } = useAppData();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ itemId: "", itemName: "", godownName: "", stock: 0, minStock: 10 });

  const godowns = useMemo(() => [...new Set(godownItems.map(g => g.godownName))], [godownItems]);
  const filtered = useMemo(() => godownItems.filter(g => g.itemName.toLowerCase().includes(search.toLowerCase()) || g.godownName.toLowerCase().includes(search.toLowerCase())), [godownItems, search]);

  const totalStock = godownItems.reduce((s, g) => s + g.stock, 0);
  const lowStockCount = godownItems.filter(g => g.stock <= g.minStock).length;

  const resetForm = () => { setForm({ itemId: "", itemName: "", godownName: "", stock: 0, minStock: 10 }); setEditId(null); };

  const handleItemSelect = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    setForm(p => ({ ...p, itemId, itemName: item?.name || "" }));
  };

  const handleSave = () => {
    if (!form.itemId || !form.godownName.trim()) { toast.error("Item and godown name required"); return; }
    if (editId) {
      updateGodownItem(editId, form);
      toast.success("Godown entry updated");
    } else {
      addGodownItem(form);
      toast.success("Godown entry added");
    }
    resetForm();
    setDialogOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Godown (Warehouse)</h1>
          <p className="text-sm text-muted-foreground">Manage inventory across multiple warehouse locations</p>
        </div>
        <Button className="bg-primary text-primary-foreground" onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-1" /> Add Entry
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Godowns</p><p className="text-xl font-bold text-foreground">{godowns.length}</p></div>
        <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Entries</p><p className="text-xl font-bold text-foreground">{godownItems.length}</p></div>
        <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Total Stock</p><p className="text-xl font-bold text-foreground">{totalStock}</p></div>
        <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Low Stock</p><p className="text-xl font-bold text-destructive">{lowStockCount}</p></div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search godown items..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Item</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Godown</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Stock</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Min Stock</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-muted-foreground"><Warehouse className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />No godown entries yet</td></tr>
            ) : filtered.map(entry => (
              <motion.tr key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${entry.stock <= entry.minStock ? "bg-destructive/5" : ""}`}>
                <td className="px-4 py-3 font-medium text-foreground">{entry.itemName}</td>
                <td className="px-4 py-3 text-muted-foreground">{entry.godownName}</td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">{entry.stock}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">{entry.minStock}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${entry.stock <= entry.minStock ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                    {entry.stock <= entry.minStock ? "Low Stock" : "In Stock"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => { setForm({ itemId: entry.itemId, itemName: entry.itemName, godownName: entry.godownName, stock: entry.stock, minStock: entry.minStock }); setEditId(entry.id); setDialogOpen(true); }} className="p-2 rounded-lg hover:bg-muted transition-colors"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
                    <button onClick={() => { deleteGodownItem(entry.id); toast.success("Entry deleted"); }} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="w-4 h-4 text-destructive" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={open => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Godown Entry</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Item</label>
              <select className={selectClassName} value={form.itemId} onChange={e => handleItemSelect(e.target.value)}>
                <option value="">Select item</option>
                {items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </div>
            <Input placeholder="Godown / Warehouse name" value={form.godownName} onChange={e => setForm(p => ({ ...p, godownName: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-muted-foreground">Stock Qty</label><Input type="number" min="0" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: Number(e.target.value) }))} /></div>
              <div><label className="text-xs text-muted-foreground">Min Stock Level</label><Input type="number" min="0" value={form.minStock} onChange={e => setForm(p => ({ ...p, minStock: Number(e.target.value) }))} /></div>
            </div>
            <Button className="w-full bg-primary text-primary-foreground" onClick={handleSave}>{editId ? "Update" : "Add"} Entry</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GodownWarehouse;
