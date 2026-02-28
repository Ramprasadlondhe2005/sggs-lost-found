import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LostItems from "./pages/public/LostItems";
import ItemDetails from "./pages/public/ItemDetails";
import AboutUs from "./pages/public/AboutUs";
import Contact from "./pages/public/Contact";
import StudentLogin from "./pages/auth/StudentLogin";
import GuardLogin from "./pages/auth/GuardLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import Register from "./pages/auth/Register";
import StudentDashboard from "./pages/student/StudentDashboard";
import MyClaims from "./pages/student/MyClaims";
import ReportFound from "./pages/student/ReportFound";
import GuardDashboard from "./pages/guard/GuardDashboard";
import ManageItems from "./pages/guard/ManageItems";
import VerifyClaims from "./pages/guard/VerifyClaims";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import Analytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <NotificationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/lost-items" element={<LostItems />} />
              <Route path="/item/:id" element={<ItemDetails />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/student-login" element={<StudentLogin />} />
              <Route path="/guard-login" element={<GuardLogin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/register" element={<Register />} />

              {/* Student Routes */}
              <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student/claims" element={<ProtectedRoute allowedRoles={['student']}><MyClaims /></ProtectedRoute>} />
              <Route path="/student/report" element={<ProtectedRoute allowedRoles={['student']}><ReportFound /></ProtectedRoute>} />

              {/* Guard Routes */}
              <Route path="/guard/dashboard" element={<ProtectedRoute allowedRoles={['guard']}><GuardDashboard /></ProtectedRoute>} />
              <Route path="/guard/items" element={<ProtectedRoute allowedRoles={['guard']}><ManageItems /></ProtectedRoute>} />
              <Route path="/guard/claims" element={<ProtectedRoute allowedRoles={['guard']}><VerifyClaims /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><Analytics /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
