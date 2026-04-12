import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Plus, Search, Trash2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppData, StaffMember } from "@/contexts/AppDataContext";
import { formatCurrency } from "@/lib/billing";
import { toast } from "sonner";

const selectClassName = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";
const today = () => new Date().toISOString().slice(0, 10);

const StaffPayroll = () => {
  const { staffMembers, addStaffMember, updateStaffMember, deleteStaffMember } = useAppData();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", phone: "", salary: 0, joinDate: today() });
  const [attendanceDate, setAttendanceDate] = useState(today());

  const filtered = useMemo(() => staffMembers.filter(s => s.name.toLowerCase().includes(search.toLowerCase())), [staffMembers, search]);
  const totalSalary = staffMembers.reduce((s, m) => s + m.salary, 0);

  const resetForm = () => { setForm({ name: "", role: "", phone: "", salary: 0, joinDate: today() }); setEditId(null); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    if (form.salary <= 0) { toast.error("Salary must be > 0"); return; }
    if (editId) {
      updateStaffMember(editId, form);
      toast.success("Staff updated");
    } else {
      addStaffMember({ ...form, attendance: {} });
      toast.success("Staff added");
    }
    resetForm();
    setDialogOpen(false);
  };

  const markAttendance = (id: string, status: "Present" | "Absent" | "Half Day") => {
    const member = staffMembers.find(s => s.id === id);
    if (!member) return;
    updateStaffMember(id, { attendance: { ...member.attendance, [attendanceDate]: status } });
    toast.success(`${member.name} marked ${status}`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Staff Attendance & Payroll</h1>
          <p className="text-sm text-muted-foreground">Manage staff, attendance, and salary records</p>
        </div>
        <Button className="bg-primary text-primary-foreground" onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-1" /> Add Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Staff</p>
          <p className="text-xl font-bold text-foreground">{staffMembers.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Monthly Payroll</p>
          <p className="text-xl font-bold text-foreground">{formatCurrency(totalSalary)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Present Today</p>
          <p className="text-xl font-bold text-success">{staffMembers.filter(s => s.attendance[attendanceDate] === "Present").length}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mr-2">Attendance Date</label>
          <Input type="date" className="w-auto inline-block" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Phone</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Salary</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Attendance</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-muted-foreground"><UserCheck className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />No staff members yet</td></tr>
            ) : filtered.map(member => (
              <motion.tr key={member.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{member.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{member.role}</td>
                <td className="px-4 py-3 text-muted-foreground">{member.phone}</td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">{formatCurrency(member.salary)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    {(["Present", "Absent", "Half Day"] as const).map(status => (
                      <button key={status} onClick={() => markAttendance(member.id, status)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          member.attendance[attendanceDate] === status
                            ? status === "Present" ? "bg-success/20 text-success" : status === "Absent" ? "bg-destructive/20 text-destructive" : "bg-warning/20 text-warning"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >{status === "Half Day" ? "½" : status[0]}</button>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => { setForm({ name: member.name, role: member.role, phone: member.phone, salary: member.salary, joinDate: member.joinDate }); setEditId(member.id); setDialogOpen(true); }} className="p-2 rounded-lg hover:bg-muted transition-colors"><Edit2 className="w-4 h-4 text-muted-foreground" /></button>
                    <button onClick={() => { deleteStaffMember(member.id); toast.success("Staff removed"); }} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="w-4 h-4 text-destructive" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={open => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Staff Member</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            <Input placeholder="Role / Designation" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
            <Input placeholder="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-muted-foreground">Monthly Salary</label><Input type="number" min="0" value={form.salary} onChange={e => setForm(p => ({ ...p, salary: Number(e.target.value) }))} /></div>
              <div><label className="text-xs text-muted-foreground">Join Date</label><Input type="date" value={form.joinDate} onChange={e => setForm(p => ({ ...p, joinDate: e.target.value }))} /></div>
            </div>
            <Button className="w-full bg-primary text-primary-foreground" onClick={handleSave}>{editId ? "Update" : "Add"} Staff</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffPayroll;
