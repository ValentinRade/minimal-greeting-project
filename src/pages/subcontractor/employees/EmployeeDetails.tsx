
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEmployees } from '@/hooks/useEmployees';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Edit, Loader2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const EmployeeDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useEmployee, deleteEmployee } = useEmployees();
  
  const { data: employee, isLoading, error } = useEmployee(id);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditClick = () => {
    navigate(`/dashboard/subcontractor/employees/${id}/edit`);
  };

  const handleDeleteClick = () => {
    if (!id) return;
    
    deleteEmployee.mutate(id, {
      onSuccess: () => {
        navigate('/dashboard/subcontractor/employees');
      },
      onError: (error: any) => {
        toast({
          title: t('errors.deleteFailed'),
          description: error.message,
          variant: 'destructive',
        });
      }
    });
  };

  const handleBackClick = () => {
    navigate('/dashboard/subcontractor/employees');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-destructive">{t('errors.loadFailed')}</h2>
        <p className="text-muted-foreground">{t('errors.employeeNotFound')}</p>
      </div>
    );
  }

  const getDayName = (dayNumber: number) => {
    const days = [
      t('days.sunday'),
      t('days.monday'),
      t('days.tuesday'),
      t('days.wednesday'),
      t('days.thursday'),
      t('days.friday'),
      t('days.saturday')
    ];
    return days[dayNumber];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <Button 
            onClick={handleBackClick} 
            variant="ghost" 
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <h1 className="text-2xl font-bold">
            {employee.first_name} {employee.last_name}
          </h1>
          <p className="text-muted-foreground">{employee.position}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleEditClick}
          >
            <Edit className="h-4 w-4 mr-2" />
            {t('common.edit')}
          </Button>
          
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                {t('common.delete')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('employees.confirmDelete')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('employees.deleteWarning', { 
                    name: `${employee.first_name} ${employee.last_name}` 
                  })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteClick}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteEmployee.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t('common.delete')
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">{t('employees.tabOverview')}</TabsTrigger>
          <TabsTrigger value="schedule">{t('employees.tabSchedule')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('employees.personalInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('employees.name')}</h3>
                <p>{employee.first_name} {employee.last_name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('employees.position')}</h3>
                <p>{employee.position}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('employees.email')}</h3>
                <p>{employee.email || t('general.notProvided')}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('employees.phone')}</h3>
                <p>{employee.phone || t('general.notProvided')}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('employees.employeeType')}</h3>
                <p>
                  {employee.employee_type === 'employed' 
                    ? t('employees.typeEmployed') 
                    : t('employees.typeContractor')}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('employees.paymentType')}</h3>
                <p>
                  {employee.payment_type === 'salary' && t('employees.paymentSalary')}
                  {employee.payment_type === 'invoice' && t('employees.paymentInvoice')}
                  {employee.payment_type === 'credit' && t('employees.paymentCredit')}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('employees.location')}</h3>
                <p>{employee.location || t('general.notProvided')}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('employees.paymentInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('employees.hourlyRate')}</h3>
                <p>
                  {employee.hourly_rate
                    ? `${employee.hourly_rate} €/h`
                    : t('general.notProvided')}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('employees.netSalary')}</h3>
                <p>
                  {employee.net_salary
                    ? `${employee.net_salary} €`
                    : t('general.notProvided')}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('employees.grossSalary')}</h3>
                <p>
                  {employee.gross_salary
                    ? `${employee.gross_salary} €`
                    : t('general.notProvided')}
                </p>
              </div>
            </CardContent>
          </Card>

          {employee.licenses && employee.licenses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('employees.driverLicenses')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {employee.licenses.map((license, index) => {
                    let description = '';
                    switch(license.license_type) {
                      case 'B': description = t('licenses.B'); break;
                      case 'BE': description = t('licenses.BE'); break;
                      case 'C1': description = t('licenses.C1'); break;
                      case 'C1E': description = t('licenses.C1E'); break;
                      case 'C': description = t('licenses.C'); break;
                      case 'CE': description = t('licenses.CE'); break;
                    }
                    
                    return (
                      <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                        <span className="font-bold mr-1">{license.license_type}</span>
                        {description && (
                          <span className="text-xs">- {description}</span>
                        )}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {employee.regions && employee.regions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('employees.workRegions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {employee.regions.map((region, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {region.country}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {employee.notes && (
            <Card>
              <CardHeader>
                <CardTitle>{t('employees.notes')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{employee.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('employees.weeklySchedule')}</CardTitle>
              <CardDescription>{t('employees.scheduleDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {employee.availability && employee.availability.length > 0 ? (
                <div className="space-y-4">
                  {employee.availability
                    .sort((a, b) => {
                      // Sort from Monday(1) to Sunday(0)
                      const dayA = a.day_of_week === 0 ? 7 : a.day_of_week;
                      const dayB = b.day_of_week === 0 ? 7 : b.day_of_week;
                      return dayA - dayB;
                    })
                    .map((avail, index) => (
                      <div key={index} className="pb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{getDayName(avail.day_of_week)}</h3>
                          <Badge variant={avail.is_available ? "default" : "outline"}>
                            {avail.is_available 
                              ? t('employees.available') 
                              : t('employees.unavailable')}
                          </Badge>
                        </div>
                        
                        {avail.is_available && (
                          <div className="pl-4 border-l-2 border-muted">
                            {(avail.start_time || avail.end_time) && (
                              <div className="flex items-center text-sm mb-1">
                                <span>{t('employees.hours')}: </span>
                                <span className="ml-2">
                                  {avail.start_time || '--:--'} - {avail.end_time || '--:--'}
                                </span>
                              </div>
                            )}
                            
                            {avail.notes && (
                              <div className="text-sm text-muted-foreground">
                                {avail.notes}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {index < employee.availability.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground">{t('employees.noScheduleData')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDetails;
