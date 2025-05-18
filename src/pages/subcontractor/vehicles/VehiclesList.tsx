
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Truck, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  vehicle_type: {
    name: string;
  } | null;
  body_type: {
    name: string;
  } | null;
}

const VehiclesList = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { company } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const fetchVehicles = async () => {
    if (!company) {
      console.error('No company found');
      return [];
    }

    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        id, 
        brand, 
        model, 
        year, 
        license_plate,
        vehicle_type:vehicle_type_id(name),
        body_type:body_type_id(name)
      `)
      .eq('company_id', company.id);

    if (error) {
      console.error('Error fetching vehicles:', error);
      throw new Error(error.message);
    }

    return data || [];
  };

  const { data: vehicles = [], refetch } = useQuery({
    queryKey: ['vehicles', company?.id],
    queryFn: fetchVehicles,
    enabled: !!company?.id,
  });

  const handleDeleteClick = (id: string) => {
    setSelectedVehicleId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVehicleId) return;

    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', selectedVehicleId);

      if (error) throw error;

      toast({
        title: t('vehicles.vehicleDeleted'),
        duration: 3000,
      });

      refetch();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({
        title: t('common.error'),
        description: (error as Error)?.message || t('common.unknownError'),
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedVehicleId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t('vehicles.title')}</h1>
          <p className="text-muted-foreground">{t('vehicles.description')}</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/subcontractor/vehicles/add">
            <Plus className="mr-2 h-4 w-4" />
            {t('vehicles.addNew')}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('vehicles.list')}</CardTitle>
          <CardDescription>
            {t('vehicles.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vehicles.length === 0 ? (
            <div className="text-center p-8">
              <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">{t('vehicles.noVehicles')}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('vehicles.description')}
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link to="/dashboard/subcontractor/vehicles/add">
                    {t('vehicles.addNew')}
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('vehicles.form.vehicleType')}</TableHead>
                    <TableHead>{t('vehicles.form.brand')}</TableHead>
                    <TableHead>{t('vehicles.form.model')}</TableHead>
                    <TableHead>{t('vehicles.form.year')}</TableHead>
                    <TableHead>{t('vehicles.form.licensePlate')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle: Vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>{vehicle.vehicle_type?.name || '-'}</TableCell>
                      <TableCell>{vehicle.brand}</TableCell>
                      <TableCell>{vehicle.model}</TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell>{vehicle.license_plate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/dashboard/subcontractor/vehicles/${vehicle.id}`}>
                              <span className="sr-only">{t('vehicles.details')}</span>
                              <Truck className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/dashboard/subcontractor/vehicles/${vehicle.id}/edit`}>
                              <span className="sr-only">{t('vehicles.edit')}</span>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(vehicle.id)}
                          >
                            <span className="sr-only">{t('vehicles.delete')}</span>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('vehicles.delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('vehicles.confirmDelete')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              {t('vehicles.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VehiclesList;
