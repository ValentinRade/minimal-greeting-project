
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEmployees } from '@/hooks/useEmployees';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Search, Users } from 'lucide-react';
import { Employee } from '@/types/employee';

const EmployeesList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { company } = useAuth();
  const {
    employees,
    isLoading,
    filter,
    setFilter,
    employeeTypeFilter,
    setEmployeeTypeFilter,
    positionFilter,
    setPositionFilter,
    availabilityFilter,
    setAvailabilityFilter,
  } = useEmployees(company?.id);

  // Collect unique positions for filter
  const positions = useMemo(() => {
    const posSet = new Set<string>();
    employees.forEach(emp => emp.position && posSet.add(emp.position));
    return Array.from(posSet);
  }, [employees]);

  // Stats calculation
  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const employed = employees.filter(emp => emp.employee_type === 'employed').length;
    const contractors = employees.filter(emp => emp.employee_type === 'contractor').length;
    
    // Calculate availability by day (simplified calculation)
    const availabilityByDay = Array(7).fill(0);
    employees.forEach(employee => {
      employee.availability?.forEach(avail => {
        if (avail.is_available) {
          availabilityByDay[avail.day_of_week]++;
        }
      });
    });
    
    const mostAvailableDay = availabilityByDay.indexOf(Math.max(...availabilityByDay));
    
    const dayNames = [
      t('days.sunday'),
      t('days.monday'),
      t('days.tuesday'),
      t('days.wednesday'),
      t('days.thursday'),
      t('days.friday'),
      t('days.saturday')
    ];
    
    return {
      totalEmployees,
      employed,
      contractors,
      employmentRatio: totalEmployees > 0 ? (employed / totalEmployees) * 100 : 0,
      contractorRatio: totalEmployees > 0 ? (contractors / totalEmployees) * 100 : 0,
      mostAvailableDay: mostAvailableDay !== -1 ? dayNames[mostAvailableDay] : t('general.none')
    };
  }, [employees, t]);

  const handleAddEmployee = () => {
    navigate('/dashboard/subcontractor/employees/add');
  };

  const handleEmployeeClick = (id: string) => {
    navigate(`/dashboard/subcontractor/employees/${id}`);
  };

  // Helper to display availability as a simple summary
  const formatAvailability = (employee: Employee) => {
    if (!employee.availability || employee.availability.length === 0) {
      return t('general.notSet');
    }
    
    const availableDays = employee.availability.filter(avail => avail.is_available).length;
    return t('employees.availableDays', { count: availableDays });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('employees.title')}</h1>
          <p className="text-muted-foreground">{t('employees.description')}</p>
        </div>
        <Button onClick={handleAddEmployee}>
          <Plus className="mr-1 h-4 w-4" />
          {t('employees.addNew')}
        </Button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('employees.totalEmployees')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{stats.totalEmployees}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('employees.employmentDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('employees.employed')}</span>
                <span className="font-medium">{stats.employed} ({stats.employmentRatio.toFixed(0)}%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('employees.contractors')}</span>
                <span className="font-medium">{stats.contractors} ({stats.contractorRatio.toFixed(0)}%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('employees.mostAvailableDay')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mostAvailableDay}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('employees.searchPlaceholder')}
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full pl-9"
          />
        </div>
        
        <Select
          value={employeeTypeFilter || "all"}
          onValueChange={(value) => setEmployeeTypeFilter(value === "all" ? "" : value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('employees.typeFilterPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{t('general.all')}</SelectItem>
              <SelectItem value="employed">{t('employees.typeEmployed')}</SelectItem>
              <SelectItem value="contractor">{t('employees.typeContractor')}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Select
          value={positionFilter || "all"}
          onValueChange={(value) => setPositionFilter(value === "all" ? "" : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('employees.positionFilterPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{t('general.all')}</SelectItem>
              {positions.map((position, index) => (
                <SelectItem key={index} value={position}>{position}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Select
          value={availabilityFilter !== null ? availabilityFilter.toString() : "all"}
          onValueChange={value => setAvailabilityFilter(value === "all" ? null : parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('employees.availabilityFilterPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{t('general.all')}</SelectItem>
              <SelectItem value="1">{t('days.monday')}</SelectItem>
              <SelectItem value="2">{t('days.tuesday')}</SelectItem>
              <SelectItem value="3">{t('days.wednesday')}</SelectItem>
              <SelectItem value="4">{t('days.thursday')}</SelectItem>
              <SelectItem value="5">{t('days.friday')}</SelectItem>
              <SelectItem value="6">{t('days.saturday')}</SelectItem>
              <SelectItem value="0">{t('days.sunday')}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Employees Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : employees.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">{t('employees.noEmployees')}</h3>
              <p className="text-sm text-muted-foreground">{t('employees.addFirst')}</p>
              <Button onClick={handleAddEmployee} variant="outline" className="mt-4">
                <Plus className="mr-1 h-4 w-4" />
                {t('employees.addNew')}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('employees.name')}</TableHead>
                    <TableHead>{t('employees.position')}</TableHead>
                    <TableHead>{t('employees.type')}</TableHead>
                    <TableHead>{t('employees.tourCount')}</TableHead>
                    <TableHead>{t('employees.vehicleCount')}</TableHead>
                    <TableHead>{t('employees.availability')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow 
                      key={employee.id}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => handleEmployeeClick(employee.id)}
                    >
                      <TableCell>
                        <div className="font-medium">
                          {employee.first_name} {employee.last_name}
                        </div>
                        {employee.email && (
                          <div className="text-sm text-muted-foreground">
                            {employee.email}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        {employee.employee_type === 'employed' 
                          ? t('employees.typeEmployed') 
                          : t('employees.typeContractor')}
                      </TableCell>
                      <TableCell>{employee.tour_count || 0}</TableCell>
                      <TableCell>{employee.vehicle_count || 0}</TableCell>
                      <TableCell>{formatAvailability(employee)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesList;
