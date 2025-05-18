
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SelectionCriteriaLayout from '@/pages/subcontractor/SelectionCriteriaLayout';
import PreferencesOverview from '@/pages/subcontractor/selection/PreferencesOverview';
import PrequalificationsOverview from '@/pages/subcontractor/selection/PrequalificationsOverview';
import PrequalificationsForm from '@/pages/subcontractor/selection/PrequalificationsForm';
import ReferencesOverview from '@/pages/subcontractor/selection/ReferencesOverview';
import ReferencesForm from '@/pages/subcontractor/selection/ReferencesForm';
import RankingOverview from '@/pages/subcontractor/selection/RankingOverview';

const SubcontractorSelectionRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SelectionCriteriaLayout />}>
        <Route path="preferences" element={<PreferencesOverview />} />
        <Route path="prequalifications" element={<PrequalificationsOverview />} />
        <Route path="prequalifications/edit" element={<PrequalificationsForm />} />
        <Route path="references" element={<ReferencesOverview />} />
        <Route path="references/edit" element={<ReferencesForm />} />
        <Route path="ranking" element={<RankingOverview />} />
        <Route index element={<PreferencesOverview />} />
      </Route>
    </Routes>
  );
};

export default SubcontractorSelectionRoutes;
