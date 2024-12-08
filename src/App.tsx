import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";

const queryClient = new QueryClient();

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isAdmin, isLoading } = useAuth();
  
  console.log("AdminRoute check - Session:", !!session, "IsAdmin:", isAdmin, "IsLoading:", isLoading);
  
  if (isLoading) {
    console.log("Auth is loading...");
    return null; // or a loading spinner
  }
  
  if (!session) {
    console.log("No session, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    console.log("User is not admin, redirecting to index");
    return <Navigate to="/" replace />;
  }
  
  console.log("User is admin, allowing access to admin route");
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/" element={<Index />} />
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;