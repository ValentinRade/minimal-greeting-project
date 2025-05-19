import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEmployeeById } from '@/hooks/useEmployeeById';
import { useEmployeeMutations } from '@/hooks/useEmployeeMutations';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Employee } from '@/types/employee';

const EditEmployee: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { employee, isLoading: isEmployeeLoading } = useEmployeeById(employeeId);
  const { updateEmployee } = useEmployeeMutations();
  
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
        await updateEmployee(formData);
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
        <Form onSubmit={handleSubmit}>
          <FormField name="first_name" control={formData.first_name}>
            <FormLabel>{t('employees.firstName')}</FormLabel>
            <FormControl>
              <Input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormMessage />
          </FormField>
          <FormField name="last_name" control={formData.last_name}>
            <FormLabel>{t('employees.lastName')}</FormLabel>
            <FormControl>
              <Input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormMessage />
          </FormField>
          <FormField name="email" control={formData.email}>
            <FormLabel>{t('employees.email')}</FormLabel>
            <FormControl>
              <Input
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
              />
            </FormControl>
            <FormMessage />
          </FormField>
          <Button type="submit">{t('common.save')}</Button>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditEmployee;
