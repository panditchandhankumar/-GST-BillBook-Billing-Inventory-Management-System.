import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, Building2, FileText, Printer, Users, Bell, FileCheck, CreditCard, Gift, HelpCircle, LogOut, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const settingsNav = [
  { id: "account", label: "Account", icon: User },
  { id: "business", label: "Manage Business", icon: Building2 },
  { id: "invoice", label: "Invoice Settings", icon: FileText },
  { id: "print", label: "Print Settings", icon: Printer },
  { id: "users", label: "Manage Users", icon: Users },
  { id: "reminders", label: "Reminders", icon: Bell },
  { id: "ca-reports", label: "CA Reports Sharing", icon: FileCheck },
  { id: "pricing", label: "Pricing", icon: CreditCard },
  { id: "refer", label: "Refer & Earn", icon: Gift },
  { id: "help", label: "Help And Support", icon: HelpCircle },
  { id: "logout", label: "Logout", icon: LogOut },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-semibold text-foreground">Account Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Full Name</Label><Input defaultValue="Business Owner" /></div>
              <div><Label>Email</Label><Input defaultValue="owner@business.com" /></div>
              <div><Label>Phone</Label><Input defaultValue="9030194547" /></div>
              <div><Label>Language</Label><Input defaultValue="English" /></div>
            </div>
            <Button className="bg-primary text-primary-foreground">Save Changes</Button>
          </div>
        );
      case "business":
        return (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-semibold text-foreground">Manage Business</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Business Name</Label><Input defaultValue="Business Name" /></div>
              <div><Label>GSTIN</Label><Input placeholder="Enter GSTIN" /></div>
              <div><Label>Business Type</Label><Input defaultValue="Retail" /></div>
              <div><Label>State</Label><Input defaultValue="Telangana" /></div>
              <div className="sm:col-span-2"><Label>Address</Label><Input placeholder="Business address" /></div>
            </div>
            <Button className="bg-primary text-primary-foreground">Save Changes</Button>
          </div>
        );
      case "reminders":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Reminder Settings</h2>
              <p className="text-sm text-muted-foreground">Select Which Reminders Are Sent To You And Your Parties</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">Send billing Whatsapp/SMS to Party</p>
                  <p className="text-xs text-muted-foreground">Send Whatsapp/SMS to your Party on creating any transaction</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">Get payment reminders on WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Get WhatsApp alerts when you have to collect payment from customers</p>
                </div>
                <Switch />
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 border border-border rounded-lg hover:bg-muted/20 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">TO PARTY (Reminders will be sent through sms)</span>
                <span className="text-muted-foreground">›</span>
              </button>
              <button className="w-full text-left px-4 py-3 border border-border rounded-lg hover:bg-muted/20 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">TO YOU (Reminders will be sent on mobile app and whatsapp)</span>
                <span className="text-muted-foreground">›</span>
              </button>
            </div>
          </div>
        );
      case "users":
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Manage Users</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">Number of Users</span>
                </div>
                <p className="text-2xl font-bold text-foreground">1</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-primary font-medium">Activities Performed</span>
                  <span className="text-xs text-muted-foreground">Last 30 Days</span>
                </div>
                <p className="text-2xl font-bold text-foreground">2</p>
              </div>
            </div>
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-foreground mb-2">Give access to users and monitor their actions</h3>
              <p className="text-sm text-muted-foreground mb-4">Manage your business more efficiently with full control and vision</p>
              <div className="flex justify-center gap-3">
                <Button className="bg-primary text-primary-foreground">+ Add New User</Button>
                <Button variant="outline">+ Add Your CA</Button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Coming soon</p>
          </div>
        );
    }
  };

  return (
    <div className="flex gap-0 -m-6 min-h-[calc(100vh-4rem)]">
      {/* Settings Sidebar */}
      <div className="w-[240px] border-r border-border bg-card flex-shrink-0">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center">
              <span className="text-sm font-bold">B</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Business Name</p>
              <p className="text-xs text-muted-foreground">9030194547</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </div>
        <nav className="px-2 py-2 space-y-0.5">
          {settingsNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-foreground/80 hover:bg-muted/50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="px-4 py-3 mt-auto text-xs text-muted-foreground">
          App Version : 9.2.1
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
