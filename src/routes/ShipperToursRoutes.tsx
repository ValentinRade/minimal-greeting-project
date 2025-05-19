
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ToursLayout from '@/pages/shipper/tours/ToursLayout';
import ToursList from '@/pages/shipper/tours/ToursList';
import AddTour from '@/pages/shipper/tours/AddTour';
import EditTour from '@/pages/shipper/tours/EditTour';
import TourDetails from '@/pages/shipper/tours/TourDetails';

const ShipperToursRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<ToursLayout />}>
        <Route index element={<ToursList />} />
        <Route path="add" element={<AddTour />} />
        <Route path=":tourId" element={<TourDetails />} />
        <Route path=":tourId/edit" element={<EditTour />} />
      </Route>
    </Routes>
  );
};

export default ShipperToursRoutes;
