
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import VehiclesLayout from '@/pages/subcontractor/vehicles/VehiclesLayout';
import VehiclesList from '@/pages/subcontractor/vehicles/VehiclesList';
import VehicleDetails from '@/pages/subcontractor/vehicles/VehicleDetails';
import AddVehicle from '@/pages/subcontractor/vehicles/AddVehicle';
import EditVehicle from '@/pages/subcontractor/vehicles/EditVehicle';

const SubcontractorVehiclesRoutes = () => {
  return (
    <Routes>
      <Route element={<VehiclesLayout />}>
        <Route index element={<VehiclesList />} />
        <Route path="add" element={<AddVehicle />} />
        <Route path=":id" element={<VehicleDetails />} />
        <Route path=":id/edit" element={<EditVehicle />} />
      </Route>
    </Routes>
  );
};

export default SubcontractorVehiclesRoutes;
