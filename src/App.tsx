import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CellsPage from "./pages/CellsPage";
import LoopPage from "./pages/LoopPage";
import MetricsPage from "./pages/MetricsPage";
import KnowledgePage from "./pages/KnowledgePage";
import GovernancePage from "./pages/GovernancePage";
import MapPage from "./pages/MapPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cells" element={<CellsPage />} />
          <Route path="/loop" element={<LoopPage />} />
          <Route path="/metrics" element={<MetricsPage />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/governance" element={<GovernancePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
