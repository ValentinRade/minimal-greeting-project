
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEmployees } from '@/hooks/useEmployees';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { CreateEmployeeData } from '@/types/employee';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const EditEmployee = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useEmployee, updateEmployee } = useEmployees();
  
  const { employee, isLoading, isError } = useEmployee(id);

  const handleSubmit = (data: CreateEmployeeData) => {
    if (!id) return;
    
    updateEmployee.mutate({
      id,
      ...data
    }, {
      onSuccess: () => {
        navigate(`/dashboard/subcontractor/employees/${id}`);
      },
      onError: (error: any) => {
        toast({
          title: t('errors.updateFailed'),
          description: error.message,
          variant: 'destructive',
        });
      }
    });
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/dashboard/subcontractor/employees/${id}`);
    } else {
      navigate('/dashboard/subcontractor/employees');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-destructive">{t('errors.loadFailed')}</h2>
        <p className="text-muted-foreground">{t('errors.employeeNotFound')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('employees.edit')}</h1>
        <p className="text-muted-foreground">{t('employees.editDescription')}</p>
      </div>

      <EmployeeForm 
        defaultValues={employee}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={updateEmployee.isPending}
        isEdit={true}
      />
    </div>
  );
};

export default EditEmployee;
