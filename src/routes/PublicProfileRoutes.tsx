
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PublicProfile from '@/pages/PublicProfile';

const PublicProfileRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path=":profilePath" element={<PublicProfile />} />
    </Routes>
  );
};

export default PublicProfileRoutes;
