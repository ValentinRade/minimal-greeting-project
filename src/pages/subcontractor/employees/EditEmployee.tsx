
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEmployeeById } from '@/hooks/useEmployeeById';
import { useEmployeeMutations } from '@/hooks/useEmployeeMutations';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import type { Employee } from '@/types/employee';
import { Label } from '@/components/ui/label';

// Removing the form imports as we're not using react-hook-form here
// but instead building a simple form

const EditEmployee: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { employee, isLoading: isEmployeeLoading } = useEmployeeById(employeeId);
  const { updateEmployee: updateEmployeeMutation } = useEmployeeMutations();
  
  const [formData, setFormData] = useState<Employee | null>(null);
  
  useEffect(() => {
    if (employee) {
      setFormData(employee);
    }
  }, [employee]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      try {
        await updateEmployeeMutation.mutateAsync(formData);
        toast({
          title: t('employees.updateSuccess'),
          description: t('employees.employeeUpdated'),
        });
        navigate(`/subcontractor/employees/${formData.id}`);
      } catch (error) {
        toast({
          title: t('employees.updateError'),
          description: (error as Error).message,
          variant: 'destructive',
        });
      }
    }
  };
  
  if (isEmployeeLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <p>{t('common.loading')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!formData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('employees.notFound')}</CardTitle>
          <CardDescription>{t('employees.employeeNotFound')}</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('employees.editEmployee')}</CardTitle>
        <CardDescription>{t('employees.editEmployeeDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">{t('employees.firstName')}</Label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last_name">{t('employees.lastName')}</Label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">{t('employees.email')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
            />
          </div>
          
          <Button type="submit" disabled={updateEmployeeMutation.isPending}>
            {updateEmployeeMutation.isPending ? t('common.saving') : t('common.save')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditEmployee;
