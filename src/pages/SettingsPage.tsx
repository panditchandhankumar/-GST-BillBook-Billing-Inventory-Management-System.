import { motion } from "framer-motion";
import { Building2, FileText, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your business profile and preferences</p>
      </div>

      <Tabs defaultValue="business">
        <TabsList>
          <TabsTrigger value="business"><Building2 className="w-4 h-4 mr-1.5" />Business</TabsTrigger>
          <TabsTrigger value="invoice"><FileText className="w-4 h-4 mr-1.5" />Invoice</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="w-4 h-4 mr-1.5" />Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="mt-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 space-y-6 max-w-2xl">
            <h3 className="font-semibold text-card-foreground">Business Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Business Name</Label><Input defaultValue="ABC Electronics" /></div>
              <div><Label>GSTIN</Label><Input defaultValue="07AABCE1234F1ZH" /></div>
              <div><Label>Phone</Label><Input defaultValue="9876543210" /></div>
              <div><Label>Email</Label><Input defaultValue="info@abcelectronics.com" /></div>
              <div className="sm:col-span-2"><Label>Address</Label><Input defaultValue="123 MG Road, New Delhi - 110001" /></div>
            </div>
            <Button className="gradient-primary text-primary-foreground border-0">Save Changes</Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="invoice" className="mt-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 space-y-6 max-w-2xl">
            <h3 className="font-semibold text-card-foreground">Invoice Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Invoice Prefix</Label><Input defaultValue="INV-" /></div>
              <div><Label>Starting Number</Label><Input type="number" defaultValue="001" /></div>
              <div className="sm:col-span-2"><Label>Terms & Conditions</Label><Input defaultValue="Goods once sold will not be taken back." /></div>
              <div className="sm:col-span-2"><Label>Bank Details (for invoice)</Label><Input defaultValue="SBI A/c: 12345678901, IFSC: SBIN0001234" /></div>
            </div>
            <Button className="gradient-primary text-primary-foreground border-0">Save Changes</Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="appearance" className="mt-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 space-y-4 max-w-2xl">
            <h3 className="font-semibold text-card-foreground">Appearance</h3>
            <p className="text-sm text-muted-foreground">Customize how your application looks.</p>
            <div className="flex gap-3">
              <div className="w-20 h-14 rounded-lg bg-background border-2 border-primary flex items-center justify-center cursor-pointer">
                <span className="text-xs font-medium text-foreground">Light</span>
              </div>
              <div className="w-20 h-14 rounded-lg bg-foreground border-2 border-border flex items-center justify-center cursor-pointer">
                <span className="text-xs font-medium text-background">Dark</span>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
