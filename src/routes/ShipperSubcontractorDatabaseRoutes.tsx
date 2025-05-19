
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SubcontractorDatabasePage from '@/pages/shipper/subcontractors/SubcontractorDatabasePage';

const ShipperSubcontractorDatabaseRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<SubcontractorDatabasePage />} />
    </Routes>
  );
};

export default ShipperSubcontractorDatabaseRoutes;
