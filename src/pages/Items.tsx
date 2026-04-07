import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MoreVertical, TrendingUp, AlertTriangle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Item {
  id: number;
  name: string;
  code: string;
  price: number;
  stock: number;
  unit: string;
  purchasePrice: number;
}

const sampleItems: Item[] = [
  { id: 1, name: "atta", code: "-", price: 220, stock: 99, unit: "PKT", purchasePrice: 0 },
  { id: 2, name: "Sample Item", code: "8901262010023", price: 220, stock: 124, unit: "BOX", purchasePrice: 190 },
];

const Items = () => {
  const [items, setItems] = useState<Item[]>(sampleItems);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", code: "", price: "", stock: "", unit: "PCS", purchasePrice: "" });

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) || item.code.includes(search)
  );

  const stockValue = items.reduce((s, i) => s + i.price * i.stock, 0);
  const lowStock = items.filter((i) => i.stock <= 5).length;

  const handleAdd = () => {
    if (!newItem.name) return;
    setItems([...items, {
      id: Date.now(),
      name: newItem.name,
      code: newItem.code || "-",
      price: parseFloat(newItem.price) || 0,
      stock: parseInt(newItem.stock) || 0,
      unit: newItem.unit,
      purchasePrice: parseFloat(newItem.purchasePrice) || 0,
    }]);
    setNewItem({ name: "", code: "", price: "", stock: "", unit: "PCS", purchasePrice: "" });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Items</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="text-primary border-primary">Reports ▾</Button>
          <Button variant="ghost" size="icon"><svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 relative">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Stock Value ⓘ</span>
          </div>
          <p className="text-2xl font-bold text-foreground">₹ {stockValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 relative">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive font-medium">Low Stock</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{lowStock}</p>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9 w-56" placeholder="Search by Serial No." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="h-10 px-3 rounded-md border border-input bg-background text-sm">
            <option>Search Categories</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">Bulk Actions ▾</Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">Create Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Item</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div><Label>Item Name</Label><Input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="Item name" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Service Code</Label><Input value={newItem.code} onChange={(e) => setNewItem({ ...newItem, code: e.target.value })} placeholder="Barcode/HSN" /></div>
                  <div><Label>Selling Price (₹)</Label><Input type="number" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Stock</Label><Input type="number" value={newItem.stock} onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })} /></div>
                  <div><Label>Unit</Label><Input value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} /></div>
                </div>
                <div><Label>Purchase Price (₹)</Label><Input type="number" value={newItem.purchasePrice} onChange={(e) => setNewItem({ ...newItem, purchasePrice: e.target.value })} /></div>
                <Button className="w-full" onClick={handleAdd}>Create Item</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="w-10 px-4 py-3"><input type="checkbox" className="rounded" /></th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Service Name ⇅</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Service Code</th>
              <th className="text-right font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Selling Price</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-t border-border/50 hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3"><input type="checkbox" className="rounded" /></td>
                <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.code}</td>
                <td className="px-4 py-3 text-right font-medium text-foreground">₹ {item.price}</td>
                <td className="px-4 py-3"><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk Upload Banner */}
      <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/10 border border-border p-5">
        <h3 className="font-semibold text-foreground mb-1">Add Multiple Items at once</h3>
        <p className="text-sm text-muted-foreground mb-3">Bulk Upload Items from Product Library or Other Software like Vyapar, Tally, Marg & Busy</p>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">📥 Import Items</Button>
          <Button variant="outline" size="sm">📦 Product Library</Button>
          <Button variant="outline" size="sm">📊 Upload Excel</Button>
        </div>
      </div>
    </div>
  );
};

export default Items;
