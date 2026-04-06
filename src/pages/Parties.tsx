import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Phone, MapPin, FileText, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Party {
  id: number;
  name: string;
  phone: string;
  address: string;
  gstin: string;
  type: "customer" | "supplier";
  balance: number;
}

const sampleParties: Party[] = [
  { id: 1, name: "Sharma Electronics", phone: "9876543210", address: "MG Road, Delhi", gstin: "07AABCS1429B1ZS", type: "customer", balance: 12500 },
  { id: 2, name: "Gupta Traders", phone: "9876543211", address: "Station Road, Mumbai", gstin: "27AABCG5678D1ZP", type: "supplier", balance: -8200 },
  { id: 3, name: "Patel & Sons", phone: "9876543212", address: "Ring Road, Ahmedabad", gstin: "24AABCP9876E1ZR", type: "customer", balance: 24800 },
  { id: 4, name: "Kumar Supplies", phone: "9876543213", address: "Civil Lines, Jaipur", gstin: "08AABCK4567F1ZQ", type: "supplier", balance: -5600 },
  { id: 5, name: "Singh Enterprises", phone: "9876543214", address: "Mall Road, Chandigarh", gstin: "04AABCS7890G1ZT", type: "customer", balance: 18900 },
];

const Parties = () => {
  const [parties, setParties] = useState<Party[]>(sampleParties);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newParty, setNewParty] = useState({ name: "", phone: "", address: "", gstin: "", type: "customer" as const });

  const filtered = parties.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const customers = filtered.filter((p) => p.type === "customer");
  const suppliers = filtered.filter((p) => p.type === "supplier");

  const handleAdd = () => {
    if (!newParty.name) return;
    setParties([...parties, { ...newParty, id: Date.now(), balance: 0 }]);
    setNewParty({ name: "", phone: "", address: "", gstin: "", type: "customer" });
    setDialogOpen(false);
  };

  const PartyList = ({ items }: { items: Party[] }) => (
    <div className="space-y-3">
      {items.map((party, i) => (
        <motion.div
          key={party.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass-card p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary-foreground">{party.name[0]}</span>
            </div>
            <div className="min-w-0">
              <p className="font-medium text-card-foreground truncate">{party.name}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{party.phone}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{party.address}</span>
              </div>
              {party.gstin && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <FileText className="w-3 h-3" />GSTIN: {party.gstin}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <p className={`text-sm font-semibold ${party.balance >= 0 ? "text-success" : "text-destructive"}`}>
                {party.balance >= 0 ? "To Collect" : "To Pay"}
              </p>
              <p className="text-lg font-bold text-card-foreground">₹{Math.abs(party.balance).toLocaleString("en-IN")}</p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      ))}
      {items.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No parties found</div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Parties</h1>
          <p className="text-sm text-muted-foreground">Manage your customers and suppliers</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground border-0">
              <Plus className="w-4 h-4 mr-2" />Add Party
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Party</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="flex gap-2">
                <Button
                  variant={newParty.type === "customer" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNewParty({ ...newParty, type: "customer" })}
                >Customer</Button>
                <Button
                  variant={newParty.type === "supplier" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNewParty({ ...newParty, type: "supplier" })}
                >Supplier</Button>
              </div>
              <div><Label>Name</Label><Input value={newParty.name} onChange={(e) => setNewParty({ ...newParty, name: e.target.value })} placeholder="Party name" /></div>
              <div><Label>Phone</Label><Input value={newParty.phone} onChange={(e) => setNewParty({ ...newParty, phone: e.target.value })} placeholder="Phone number" /></div>
              <div><Label>Address</Label><Input value={newParty.address} onChange={(e) => setNewParty({ ...newParty, address: e.target.value })} placeholder="Address" /></div>
              <div><Label>GSTIN</Label><Input value={newParty.gstin} onChange={(e) => setNewParty({ ...newParty, gstin: e.target.value })} placeholder="GST Number" /></div>
              <Button className="w-full gradient-primary text-primary-foreground border-0" onClick={handleAdd}>Add Party</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search parties..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="customers">
        <TabsList>
          <TabsTrigger value="customers">Customers ({customers.length})</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers ({suppliers.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="customers" className="mt-4"><PartyList items={customers} /></TabsContent>
        <TabsContent value="suppliers" className="mt-4"><PartyList items={suppliers} /></TabsContent>
      </Tabs>
    </div>
  );
};

export default Parties;
