import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Edit2, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InvoiceLineItem, PurchaseOrder, useAppData } from "@/contexts/AppDataContext";
import { calculateDocumentTotals, calculateLineTotals, formatCurrency } from "@/lib/billing";
import { toast } from "sonner";

const today = () => new Date().toISOString().slice(0, 10);
const selectClassName = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";

const createLineItem = (): InvoiceLineItem => ({
  id: crypto.randomUUID(),
  itemId: "",
  name: "",
  hsn: "",
  qty: 1,
  price: 0,
  discount: 0,
  discountType: "%",
  tax: 18,
});

type PurchaseOrderForm = Pick<PurchaseOrder, "orderNo" | "date" | "dueDate" | "supplierId" | "status" | "notes" | "items">;

const createForm = (orderNo: string): PurchaseOrderForm => ({
  orderNo,
  date: today(),
  dueDate: today(),
  supplierId: "",
  status: "Draft",
  notes: "",
  items: [createLineItem()],
});

const statusClass: Record<PurchaseOrder["status"], string> = {
  Draft: "bg-muted text-muted-foreground",
  Ordered: "bg-warning/10 text-warning",
  Received: "bg-success/10 text-success",
};

const PurchaseOrders = () => {
  const {
    customers,
    items,
    purchaseOrders,
    addPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    getNextPurchaseOrderNo,
  } = useAppData();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<PurchaseOrderForm>(() => createForm(getNextPurchaseOrderNo()));

  const suppliers = customers.filter((customer) => customer.category === "Supplier");
  const supplierOptions = suppliers.length > 0 ? suppliers : customers;

  const totals = useMemo(() => calculateDocumentTotals(form.items), [form.items]);

  const filteredOrders = useMemo(() => purchaseOrders
    .filter((order) => {
      const query = search.toLowerCase();
      return order.orderNo.toLowerCase().includes(query) || order.supplierName.toLowerCase().includes(query);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [purchaseOrders, search]);

  const summary = useMemo(() => ({
    totalValue: purchaseOrders.reduce((sum, order) => sum + order.grandTotal, 0),
    openOrders: purchaseOrders.filter((order) => order.status !== "Received").length,
    receivedOrders: purchaseOrders.filter((order) => order.status === "Received").length,
  }), [purchaseOrders]);

  const resetForm = () => {
    setForm(createForm(getNextPurchaseOrderNo()));
    setEditId(null);
  };

  const updateLine = (lineId: string, patch: Partial<InvoiceLineItem>) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((line) => line.id === lineId ? { ...line, ...patch } : line),
    }));
  };

  const handleItemChange = (lineId: string, itemId: string) => {
    const selectedItem = items.find((item) => item.id === itemId);
    if (!selectedItem) return;

    updateLine(lineId, {
      itemId,
      name: selectedItem.name,
      hsn: selectedItem.hsn,
      price: selectedItem.purchasePrice || selectedItem.price,
      tax: selectedItem.taxRate,
    });
  };

  const handleEdit = (order: PurchaseOrder) => {
    setForm({
      orderNo: order.orderNo,
      date: order.date,
      dueDate: order.dueDate,
      supplierId: order.supplierId,
      status: order.status,
      notes: order.notes,
      items: order.items.map((line) => ({ ...line })),
    });
    setEditId(order.id);
    setDialogOpen(true);
  };

  const handleSave = () => {
    const supplier = supplierOptions.find((option) => option.id === form.supplierId);
    const validLines = form.items.filter((line) => line.name.trim() && line.qty > 0 && line.price > 0);

    if (!supplier) {
      toast.error("Please select a supplier");
      return;
    }

    if (validLines.length === 0) {
      toast.error("Add at least one valid purchase item");
      return;
    }

    const payload = {
      ...form,
      items: validLines,
      supplierName: supplier.name,
      subtotal: totals.subtotal,
      totalDiscount: totals.totalDiscount,
      totalTax: totals.totalTax,
      grandTotal: totals.grandTotal,
    };

    if (editId) {
      updatePurchaseOrder(editId, payload);
      toast.success("Purchase order updated");
    } else {
      addPurchaseOrder(payload);
      toast.success("Purchase order created");
    }

    resetForm();
    setDialogOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Purchase Orders</h1>
          <p className="text-sm text-muted-foreground">Create, edit, and track supplier orders</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" /> Create Purchase Order</Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>{editId ? "Edit" : "Create"} Purchase Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Order No</label>
                  <Input value={form.orderNo} disabled />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Order Date</label>
                  <Input type="date" value={form.date} onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Due Date</label>
                  <Input type="date" value={form.dueDate} onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Status</label>
                  <select className={selectClassName} value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as PurchaseOrder["status"] }))}>
                    <option value="Draft">Draft</option>
                    <option value="Ordered">Ordered</option>
                    <option value="Received">Received</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Supplier</label>
                <select className={selectClassName} value={form.supplierId} onChange={(event) => setForm((prev) => ({ ...prev, supplierId: event.target.value }))}>
                  <option value="">Select supplier</option>
                  {supplierOptions.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                  ))}
                </select>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase">Item</th>
                        <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase">HSN</th>
                        <th className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground uppercase">Qty</th>
                        <th className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground uppercase">Price</th>
                        <th className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground uppercase">Disc.</th>
                        <th className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground uppercase">GST</th>
                        <th className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                        <th className="w-12" />
                      </tr>
                    </thead>
                    <tbody>
                      {form.items.map((line) => (
                        <tr key={line.id} className="border-b border-border/50 align-top">
                          <td className="px-3 py-3 min-w-[220px]">
                            <select className={selectClassName} value={line.itemId || ""} onChange={(event) => handleItemChange(line.id, event.target.value)}>
                              <option value="">Select item</option>
                              {items.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-3 min-w-[120px]"><Input value={line.hsn} onChange={(event) => updateLine(line.id, { hsn: event.target.value })} /></td>
                          <td className="px-3 py-3 min-w-[90px]"><Input type="number" min="1" value={line.qty} onChange={(event) => updateLine(line.id, { qty: Number(event.target.value) })} /></td>
                          <td className="px-3 py-3 min-w-[120px]"><Input type="number" min="0" value={line.price} onChange={(event) => updateLine(line.id, { price: Number(event.target.value) })} /></td>
                          <td className="px-3 py-3 min-w-[120px]"><Input type="number" min="0" value={line.discount} onChange={(event) => updateLine(line.id, { discount: Number(event.target.value) })} /></td>
                          <td className="px-3 py-3 min-w-[100px]"><Input type="number" min="0" value={line.tax} onChange={(event) => updateLine(line.id, { tax: Number(event.target.value) })} /></td>
                          <td className="px-3 py-3 text-right font-semibold text-foreground whitespace-nowrap">{formatCurrency(calculateLineTotals(line).total)}</td>
                          <td className="px-3 py-3">
                            <button onClick={() => setForm((prev) => ({ ...prev, items: prev.items.length === 1 ? prev.items : prev.items.filter((entry) => entry.id !== line.id) }))} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors" title="Remove row">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-3 border-t border-border bg-card flex items-center justify-between gap-3">
                  <Button variant="outline" onClick={() => setForm((prev) => ({ ...prev, items: [...prev.items, createLineItem()] }))}>Add Item Row</Button>
                  <div className="text-sm text-right space-y-1">
                    <p className="text-muted-foreground">Subtotal: <span className="text-foreground font-medium">{formatCurrency(totals.subtotal)}</span></p>
                    <p className="text-muted-foreground">Tax: <span className="text-foreground font-medium">{formatCurrency(totals.totalTax)}</span></p>
                    <p className="text-base font-semibold text-foreground">Grand Total: {formatCurrency(totals.grandTotal)}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Notes</label>
                <Input value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} placeholder="Delivery notes or supplier remarks" />
              </div>

              <Button className="w-full bg-primary text-primary-foreground" onClick={handleSave}>{editId ? "Update" : "Save"} Purchase Order</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Order Value</p>
          <p className="text-xl font-bold text-foreground">{formatCurrency(summary.totalValue)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Open Orders</p>
          <p className="text-xl font-bold text-warning">{summary.openOrders}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Received Orders</p>
          <p className="text-xl font-bold text-success">{summary.receivedOrders}</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search purchase orders..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Order No</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Supplier</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Due Date</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  <ClipboardList className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                  No purchase orders yet
                </td>
              </tr>
            ) : filteredOrders.map((order) => (
              <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium text-primary">{order.orderNo}</td>
                <td className="px-4 py-3 text-foreground">{order.supplierName}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(order.date).toLocaleDateString("en-IN")}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(order.dueDate).toLocaleDateString("en-IN")}</td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">{formatCurrency(order.grandTotal)}</td>
                <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass[order.status]}`}>{order.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleEdit(order)} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Edit order"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
                    <button onClick={() => { deletePurchaseOrder(order.id); toast.success("Purchase order deleted"); }} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors" title="Delete order"><Trash2 className="w-4 h-4 text-destructive" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrders;