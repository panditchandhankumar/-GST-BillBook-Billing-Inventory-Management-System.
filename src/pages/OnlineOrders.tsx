import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Plus, Search, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OnlineOrder, useAppData } from "@/contexts/AppDataContext";
import { formatCurrency } from "@/lib/billing";
import { toast } from "sonner";

const selectClassName = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";
const today = () => new Date().toISOString().slice(0, 10);

const OnlineOrders = () => {
  const { onlineOrders, addOnlineOrder, updateOnlineOrder, deleteOnlineOrder } = useAppData();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ orderNo: "", platform: "Website", customerName: "", date: today(), items: "", amount: 0, status: "Pending" as OnlineOrder["status"] });

  const filtered = useMemo(() => onlineOrders.filter(o => o.orderNo.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase())).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [onlineOrders, search]);

  const totalRevenue = onlineOrders.filter(o => o.status === "Delivered").reduce((s, o) => s + o.amount, 0);

  const resetForm = () => {
    const nextNo = `OO-${String(onlineOrders.length + 1).padStart(3, "0")}`;
    setForm({ orderNo: nextNo, platform: "Website", customerName: "", date: today(), items: "", amount: 0, status: "Pending" });
    setEditId(null);
  };

  const handleSave = () => {
    if (!form.customerName.trim()) { toast.error("Customer name required"); return; }
    if (form.amount <= 0) { toast.error("Amount must be > 0"); return; }
    if (editId) {
      updateOnlineOrder(editId, form);
      toast.success("Order updated");
    } else {
      addOnlineOrder(form);
      toast.success("Order created");
    }
    resetForm();
    setDialogOpen(false);
  };

  const statusColor: Record<string, string> = {
    Pending: "bg-warning/10 text-warning",
    Processing: "bg-primary/10 text-primary",
    Shipped: "bg-accent text-accent-foreground",
    Delivered: "bg-success/10 text-success",
    Cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Online Orders</h1>
          <p className="text-sm text-muted-foreground">Track and manage orders from online channels</p>
        </div>
        <Button className="bg-primary text-primary-foreground" onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-1" /> Add Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Total Orders</p><p className="text-xl font-bold text-foreground">{onlineOrders.length}</p></div>
        <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Pending</p><p className="text-xl font-bold text-warning">{onlineOrders.filter(o => o.status === "Pending").length}</p></div>
        <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Delivered</p><p className="text-xl font-bold text-success">{onlineOrders.filter(o => o.status === "Delivered").length}</p></div>
        <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Revenue</p><p className="text-xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p></div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Order No</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Platform</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-muted-foreground"><ShoppingBag className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />No online orders yet</td></tr>
            ) : filtered.map(order => (
              <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium text-primary">{order.orderNo}</td>
                <td className="px-4 py-3 text-muted-foreground">{order.platform}</td>
                <td className="px-4 py-3 text-foreground">{order.customerName}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(order.date).toLocaleDateString("en-IN")}</td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">{formatCurrency(order.amount)}</td>
                <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[order.status]}`}>{order.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => { setForm({ orderNo: order.orderNo, platform: order.platform, customerName: order.customerName, date: order.date, items: order.items, amount: order.amount, status: order.status }); setEditId(order.id); setDialogOpen(true); }} className="p-2 rounded-lg hover:bg-muted transition-colors"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
                    <button onClick={() => { deleteOnlineOrder(order.id); toast.success("Order deleted"); }} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="w-4 h-4 text-destructive" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={open => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Online Order</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-muted-foreground">Order No</label><Input value={form.orderNo} disabled /></div>
              <div><label className="text-xs text-muted-foreground">Date</label><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
            </div>
            <Input placeholder="Customer name" value={form.customerName} onChange={e => setForm(p => ({ ...p, customerName: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Platform</label>
                <select className={selectClassName} value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))}>
                  <option>Website</option><option>Amazon</option><option>Flipkart</option><option>Shopify</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Status</label>
                <select className={selectClassName} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as OnlineOrder["status"] }))}>
                  <option>Pending</option><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option>
                </select>
              </div>
            </div>
            <Input placeholder="Items description" value={form.items} onChange={e => setForm(p => ({ ...p, items: e.target.value }))} />
            <div><label className="text-xs text-muted-foreground">Amount (₹)</label><Input type="number" min="0" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: Number(e.target.value) }))} /></div>
            <Button className="w-full bg-primary text-primary-foreground" onClick={handleSave}>{editId ? "Update" : "Add"} Order</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OnlineOrders;
