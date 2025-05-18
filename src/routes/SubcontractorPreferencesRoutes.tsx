
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PreferencesLayout from '@/pages/subcontractor/preferences/PreferencesLayout';
import PreferencesPage from '@/pages/subcontractor/PreferencesPage';

const SubcontractorPreferencesRoutes = () => {
  return (
    <Routes>
      <Route element={<PreferencesLayout />}>
        <Route index element={<PreferencesPage />} />
        <Route path="edit" element={<PreferencesPage />} />
      </Route>
    </Routes>
  );
};

export default SubcontractorPreferencesRoutes;
