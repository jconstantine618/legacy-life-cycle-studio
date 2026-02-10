import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import PeriodicTable from "./pages/PeriodicTable";
import Assessment from "./pages/Assessment";
import Recommendations from "./pages/Recommendations";
import Auth from "./pages/Auth";
import LeadCapture from "./pages/LeadCapture";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/periodic-table" element={<PeriodicTable />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/lead-capture" element={<LeadCapture />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
