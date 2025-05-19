
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEmployeeById } from '@/hooks/useEmployeeById';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, StarHalf, Shield } from 'lucide-react';

const EmployeeDetails: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { t } = useTranslation();
  
  const { employee, isLoading: isEmployeeLoading } = useEmployeeById(employeeId);

  if (isEmployeeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t('employees.notFound')}</CardTitle>
            <CardDescription>
              {t('employees.employeeNotFound')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{t('employees.checkUrlOrContact')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container max-w-5xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>{`${employee.first_name} ${employee.last_name}`}</CardTitle>
            <CardDescription>{employee.position}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{employee.employee_type}</Badge>
              <Badge variant="outline">{employee.payment_type}</Badge>
            </div>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-medium">{t('employees.contactInfo')}</h3>
              <p>{employee.email}</p>
              <p>{employee.phone}</p>
            </div>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-medium">{t('employees.availability')}</h3>
              {employee.availability.map((availability) => (
                <div key={availability.id} className="flex justify-between">
                  <span>{t(`days.${availability.day_of_week}`)}</span>
                  <span>{availability.is_available ? t('common.available') : t('common.unavailable')}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-medium">{t('employees.licenses')}</h3>
              {employee.licenses.map((license) => (
                <div key={license.id} className="flex justify-between">
                  <span>{license.license_type}</span>
                  <span>{license.description}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-medium">{t('employees.performance')}</h3>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="ml-2">{t('employees.performanceRating')}: {employee.performance_rating || 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDetails;
