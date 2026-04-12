import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Plus, Search, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppUser, useAppData } from "@/contexts/AppDataContext";
import { toast } from "sonner";

const selectClassName = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";

const ManageUsers = () => {
  const { appUsers, addAppUser, updateAppUser, deleteAppUser } = useAppData();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "Staff" as AppUser["role"], status: "Active" as AppUser["status"], lastLogin: "" });

  const filtered = useMemo(() => appUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())), [appUsers, search]);

  const resetForm = () => { setForm({ name: "", email: "", role: "Staff", status: "Active", lastLogin: "" }); setEditId(null); };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) { toast.error("Name and email required"); return; }
    if (editId) {
      updateAppUser(editId, form);
      toast.success("User updated");
    } else {
      addAppUser(form);
      toast.success("User added");
    }
    resetForm();
    setDialogOpen(false);
  };

  const roleColor: Record<string, string> = { Admin: "bg-destructive/10 text-destructive", Manager: "bg-warning/10 text-warning", Staff: "bg-primary/10 text-primary", Viewer: "bg-muted text-muted-foreground" };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Manage Users</h1>
          <p className="text-sm text-muted-foreground">Control access and permissions for your team</p>
        </div>
        <Button className="bg-primary text-primary-foreground" onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-1" /> Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(["Admin", "Manager", "Staff", "Viewer"] as const).map(role => (
          <div key={role} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{role}s</p>
            <p className="text-xl font-bold text-foreground">{appUsers.filter(u => u.role === role).length}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Email</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Role</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center text-muted-foreground"><Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />No users found</td></tr>
            ) : filtered.map(user => (
              <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColor[user.role]}`}>{user.role}</span></td>
                <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{user.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => { setForm({ name: user.name, email: user.email, role: user.role, status: user.status, lastLogin: user.lastLogin }); setEditId(user.id); setDialogOpen(true); }} className="p-2 rounded-lg hover:bg-muted transition-colors"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
                    <button onClick={() => { deleteAppUser(user.id); toast.success("User removed"); }} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="w-4 h-4 text-destructive" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={open => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} User</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            <Input placeholder="Email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Role</label>
                <select className={selectClassName} value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as AppUser["role"] }))}>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Staff">Staff</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Status</label>
                <select className={selectClassName} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as AppUser["status"] }))}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <Button className="w-full bg-primary text-primary-foreground" onClick={handleSave}>{editId ? "Update" : "Add"} User</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageUsers;
