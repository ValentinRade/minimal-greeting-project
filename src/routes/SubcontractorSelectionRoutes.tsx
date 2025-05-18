
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SelectionCriteriaLayout from '@/pages/subcontractor/SelectionCriteriaLayout';
import PreferencesOverview from '@/pages/subcontractor/selection/PreferencesOverview';
import PrequalificationsOverview from '@/pages/subcontractor/selection/PrequalificationsOverview';
import PrequalificationsForm from '@/pages/subcontractor/selection/PrequalificationsForm';
import RankingOverview from '@/pages/subcontractor/selection/RankingOverview';

const SubcontractorSelectionRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SelectionCriteriaLayout />}>
        <Route path="preferences" element={<PreferencesOverview />} />
        <Route path="prequalifications" element={<PrequalificationsOverview />} />
        <Route path="prequalifications/edit" element={<PrequalificationsForm />} />
        <Route path="ranking" element={<RankingOverview />} />
        <Route index element={<PreferencesOverview />} />
      </Route>
    </Routes>
  );
};

export default SubcontractorSelectionRoutes;
