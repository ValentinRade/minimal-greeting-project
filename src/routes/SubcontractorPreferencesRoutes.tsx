
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import PreferencesLayout from '@/pages/subcontractor/preferences/PreferencesLayout';
import PreferencesPage from '@/pages/subcontractor/PreferencesPage';

const SubcontractorPreferencesRoutes = () => {
  return (
    <Routes>
      <Route element={<PreferencesLayout />}>
        <Route index element={<Navigate to="/dashboard/subcontractor/selection/preferences" replace />} />
        <Route path="edit" element={<Navigate to="/dashboard/subcontractor/selection/preferences/edit" replace />} />
      </Route>
    </Routes>
  );
};

export default SubcontractorPreferencesRoutes;
