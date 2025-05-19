
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ShipperPreferencesLayout from '@/pages/shipper/preferences/ShipperPreferencesLayout';
import ShipperPreferencesPage from '@/pages/shipper/preferences/ShipperPreferencesPage';

const ShipperPreferencesRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<ShipperPreferencesLayout />}>
        <Route index element={<ShipperPreferencesPage />} />
      </Route>
    </Routes>
  );
};

export default ShipperPreferencesRoutes;
