
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import RegisterInvited from './pages/RegisterInvited';
import CreateCompany from './pages/CreateCompany';
import PublicProfile from './pages/PublicProfile';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import ShipperDashboard from './pages/ShipperDashboard';
import SubcontractorDashboard from './pages/SubcontractorDashboard';
import { Toaster } from './components/ui/toaster';
import SubcontractorVehiclesRoutes from './routes/SubcontractorVehiclesRoutes';
import SubcontractorEmployeesRoutes from './routes/SubcontractorEmployeesRoutes';
import SubcontractorToursRoutes from './routes/SubcontractorToursRoutes';
import SubcontractorSelectionRoutes from './routes/SubcontractorSelectionRoutes';
import SubcontractorPreferencesRoutes from './routes/SubcontractorPreferencesRoutes';
import SubcontractorPublicProfileRoutes from './routes/SubcontractorPublicProfileRoutes';
import ShipperSubcontractorDatabaseRoutes from './routes/ShipperSubcontractorDatabaseRoutes';

// Settings routes
import SettingsLayout from './pages/settings/SettingsLayout';
import SettingsIndex from './pages/settings/SettingsIndex';
import CompanySettings from './pages/settings/CompanySettings';
import ProfileSettings from './pages/settings/ProfileSettings';
import CompanyInvitations from './pages/settings/CompanyInvitations';
import CompanyUsers from './pages/settings/CompanyUsers';
import RolesInfo from './pages/settings/RolesInfo';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/register/invited" element={<RegisterInvited />} />
          <Route path="/create-company" element={<CreateCompany />} />
          <Route path="/public/profile/:companyId" element={<PublicProfile />} />

          {/* Protected dashboard routes */}
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout>
            <Routes>
              <Route path="/*" element={<></>} />
            </Routes>
          </AppLayout></ProtectedRoute>}>
            {/* Shipper routes */}
            <Route path="shipper" element={<ShipperDashboard />} />
            <Route path="shipper/subcontractors/*" element={<ShipperSubcontractorDatabaseRoutes />} />

            {/* Subcontractor routes */}
            <Route path="subcontractor" element={<SubcontractorDashboard />} />
            <Route path="subcontractor/vehicles/*" element={<SubcontractorVehiclesRoutes />} />
            <Route path="subcontractor/employees/*" element={<SubcontractorEmployeesRoutes />} />
            <Route path="subcontractor/tours/*" element={<SubcontractorToursRoutes />} />
            <Route path="subcontractor/selection/*" element={<SubcontractorSelectionRoutes />} />
            <Route path="subcontractor/preferences/*" element={<SubcontractorPreferencesRoutes />} />
            <Route path="subcontractor/profile/*" element={<SubcontractorPublicProfileRoutes />} />

            {/* Settings routes */}
            <Route path="settings" element={<SettingsLayout />}>
              <Route index element={<SettingsIndex />} />
              <Route path="profile" element={<ProfileSettings />} />
              <Route path="company" element={<CompanySettings />} />
              <Route path="invitations" element={<CompanyInvitations />} />
              <Route path="users" element={<CompanyUsers />} />
              <Route path="roles" element={<RolesInfo />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
