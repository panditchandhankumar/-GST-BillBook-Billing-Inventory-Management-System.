import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit2, FileText, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppData } from "@/contexts/AppDataContext";
import { formatCurrency } from "@/lib/billing";
import { toast } from "sonner";

const pageConfig: Record<string, { title: string; createLabel: string; statuses: string[] }> = {
  "/sales/quotation": { title: "Quotation / Estimate", createLabel: "Create Quotation", statuses: ["Open", "Accepted", "Rejected", "Expired"] },
  "/sales/payment-in": { title: "Payment In", createLabel: "Record Payment In", statuses: ["Received", "Pending"] },
  "/sales/return": { title: "Sales Return", createLabel: "Create Sales Return", statuses: ["Pending", "Approved", "Completed"] },
  "/sales/credit-note": { title: "Credit Note", createLabel: "Create Credit Note", statuses: ["Draft", "Issued", "Cancelled"] },
  "/sales/delivery-challan": { title: "Delivery Challan", createLabel: "Create Delivery Challan", statuses: ["Draft", "Delivered", "Returned"] },
  "/sales/proforma": { title: "Proforma Invoice", createLabel: "Create Proforma", statuses: ["Draft", "Sent", "Converted"] },
  "/purchases/payment-out": { title: "Payment Out", createLabel: "Record Payment Out", statuses: ["Paid", "Pending"] },
  "/purchases/return": { title: "Purchase Return", createLabel: "Create Purchase Return", statuses: ["Pending", "Approved", "Completed"] },
  "/purchases/debit-note": { title: "Debit Note", createLabel: "Create Debit Note", statuses: ["Draft", "Issued", "Cancelled"] },
};

const selectClassName = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";

const GenericPage = () => {
  const { pathname } = useLocation();
  const { customers, documents, addDocument, updateDocument, deleteDocument, getNextDocNo } = useAppData();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const config = pageConfig[pathname];

  const defaultForm = () => ({
    docNo: config ? getNextDocNo(pathname) : "",
    date: new Date().toISOString().slice(0, 10),
    partyId: "",
    partyName: "",
    amount: 0,
    status: config?.statuses[0] || "Draft",
    notes: "",
  });

  const [form, setForm] = useState(defaultForm);

  const filtered = useMemo(() =>
    documents
      .filter(d => d.type === pathname)
      .filter(d => {
        const q = search.toLowerCase();
        return d.docNo.toLowerCase().includes(q) || d.partyName.toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [documents, pathname, search]
  );

  const totalAmount = filtered.reduce((s, d) => s + d.amount, 0);

  if (!config) {
    const title = pathname.slice(1).replace(/[-/]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">This feature is coming soon.</p>
      </motion.div>
    );
  }

  const resetForm = () => { setForm({ ...defaultForm(), docNo: getNextDocNo(pathname) }); setEditId(null); };

  const handlePartyChange = (partyId: string) => {
    const party = customers.find(c => c.id === partyId);
    setForm(prev => ({ ...prev, partyId, partyName: party?.name || "" }));
  };

  const handleSave = () => {
    if (!form.partyId) { toast.error("Please select a party"); return; }
    if (form.amount <= 0) { toast.error("Amount must be greater than 0"); return; }

    if (editId) {
      updateDocument(editId, { ...form, type: pathname });
      toast.success(`${config.title} updated`);
    } else {
      addDocument({ ...form, type: pathname });
      toast.success(`${config.title} created`);
    }
    resetForm();
    setDialogOpen(false);
  };

  const handleEdit = (doc: typeof documents[0]) => {
    setForm({ docNo: doc.docNo, date: doc.date, partyId: doc.partyId, partyName: doc.partyName, amount: doc.amount, status: doc.status, notes: doc.notes });
    setEditId(doc.id);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">{config.title}</h1>
          <p className="text-sm text-muted-foreground">Manage all {config.title.toLowerCase()} records</p>
        </div>
        <Button className="bg-primary text-primary-foreground" onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-1" /> {config.createLabel}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Records</p>
          <p className="text-xl font-bold text-foreground">{filtered.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Amount</p>
          <p className="text-xl font-bold text-foreground">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">This Month</p>
          <p className="text-xl font-bold text-primary">{filtered.filter(d => d.date.startsWith(new Date().toISOString().slice(0, 7))).length}</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder={`Search ${config.title.toLowerCase()}...`} value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Doc No</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Party Name</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                  No {config.title.toLowerCase()} records yet. Click "{config.createLabel}" to add one.
                </td>
              </tr>
            ) : filtered.map(doc => (
              <motion.tr key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium text-primary">{doc.docNo}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(doc.date).toLocaleDateString("en-IN")}</td>
                <td className="px-4 py-3 text-foreground">{doc.partyName}</td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">{formatCurrency(doc.amount)}</td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">{doc.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleEdit(doc)} className="p-2 rounded-lg hover:bg-muted transition-colors"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
                    <button onClick={() => { deleteDocument(doc.id); toast.success("Record deleted"); }} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="w-4 h-4 text-destructive" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={open => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Edit" : "Create"} {config.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Document No</label>
                <Input value={form.docNo} disabled />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Date</label>
                <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Party</label>
              <select className={selectClassName} value={form.partyId} onChange={e => handlePartyChange(e.target.value)}>
                <option value="">Select party</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Amount (₹)</label>
                <Input type="number" min="0" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: Number(e.target.value) }))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Status</label>
                <select className={selectClassName} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  {config.statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Notes</label>
              <Input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Optional notes" />
            </div>
            <Button className="w-full bg-primary text-primary-foreground" onClick={handleSave}>
              {editId ? "Update" : "Save"} {config.title}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GenericPage;
