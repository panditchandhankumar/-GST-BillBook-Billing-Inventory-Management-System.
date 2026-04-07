import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
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
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/parties" element={<Parties />} />
            <Route path="/items" element={<Items />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/sales/create" element={<CreateSalesInvoice />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/cash-bank" element={<CashBank />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/quotation" element={<GenericPage />} />
            <Route path="/payment-in" element={<GenericPage />} />
            <Route path="/sales-return" element={<GenericPage />} />
            <Route path="/credit-note" element={<GenericPage />} />
            <Route path="/delivery-challan" element={<GenericPage />} />
            <Route path="/proforma" element={<GenericPage />} />
            <Route path="/payment-out" element={<GenericPage />} />
            <Route path="/purchase-return" element={<GenericPage />} />
            <Route path="/debit-note" element={<GenericPage />} />
            <Route path="/purchase-orders" element={<GenericPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
