import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { AppDataProvider } from "@/contexts/AppDataContext";
import Dashboard from "./pages/Dashboard";
import Parties from "./pages/Parties";
import Items from "./pages/Items";
import Sales from "./pages/Sales";
import Purchases from "./pages/Purchases";
import CashBank from "./pages/CashBank";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import CreateSalesInvoice from "./pages/CreateSalesInvoice";
import GenericPage from "./pages/GenericPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppDataProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/parties" element={<Parties />} />
              <Route path="/items" element={<Items />} />
              <Route path="/items/godown" element={<GenericPage />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/sales/create" element={<CreateSalesInvoice />} />
              <Route path="/sales/edit/:id" element={<CreateSalesInvoice />} />
              <Route path="/sales/quotation" element={<GenericPage />} />
              <Route path="/sales/payment-in" element={<GenericPage />} />
              <Route path="/sales/return" element={<GenericPage />} />
              <Route path="/sales/credit-note" element={<GenericPage />} />
              <Route path="/sales/delivery-challan" element={<GenericPage />} />
              <Route path="/sales/proforma" element={<GenericPage />} />
              <Route path="/purchases" element={<Purchases />} />
              <Route path="/purchases/payment-out" element={<GenericPage />} />
              <Route path="/purchases/return" element={<GenericPage />} />
              <Route path="/purchases/debit-note" element={<GenericPage />} />
              <Route path="/purchases/orders" element={<GenericPage />} />
              <Route path="/cash-bank" element={<CashBank />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/e-invoicing" element={<GenericPage />} />
              <Route path="/automated-bills" element={<GenericPage />} />
              <Route path="/pos-billing" element={<GenericPage />} />
              <Route path="/staff-payroll" element={<GenericPage />} />
              <Route path="/manage-users" element={<GenericPage />} />
              <Route path="/online-orders" element={<GenericPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppDataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
