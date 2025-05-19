
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEmployees } from '@/hooks/useEmployees';
import { useAuth } from '@/contexts/AuthContext';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { CreateEmployeeData } from '@/types/employee';
import { toast } from '@/hooks/use-toast';

const AddEmployee = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { company } = useAuth();
  const { createEmployee } = useEmployees(company?.id);

  const handleSubmit = (data: CreateEmployeeData) => {
    createEmployee.mutate(data, {
      onSuccess: () => {
        navigate('/dashboard/subcontractor/employees');
      },
      onError: (error: any) => {
        toast({
          title: t('errors.createFailed'),
          description: error.message,
          variant: 'destructive',
        });
      }
    });
  };

  const handleCancel = () => {
    navigate('/dashboard/subcontractor/employees');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('employees.addNew')}</h1>
        <p className="text-muted-foreground">{t('employees.addDescription')}</p>
      </div>

      <EmployeeForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={createEmployee.isPending}
      />
    </div>
  );
};

export default AddEmployee;
