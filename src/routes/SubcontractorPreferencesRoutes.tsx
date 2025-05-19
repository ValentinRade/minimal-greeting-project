
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PreferencesPage from '@/pages/subcontractor/PreferencesPage';

const SubcontractorPreferencesRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<PreferencesPage />} />
    </Routes>
  );
};

export default SubcontractorPreferencesRoutes;
