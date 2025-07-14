import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Trades from "./pages/Trades";
import Metrics from "./pages/Metrics";
import Charts from "./pages/Charts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { ProtectedRoute } from "./components/custom/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
       <Routes>
  {/* Public routes */}
  <Route path="/" element={<Index />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />

  {/* Protected routes */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/trades"
    element={
      <ProtectedRoute>
        <Trades />
      </ProtectedRoute>
    }
  />
  <Route
    path="/metrics"
    element={
      <ProtectedRoute>
        <Metrics />
      </ProtectedRoute>
    }
  />
  <Route
    path="/charts"
    element={
      <ProtectedRoute>
        <Charts />
      </ProtectedRoute>
    }
  />
  <Route
    path="/reports"
    element={
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    }
  />
  <Route
    path="/settings"
    element={
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    }
  />

  {/* Fallback */}
  <Route path="*" element={<NotFound />} />
</Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
