import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, AlertTriangle, MoreVertical, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Item {
  id: number;
  name: string;
  price: number;
  gstPercent: number;
  stock: number;
  unit: string;
  barcode?: string;
}

const sampleItems: Item[] = [
  { id: 1, name: "Samsung Galaxy A15", price: 12999, gstPercent: 18, stock: 45, unit: "Pcs" },
  { id: 2, name: "HP Ink Cartridge", price: 850, gstPercent: 18, stock: 3, unit: "Pcs" },
  { id: 3, name: "A4 Paper Ream", price: 320, gstPercent: 12, stock: 120, unit: "Pcs" },
  { id: 4, name: "USB-C Cable 1m", price: 199, gstPercent: 18, stock: 2, unit: "Pcs" },
  { id: 5, name: "Wireless Mouse", price: 599, gstPercent: 18, stock: 28, unit: "Pcs" },
  { id: 6, name: "LED Monitor 24\"", price: 11500, gstPercent: 28, stock: 8, unit: "Pcs" },
];

const Items = () => {
  const [items, setItems] = useState<Item[]>(sampleItems);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", price: "", gstPercent: "18", stock: "", unit: "Pcs", barcode: "" });

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = items.filter((i) => i.stock <= 5).length;

  const handleAdd = () => {
    if (!newItem.name || !newItem.price) return;
    setItems([...items, {
      id: Date.now(),
      name: newItem.name,
      price: parseFloat(newItem.price),
      gstPercent: parseFloat(newItem.gstPercent),
      stock: parseInt(newItem.stock) || 0,
      unit: newItem.unit,
      barcode: newItem.barcode || undefined,
    }]);
    setNewItem({ name: "", price: "", gstPercent: "18", stock: "", unit: "Pcs", barcode: "" });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Items</h1>
          <p className="text-sm text-muted-foreground">Manage your products and services</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground border-0">
              <Plus className="w-4 h-4 mr-2" />Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Item</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>Item Name</Label><Input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="Product name" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Sale Price (₹)</Label><Input type="number" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} placeholder="0" /></div>
                <div><Label>GST %</Label><Input type="number" value={newItem.gstPercent} onChange={(e) => setNewItem({ ...newItem, gstPercent: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Stock Qty</Label><Input type="number" value={newItem.stock} onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })} placeholder="0" /></div>
                <div><Label>Unit</Label><Input value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} /></div>
              </div>
              <div><Label>Barcode (optional)</Label><Input value={newItem.barcode} onChange={(e) => setNewItem({ ...newItem, barcode: e.target.value })} placeholder="Barcode number" /></div>
              <Button className="w-full gradient-primary text-primary-foreground border-0" onClick={handleAdd}>Add Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {lowStockCount > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 border-warning/30 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <p className="text-sm text-card-foreground"><span className="font-semibold">{lowStockCount} items</span> have low stock (≤5 units)</p>
        </motion.div>
      )}

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Item</th>
                <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">GST</th>
                <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stock</th>
                <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Value</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                        <Package className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right text-sm font-medium text-card-foreground">₹{item.price.toLocaleString("en-IN")}</td>
                  <td className="p-4 text-right"><Badge variant="secondary" className="text-xs">{item.gstPercent}%</Badge></td>
                  <td className="p-4 text-right">
                    <span className={`text-sm font-medium ${item.stock <= 5 ? "text-destructive" : "text-card-foreground"}`}>
                      {item.stock} {item.unit}
                    </span>
                    {item.stock <= 5 && <AlertTriangle className="w-3 h-3 text-warning inline ml-1" />}
                  </td>
                  <td className="p-4 text-right text-sm font-semibold text-card-foreground">₹{(item.price * item.stock).toLocaleString("en-IN")}</td>
                  <td className="p-4"><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Items;
