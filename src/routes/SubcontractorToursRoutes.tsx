
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ToursLayout from '@/pages/subcontractor/tours/ToursLayout';
import ToursList from '@/pages/subcontractor/tours/ToursList';
import AddTour from '@/pages/subcontractor/tours/AddTour';
import EditTour from '@/pages/subcontractor/tours/EditTour';
import TourDetails from '@/pages/subcontractor/tours/TourDetails';

const SubcontractorToursRoutes: React.FC = () => {
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

export default SubcontractorToursRoutes;
