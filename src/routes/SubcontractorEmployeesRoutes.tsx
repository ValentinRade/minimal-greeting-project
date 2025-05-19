
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EmployeesLayout from '@/pages/subcontractor/employees/EmployeesLayout';
import EmployeesList from '@/pages/subcontractor/employees/EmployeesList';
import EmployeeDetails from '@/pages/subcontractor/employees/EmployeeDetails';
import AddEmployee from '@/pages/subcontractor/employees/AddEmployee';
import EditEmployee from '@/pages/subcontractor/employees/EditEmployee';

const SubcontractorEmployeesRoutes = () => {
  return (
    <Routes>
      <Route element={<EmployeesLayout />}>
        <Route index element={<EmployeesList />} />
        <Route path="add" element={<AddEmployee />} />
        <Route path=":id" element={<EmployeeDetails />} />
        <Route path=":id/edit" element={<EditEmployee />} />
      </Route>
    </Routes>
  );
};

export default SubcontractorEmployeesRoutes;
