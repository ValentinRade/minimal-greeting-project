
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PublicProfilePage from '@/pages/subcontractor/profile/PublicProfilePage';

const SubcontractorPublicProfileRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<PublicProfilePage />} />
    </Routes>
  );
};

export default SubcontractorPublicProfileRoutes;
