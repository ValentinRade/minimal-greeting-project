
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import RegisterInvited from "./pages/RegisterInvited";
import CreateCompany from "./pages/CreateCompany";
import ShipperDashboard from "./pages/ShipperDashboard";
import SubcontractorDashboard from "./pages/SubcontractorDashboard";
import NotFound from "./pages/NotFound";

// Settings pages
import SettingsLayout from "./pages/settings/SettingsLayout";
import ProfileSettings from "./pages/settings/ProfileSettings";
import CompanySettings from "./pages/settings/CompanySettings";
import CompanyUsers from "./pages/settings/CompanyUsers";
import CompanyInvitations from "./pages/settings/CompanyInvitations";
import RolesInfo from "./pages/settings/RolesInfo";

// Subcontractor routes
import SubcontractorPreferencesRoutes from "./routes/SubcontractorPreferencesRoutes";
import SubcontractorSelectionRoutes from './routes/SubcontractorSelectionRoutes';
import SubcontractorVehiclesRoutes from './routes/SubcontractorVehiclesRoutes';
import SubcontractorEmployeesRoutes from './routes/SubcontractorEmployeesRoutes';
import SubcontractorToursRoutes from './routes/SubcontractorToursRoutes';
import SubcontractorPublicProfileRoutes from './routes/SubcontractorPublicProfileRoutes';

// Import public profile page
import PublicProfile from './pages/PublicProfile';

// Import i18n for internationalization
import '@/i18n';

// Add these routes
import PublicProfileRoutes from './routes/PublicProfileRoutes';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/register-invited/*" element={<RegisterInvited />} />
                <Route path="/create-company" element={<CreateCompany />} />
                
                {/* Shipper routes */}
                <Route path="/dashboard/shipper" element={
                  <ProtectedRoute>
                    <ShipperDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Shipper Settings routes */}
                <Route path="/dashboard/shipper/settings" element={
                  <ProtectedRoute>
                    <SettingsLayout />
                  </ProtectedRoute>
                }>
                  <Route path="profile" element={<ProfileSettings />} />
                  <Route path="company" element={<CompanySettings />} />
                  <Route path="users" element={<CompanyUsers />} />
                  <Route path="invitations" element={<CompanyInvitations />} />
                  <Route path="roles" element={<RolesInfo />} />
                </Route>
                
                {/* Subcontractor routes */}
                <Route path="/dashboard/subcontractor" element={
                  <ProtectedRoute>
                    <SubcontractorDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Subcontractor Preferences route */}
                <Route path="/dashboard/subcontractor/preferences/*" element={
                  <ProtectedRoute>
                    <SubcontractorPreferencesRoutes />
                  </ProtectedRoute>
                } />
                
                {/* Subcontractor Tours route */}
                <Route path="/dashboard/subcontractor/tours/*" element={
                  <ProtectedRoute>
                    <SubcontractorToursRoutes />
                  </ProtectedRoute>
                } />
                
                {/* Subcontractor Settings routes */}
                <Route path="/dashboard/subcontractor/settings" element={
                  <ProtectedRoute>
                    <SettingsLayout />
                  </ProtectedRoute>
                }>
                  <Route path="profile" element={<ProfileSettings />} />
                  <Route path="company" element={<CompanySettings />} />
                  <Route path="users" element={<CompanyUsers />} />
                  <Route path="invitations" element={<CompanyInvitations />} />
                  <Route path="roles" element={<RolesInfo />} />
                </Route>
                
                {/* Add the selection routes */}
                <Route path="/dashboard/subcontractor/selection/*" element={
                  <ProtectedRoute>
                    <SubcontractorSelectionRoutes />
                  </ProtectedRoute>
                } />
                
                {/* Add the vehicles routes */}
                <Route path="/dashboard/subcontractor/vehicles/*" element={
                  <ProtectedRoute>
                    <SubcontractorVehiclesRoutes />
                  </ProtectedRoute>
                } />
                
                {/* Add the employees routes */}
                <Route path="/dashboard/subcontractor/employees/*" element={
                  <ProtectedRoute>
                    <SubcontractorEmployeesRoutes />
                  </ProtectedRoute>
                } />
                
                {/* Add the public profile routes */}
                <Route path="/dashboard/subcontractor/public-profile/*" element={
                  <ProtectedRoute>
                    <SubcontractorPublicProfileRoutes />
                  </ProtectedRoute>
                } />
                
                {/* Add the public profile route */}
                <Route path="/profile/*" element={<PublicProfileRoutes />} />
                
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
