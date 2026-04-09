import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Trash2, Edit2, Package, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppData, Item } from "@/contexts/AppDataContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const Items = () => {
  const { items, addItem, updateItem, deleteItem } = useAppData();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", code: "", hsn: "", price: 0, purchasePrice: 0, stock: 0, unit: "PCS", taxRate: 18 });

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase()));
  const stockValue = items.reduce((s, i) => s + i.stock * i.price, 0);
  const lowStock = items.filter(i => i.stock < 10).length;

  const resetForm = () => {
    setForm({ name: "", code: "", hsn: "", price: 0, purchasePrice: 0, stock: 0, unit: "PCS", taxRate: 18 });
    setEditId(null);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Item name is required"); return; }
    if (editId) {
      updateItem(editId, form);
      toast.success("Item updated");
    } else {
      addItem(form);
      toast.success("Item added");
    }
    resetForm();
    setDialogOpen(false);
  };

  const handleEdit = (i: Item) => {
    setForm({ name: i.name, code: i.code, hsn: i.hsn, price: i.price, purchasePrice: i.purchasePrice, stock: i.stock, unit: i.unit, taxRate: i.taxRate });
    setEditId(i.id);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Items</h1>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" /> Create Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit" : "Create"} Item</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Item Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Item Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              <Input placeholder="HSN Code" value={form.hsn} onChange={(e) => setForm({ ...form, hsn: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Sale Price</label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
                <div><label className="text-xs text-muted-foreground">Purchase Price</label><Input type="number" value={form.purchasePrice} onChange={(e) => setForm({ ...form, purchasePrice: Number(e.target.value) })} /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs text-muted-foreground">Stock</label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /></div>
                <div><label className="text-xs text-muted-foreground">Unit</label><Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /></div>
                <div><label className="text-xs text-muted-foreground">Tax %</label><Input type="number" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })} /></div>
              </div>
              <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground">{editId ? "Update" : "Add"} Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <Package className="w-8 h-8 text-primary" />
          <div><p className="text-xs text-muted-foreground">Total Items</p><p className="text-xl font-bold text-foreground">{items.length}</p></div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <Package className="w-8 h-8 text-success" />
          <div><p className="text-xs text-muted-foreground">Stock Value</p><p className="text-xl font-bold text-success">₹ {stockValue.toLocaleString("en-IN")}</p></div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-warning" />
          <div><p className="text-xs text-muted-foreground">Low Stock</p><p className="text-xl font-bold text-warning">{lowStock}</p></div>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Code</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">HSN</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Price</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Stock</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Tax %</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">No items found</td></tr>
            ) : (
              filtered.map((item) => (
                <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.code}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.hsn}</td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">₹ {item.price.toLocaleString("en-IN")}</td>
                  <td className={`px-4 py-3 text-right font-medium ${item.stock < 10 ? "text-destructive" : "text-foreground"}`}>{item.stock} {item.unit}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{item.taxRate}%</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleEdit(item)} className="p-1 hover:bg-muted rounded"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
                      <button onClick={() => { deleteItem(item.id); toast.success("Item deleted"); }} className="p-1 hover:bg-destructive/10 rounded"><Trash2 className="w-4 h-4 text-destructive" /></button>
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

export default Items;
