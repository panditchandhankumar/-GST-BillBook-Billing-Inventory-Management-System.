import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, ArrowDownCircle, ArrowUpCircle, MoreVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Party {
  id: number;
  name: string;
  category: string;
  phone: string;
  type: "Customer" | "Supplier";
  balance: number;
}

const sampleParties: Party[] = [
  { id: 1, name: "Cash Sale", category: "-", phone: "9030194547", type: "Customer", balance: 0 },
];

const Parties = () => {
  const [parties, setParties] = useState<Party[]>(sampleParties);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newParty, setNewParty] = useState({ name: "", phone: "", category: "", type: "Customer" as "Customer" | "Supplier" });

  const filtered = parties.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const toCollect = parties.filter(p => p.balance > 0).reduce((s, p) => s + p.balance, 0);
  const toPay = parties.filter(p => p.balance < 0).reduce((s, p) => s + Math.abs(p.balance), 0);

  const handleAdd = () => {
    if (!newParty.name) return;
    setParties([...parties, { ...newParty, id: Date.now(), balance: 0, category: newParty.category || "-" }]);
    setNewParty({ name: "", phone: "", category: "", type: "Customer" });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Parties</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="text-primary border-primary">
            SharedLedger Portal
          </Button>
          <Button variant="outline" size="sm" className="text-primary border-primary">
            Reports ▾
          </Button>
          <Button variant="ghost" size="icon"><Settings2Icon /></Button>
        </div>
      </div>

      {/* Referral Banner */}
      <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/10 border border-border rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="text-lg">🎁</span>
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Earn ₹501/- for each Referral</p>
            <p className="text-xs text-muted-foreground">You gain ₹501 per referral, while they enjoy 15% off on any premium plan purchase.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Refer Now</Button>
          <button className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">All Parties</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{parties.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowDownCircle className="w-4 h-4 text-success" />
            <span className="text-sm text-success font-medium">To Collect</span>
          </div>
          <p className="text-2xl font-bold text-foreground">₹ {toCollect.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowUpCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive font-medium">To Pay</span>
          </div>
          <p className="text-2xl font-bold text-foreground">₹ {toPay.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9 w-48" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="h-10 px-3 rounded-md border border-input bg-background text-sm">
            <option>Search Categories</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">Bulk Action ▾</Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">Create Party</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Party</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="flex gap-2">
                  <Button variant={newParty.type === "Customer" ? "default" : "outline"} size="sm" onClick={() => setNewParty({ ...newParty, type: "Customer" })}>Customer</Button>
                  <Button variant={newParty.type === "Supplier" ? "default" : "outline"} size="sm" onClick={() => setNewParty({ ...newParty, type: "Supplier" })}>Supplier</Button>
                </div>
                <div><Label>Party Name</Label><Input value={newParty.name} onChange={(e) => setNewParty({ ...newParty, name: e.target.value })} placeholder="Party name" /></div>
                <div><Label>Phone</Label><Input value={newParty.phone} onChange={(e) => setNewParty({ ...newParty, phone: e.target.value })} placeholder="Phone number" /></div>
                <div><Label>Category</Label><Input value={newParty.category} onChange={(e) => setNewParty({ ...newParty, category: e.target.value })} placeholder="Category" /></div>
                <Button className="w-full" onClick={handleAdd}>Create Party</Button>
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
              <th className="text-left font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Party Name ⇅</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Category</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Mobile Number</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Party type</th>
              <th className="text-right font-semibold text-muted-foreground px-4 py-3 uppercase text-xs">Balance ⇅</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((party, i) => (
              <motion.tr
                key={party.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-t border-border/50 hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-foreground">{party.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{party.category}</td>
                <td className="px-4 py-3 text-foreground">{party.phone}</td>
                <td className="px-4 py-3 text-foreground">{party.type}</td>
                <td className="px-4 py-3 text-right font-medium text-foreground">₹ {party.balance}</td>
                <td className="px-4 py-3"><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk Upload Banner */}
      <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/10 border border-border p-5">
        <h3 className="font-semibold text-foreground mb-1">Add Multiple Parties at once</h3>
        <p className="text-sm text-muted-foreground mb-3">Bulk upload all your parties using excel</p>
        <Button variant="outline" size="sm" className="text-primary border-primary">
          📊 Upload Excel
        </Button>
      </div>
    </div>
  );
};

function Settings2Icon() {
  return <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
}

export default Parties;
